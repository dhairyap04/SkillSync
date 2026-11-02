import express, { type ErrorRequestHandler, type RequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { randomBytes, randomUUID } from 'node:crypto'
import { z, ZodError } from 'zod'
import type { DatabaseSync } from 'node:sqlite'
import { hashPassword, verifyPassword, tokenHash } from './auth.js'
import { signupSchema, loginSchema, profileSchema, mentorSchema, skillSchema, goalSchema, mentorQuerySchema } from './schemas.js'
import { registerGrowthRoutes, hasExchangeConnection } from './growth.js'
import { HttpError } from './errors.js'
import { filterMentors } from '../src/lib/mentorFilters.js'

interface UserProfile {
  id: string; email: string; firstName: string; lastName: string; role: 'student' | 'mentor'
  isVerified: boolean; createdAt: string; updatedAt: string
  [key: string]: unknown
}
interface UserRow { id: string; email: string; password_hash: string; profile: string }
const cookieName = 'skillsync_session'
const sessionLifetime = 7 * 24 * 60 * 60 * 1000

export function createApp(db: DatabaseSync, options: { origin?: string; secure?: boolean } = {}) {
  const app = express()
  const origin = options.origin ?? 'http://localhost:5173'
  const secure = options.secure ?? false
  const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, secure, path: '/' }
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(express.json({ limit: '64kb' }))
  app.use(cookieParser())
  // A custom header forces cross-origin browser clients through a preflight;
  // no cross-origin access is enabled. Also reject untrusted browser origins.
  app.use('/api', (req, _res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
        (req.get('X-SkillSync-Client') !== 'web' || (req.get('Origin') && req.get('Origin') !== origin))) {
      throw new HttpError(403, 'Request origin is not allowed')
    }
    next()
  })
  const limitResponse: RequestHandler = (_req, res) => { res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' }) }
  app.use('/api', rateLimit({ handler: limitResponse, windowMs: 60_000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }))
  app.use(['/api/auth/signup', '/api/auth/login'], rateLimit({ handler: limitResponse, windowMs: 15 * 60_000, limit: 50, standardHeaders: 'draft-8', legacyHeaders: false }))
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next() })
  const send = (res: express.Response, data: unknown, status = 200) => res.status(status).json({ success: true, data })
  const requireAuth: RequestHandler = (req, res, next) => {
    const token = req.cookies[cookieName]
    if (typeof token !== 'string') throw new HttpError(401, 'Please sign in')
    const row = db.prepare(`SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id
      WHERE token_hash = ? AND expires_at > ?`).get(tokenHash(token), Date.now()) as UserRow | undefined
    if (!row) throw new HttpError(401, 'Session expired. Please sign in')
    res.locals.user = JSON.parse(row.profile) as UserProfile
    next()
  }
  function startSession(req: express.Request, res: express.Response, id: string) {
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())
    if (typeof req.cookies[cookieName] === 'string') db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(req.cookies[cookieName]))
    const token = randomBytes(32).toString('hex')
    db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(tokenHash(token), id, Date.now() + sessionLifetime)
    res.cookie(cookieName, token, { ...cookieOptions, maxAge: sessionLifetime })
  }
  app.get('/api/health', (_req, res) => { db.prepare('SELECT 1').get(); send(res, { status: 'ok' }) })
  app.post('/api/auth/signup', async (req, res) => {
    const input = signupSchema.parse(req.body)
    const passwordHash = await hashPassword(input.password)
    const now = new Date().toISOString()
    const user: UserProfile = { id: randomUUID(), email: input.email, firstName: input.firstName,
      lastName: input.lastName, role: input.role, isVerified: false, createdAt: now, updatedAt: now }
    try {
      db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)').run(user.id, user.email, passwordHash, JSON.stringify(user))
    } catch (error) {
      if ((error as { errcode?: number }).errcode === 2067) throw new HttpError(409, 'An account with this email already exists')
      throw error
    }
    startSession(req, res, user.id)
    send(res, user, 201)
  })
  // A dummy hash ensures missing accounts still perform the password derivation.
  const dummyHash = hashPassword(randomBytes(32).toString('hex'))
  app.post('/api/auth/login', async (req, res) => {
    const input = loginSchema.parse(req.body)
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(input.email) as UserRow | undefined
    const valid = await verifyPassword(input.password, row?.password_hash ?? await dummyHash)
    if (!row || !valid) throw new HttpError(401, 'Invalid email or password')
    startSession(req, res, row.id)
    send(res, JSON.parse(row.profile))
  })
  app.post('/api/auth/logout', (req, res) => {
    if (typeof req.cookies[cookieName] === 'string') db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(req.cookies[cookieName]))
    res.clearCookie(cookieName, cookieOptions)
    send(res, null)
  })
  app.get('/api/auth/me', requireAuth, (_req, res) => send(res, res.locals.user))
  app.patch('/api/users/me', requireAuth, (req, res) => {
    const input = profileSchema.parse(req.body)
    const user = { ...res.locals.user, ...input, updatedAt: new Date().toISOString() }
    try {
      db.prepare('UPDATE users SET email = ?, profile = ? WHERE id = ?').run(user.email, JSON.stringify(user), user.id)
    } catch (error) {
      if ((error as { errcode?: number }).errcode === 2067) throw new HttpError(409, 'An account with this email already exists')
      throw error
    }
    send(res, user)
  })
  app.put('/api/mentors/me', requireAuth, (req, res) => {
    if (res.locals.user.role !== 'mentor') throw new HttpError(403, 'A mentor account is required')
    const data = mentorSchema.parse(req.body)
    db.prepare('INSERT INTO mentor_profiles VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data')
      .run(res.locals.user.id, JSON.stringify(data))
    send(res, data)
  })
  const availabilityLabels = { immediate: 'Available now', 'this-week': 'Available this week', 'next-week': 'Next week', flexible: 'Flexible' }
  function listMentors() {
    const rows = db.prepare('SELECT users.profile, mentor_profiles.data FROM mentor_profiles JOIN users ON users.id = mentor_profiles.user_id ORDER BY users.id').all() as { profile: string; data: string }[]
    return rows.map(row => {
      const user = JSON.parse(row.profile) as UserProfile
      const data = mentorSchema.parse(JSON.parse(row.data))
      return { ...data, id: user.id, name: `${user.firstName} ${user.lastName}`,
        experience: `${data.experienceYears} years`, availability: availabilityLabels[data.availabilityValue],
        rating: 0, reviewCount: 0, isVerified: user.isVerified, isOnline: false,
        responseTime: 'Response time not yet available', sessionCount: 0, successRate: 0 }
    })
  }
  app.get('/api/mentors', (req, res) => {
    const query = mentorQuerySchema.parse(req.query)
    const matches = filterMentors(listMentors(), { searchTerm: query.search, selectedSkills: query.skills.split(',').filter(Boolean),
      selectedExperience: query.experience, selectedAvailability: query.availability, priceRange: [query.minPrice, query.maxPrice] })
    res.json({ success: true, data: matches.slice((query.page - 1) * query.limit, query.page * query.limit),
      pagination: { page: query.page, limit: query.limit, total: matches.length, totalPages: Math.ceil(matches.length / query.limit) } })
  })
  app.get('/api/mentors/:id', (req, res) => {
    const mentor = listMentors().find(item => item.id === req.params.id)
    if (!mentor) throw new HttpError(404, 'Mentor not found')
    send(res, mentor)
  })
  for (const [kind, schema] of [['skills', skillSchema], ['goals', goalSchema]] as const) {
    const base = `/api/${kind}`
    app.get(base, requireAuth, (_req, res) => {
      const rows = db.prepare('SELECT data FROM records WHERE owner_id = ? AND kind = ? ORDER BY rowid').all(res.locals.user.id, kind) as { data: string }[]
      send(res, rows.map(row => JSON.parse(row.data)))
    })
    const validateGoalSkills = (data: Record<string, unknown>, owner: string) => {
      if (kind !== 'goals') return
      for (const id of data.skills as string[]) {
        if (!db.prepare("SELECT id FROM records WHERE id = ? AND owner_id = ? AND kind = 'skills'").get(id, owner)) throw new HttpError(400, 'Goal skills must belong to your account')
      }
    }
    app.post(base, requireAuth, (req, res) => {
      const input = schema.parse(req.body)
      validateGoalSkills(input, res.locals.user.id)
      const now = new Date().toISOString()
      const data = { ...input, ...(kind === 'skills' ? { evidence: (input as z.infer<typeof skillSchema>).evidence.map(item => ({ ...item, verified: false })), goals: [] } : {}), id: randomUUID(), createdAt: now, updatedAt: now }
      db.prepare('INSERT INTO records VALUES (?, ?, ?, ?)').run(data.id, res.locals.user.id, kind, JSON.stringify(data))
      send(res, data, 201)
    })
    app.put(`${base}/:id`, requireAuth, (req, res) => {
      const input = schema.parse(req.body)
      validateGoalSkills(input, res.locals.user.id)
      const row = db.prepare('SELECT data FROM records WHERE id = ? AND owner_id = ? AND kind = ?').get(z.string().uuid().parse(req.params.id), res.locals.user.id, kind) as { data: string } | undefined
      if (!row) throw new HttpError(404, 'Record not found')
      const previous = JSON.parse(row.data)
      const data = { ...input, ...(kind === 'skills' ? { evidence: (input as z.infer<typeof skillSchema>).evidence.map(item => ({ ...item, verified: false })), goals: [] } : {}), id: previous.id, createdAt: previous.createdAt, updatedAt: new Date().toISOString() }
      db.prepare('UPDATE records SET data = ? WHERE id = ? AND owner_id = ? AND kind = ?').run(JSON.stringify(data), z.string().uuid().parse(req.params.id), res.locals.user.id, kind)
      send(res, data)
    })
    app.delete(`${base}/:id`, requireAuth, (req, res) => {
      if (kind === 'skills') {
        const linked = db.prepare("SELECT records.id FROM records, json_each(records.data, '$.skills') AS skill WHERE owner_id = ? AND kind = 'goals' AND skill.value = ? LIMIT 1").get(res.locals.user.id, z.string().uuid().parse(req.params.id))
        if (linked) throw new HttpError(409, 'Remove this skill from its goals before deleting it')
      }
      const result = db.prepare('DELETE FROM records WHERE id = ? AND owner_id = ? AND kind = ?').run(z.string().uuid().parse(req.params.id), res.locals.user.id, kind)
      if (!result.changes) throw new HttpError(404, 'Record not found')
      if (kind === 'goals') {
        for (const row of db.prepare('SELECT id, data FROM roadmaps WHERE owner_id = ?').all(res.locals.user.id)) {
          const roadmap = JSON.parse(row.data as string)
          roadmap.goalIds = roadmap.goalIds.filter((id: string) => id !== req.params.id)
          db.prepare('UPDATE roadmaps SET data = ? WHERE id = ?').run(JSON.stringify(roadmap), row.id)
        }
      }
      send(res, null)
    })
  }
  function mentorshipData(row: { id: string; student_id: string; mentor_id: string; status: string; created_at: string }) {
    return { id: row.id, studentId: row.student_id, mentorId: row.mentor_id, status: row.status, createdAt: row.created_at }
  }
  app.get('/api/mentorships', requireAuth, (_req, res) => {
    const rows = db.prepare('SELECT * FROM mentorships WHERE student_id = ? OR mentor_id = ? ORDER BY created_at DESC').all(res.locals.user.id, res.locals.user.id) as Parameters<typeof mentorshipData>[0][]
    send(res, rows.map(mentorshipData))
  })
  app.post('/api/mentorships', requireAuth, (req, res) => {
    if (res.locals.user.role !== 'student') throw new HttpError(403, 'A student account is required')
    const { mentorId } = z.object({ mentorId: z.string().uuid() }).strict().parse(req.body)
    if (!db.prepare('SELECT user_id FROM mentor_profiles WHERE user_id = ?').get(mentorId)) throw new HttpError(404, 'Mentor not found')
    const row = { id: randomUUID(), student_id: res.locals.user.id, mentor_id: mentorId, status: 'pending', created_at: new Date().toISOString() }
    try {
      db.prepare('INSERT INTO mentorships VALUES (?, ?, ?, ?, ?)').run(row.id, row.student_id, row.mentor_id, row.status, row.created_at)
    } catch (error) {
      if ((error as { errcode?: number }).errcode === 2067) throw new HttpError(409, 'A mentorship request already exists')
      throw error
    }
    send(res, mentorshipData(row), 201)
  })
  app.patch('/api/mentorships/:id', requireAuth, (req, res) => {
    const { status } = z.object({ status: z.enum(['active', 'completed', 'cancelled']) }).strict().parse(req.body)
    const row = db.prepare('SELECT * FROM mentorships WHERE id = ? AND (student_id = ? OR mentor_id = ?)').get(z.string().uuid().parse(req.params.id), res.locals.user.id, res.locals.user.id) as Parameters<typeof mentorshipData>[0] | undefined
    if (!row) throw new HttpError(404, 'Mentorship not found')
    if (status === 'active' && (row.mentor_id !== res.locals.user.id || row.status !== 'pending')) throw new HttpError(403, 'Only the mentor can accept a pending request')
    if (status === 'completed' && row.status !== 'active') throw new HttpError(409, 'Only active mentorships can be completed')
    if (['completed', 'cancelled'].includes(row.status)) throw new HttpError(409, 'Mentorship is already closed')
    db.prepare('UPDATE mentorships SET status = ? WHERE id = ?').run(status, row.id)
    send(res, mentorshipData({ ...row, status }))
  })
  function requireConnection(userId: string, peerId: string) {
    if (!hasExchangeConnection(db, userId, peerId) && !db.prepare("SELECT id FROM mentorships WHERE status = 'active' AND ((student_id = ? AND mentor_id = ?) OR (student_id = ? AND mentor_id = ?))").get(userId, peerId, peerId, userId)) throw new HttpError(403, 'An active mentorship is required to exchange messages')
  }
  app.get('/api/messages/:peerId', requireAuth, (req, res) => {
    const peerId = z.string().uuid().parse(req.params.peerId)
    requireConnection(res.locals.user.id, peerId)
    const query = z.object({ page: z.coerce.number().int().min(1).max(100000).default(1), limit: z.coerce.number().int().min(1).max(100).default(50) }).strict().parse(req.query)
    const rows = db.prepare('SELECT id, sender_id AS senderId, receiver_id AS receiverId, content, created_at AS createdAt FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at DESC, rowid DESC LIMIT ? OFFSET ?').all(res.locals.user.id, peerId, peerId, res.locals.user.id, query.limit, (query.page - 1) * query.limit)
    send(res, rows.reverse())
  })
  app.post('/api/messages', requireAuth, (req, res) => {
    const input = z.object({ receiverId: z.string().uuid(), content: z.string().trim().min(1).max(5000) }).strict().parse(req.body)
    requireConnection(res.locals.user.id, input.receiverId)
    const message = { id: randomUUID(), senderId: res.locals.user.id, ...input, createdAt: new Date().toISOString() }
    db.prepare('INSERT INTO messages VALUES (?, ?, ?, ?, ?)').run(message.id, message.senderId, message.receiverId, message.content, message.createdAt)
    send(res, message, 201)
  })
  registerGrowthRoutes(app, db, requireAuth, listMentors)
  app.use('/api', (_req, _res) => { throw new HttpError(404, 'Endpoint not found') })
  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) { res.status(400).json({ success: false, message: 'Invalid input', errors: error.flatten() }); return }
    if (error instanceof HttpError) { res.status(error.status).json({ success: false, message: error.message }); return }
    if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
      res.status(error.type === 'entity.too.large' ? 413 : 400).json({ success: false, message: 'Invalid JSON request body' }); return
    }
    console.error(error)
    res.status(500).json({ success: false, message: 'An unexpected error occurred' })
  }
  app.use(errorHandler)
  return app
}
