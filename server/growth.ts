import type { Express, RequestHandler, Response } from 'express'
import type { DatabaseSync } from 'node:sqlite'
import { randomBytes, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { HttpError } from './errors.js'
import { roadmapTemplates } from './roadmapTemplates.js'
import type { Challenge, Evidence, ExchangeOffer, ExchangeRequest, LearningProfile, Person, ProgressReport, Roadmap } from '../src/types/growth.js'
import type { MentorListing } from '../src/types/api.js'

const text = z.string().trim().min(1).max(200)
const description = z.string().trim().min(1).max(5000)
const skills = z.array(text).min(1).max(20).refine(values => new Set(values.map(v => v.toLowerCase())).size === values.length, 'Skills must be unique')
const url = z.string().url().max(2000).refine(value => /^https?:\/\//.test(value), 'Use an HTTP or HTTPS URL')
const uuid = z.string().uuid()
const now = () => new Date().toISOString()
const key = (value: string) => value.trim().toLowerCase()
const send = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data })
const read = <T>(rows: Record<string, unknown>[]) => rows.map(row => JSON.parse(row.data as string) as T)

export function hasExchangeConnection(db: DatabaseSync, a: string, b: string) {
  return !!db.prepare(`SELECT id FROM exchange_requests WHERE ((requester_id = ? AND recipient_id = ?) OR (requester_id = ? AND recipient_id = ?)) AND json_extract(data, '$.status') = 'active' LIMIT 1`).get(a, b, b, a)
}

export function registerGrowthRoutes(app: Express, db: DatabaseSync, auth: RequestHandler, listMentors: () => MentorListing[]) {
  function person(id: string): Person {
    const row = db.prepare('SELECT profile FROM users WHERE id = ?').get(id)
    if (!row) throw new HttpError(404, 'Member not found')
    const p = JSON.parse(row.profile as string)
    return { id, name: `${p.firstName} ${p.lastName}`, role: p.role }
  }
  function challenges(userId: string) {
    return read<Challenge>(db.prepare('SELECT data FROM challenges WHERE mentor_id = ? OR student_id = ? ORDER BY rowid DESC').all(userId, userId))
  }
  function challenge(id: unknown, userId: string) {
    const row = db.prepare('SELECT data FROM challenges WHERE id = ? AND (mentor_id = ? OR student_id = ?)').get(uuid.parse(id), userId, userId)
    if (!row) throw new HttpError(404, 'Challenge not found')
    return JSON.parse(row.data as string) as Challenge
  }
  function activeMentorship(id: string) {
    const row = db.prepare("SELECT * FROM mentorships WHERE id = ? AND status = 'active'").get(id)
    if (!row) throw new HttpError(409, 'An active mentorship is required')
    return row
  }
  function saveChallenge(item: Challenge) {
    item.updatedAt = now()
    db.prepare('UPDATE challenges SET data = ? WHERE id = ?').run(JSON.stringify(item), item.id)
  }
  function evidence(items: Challenge[]): Evidence[] {
    return items.filter(item => item.status === 'accepted').map(item => {
      const attempt = item.attempts.at(-1)!
      const review = attempt.review!
      return { id: item.id, title: item.title, description: item.description, url: attempt.url, summary: attempt.summary,
        skills: review.endorsedSkills, feedback: review.feedback, reviewedAt: review.reviewedAt, mentor: person(item.mentorId) }
    })
  }
  function passport(userId: string) {
    return { name: person(userId).name, evidence: evidence(challenges(userId).filter(item => item.studentId === userId)) }
  }
  const defaultPreferences: LearningProfile = { skills: [], careerGoal: '', budget: null, availability: '' }
  const preferencesSchema = z.object({
    skills: z.array(text).max(20), careerGoal: z.string().trim().max(500),
    budget: z.number().min(0).max(10000).nullable(),
    availability: z.enum(['', 'immediate', 'this-week', 'next-week', 'flexible']),
  }).strict()
  app.get('/api/learning-profile', auth, (_req, res) => {
    const row = db.prepare('SELECT data FROM learning_profiles WHERE user_id = ?').get(res.locals.user.id)
    send(res, row ? JSON.parse(row.data as string) : defaultPreferences)
  })
  app.put('/api/learning-profile', auth, (req, res) => {
    const input = preferencesSchema.parse(req.body)
    db.prepare('INSERT INTO learning_profiles VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data').run(res.locals.user.id, JSON.stringify(input))
    send(res, input)
  })
  app.get('/api/mentor-matches', auth, (_req, res) => {
    const row = db.prepare('SELECT data FROM learning_profiles WHERE user_id = ?').get(res.locals.user.id)
    const prefs: LearningProfile = row ? JSON.parse(row.data as string) : defaultPreferences
    const totalWeight = (prefs.skills.length ? 50 : 0) + (prefs.budget !== null ? 20 : 0) + (prefs.availability ? 20 : 0) + (prefs.careerGoal ? 10 : 0)
    const matches = listMentors().filter(m => m.id !== res.locals.user.id).map(mentor => {
      let points = 0
      const reasons: string[] = []
      const shared = prefs.skills.filter(skill => mentor.skills.some(expertise => key(expertise) === key(skill)))
      if (prefs.skills.length) {
        points += 50 * shared.length / prefs.skills.length
        reasons.push(shared.length ? `Relevant skills: ${shared.join(', ')}` : 'No exact skill overlap')
      }
      if (prefs.budget !== null) {
        const fits = mentor.hourlyRate <= prefs.budget
        points += fits ? 20 : 0
        reasons.push(fits ? 'Within your hourly budget' : 'Above your hourly budget')
      }
      if (prefs.availability) {
        const fits = mentor.availabilityValue === prefs.availability || mentor.availabilityValue === 'flexible'
        points += fits ? 20 : 0
        reasons.push(fits ? 'Availability matches or is flexible' : 'Availability differs from your preference')
      }
      if (prefs.careerGoal) {
        const words = key(prefs.careerGoal).split(/\W+/).filter(word => word.length > 3)
        const profile = key([mentor.title, mentor.bio, ...mentor.specializations].join(' '))
        const overlap = words.some(word => profile.includes(word))
        points += overlap ? 10 : 0
        reasons.push(overlap ? 'Profile mentions your career interests' : 'No career-goal keyword match')
      }
      return { mentor, score: totalWeight ? Math.round(100 * points / totalWeight) : 0, reasons: reasons.length ? reasons : ['Save your learning preferences to compare mentors'], hasPreferences: totalWeight > 0 }
    }).sort((a, b) => b.score - a.score || a.mentor.name.localeCompare(b.mentor.name) || a.mentor.id.localeCompare(b.mentor.id))
    send(res, matches)
  })
  app.get('/api/connections', auth, (_req, res) => {
    const userId = res.locals.user.id
    const memberships = db.prepare("SELECT student_id, mentor_id FROM mentorships WHERE status = 'active' AND (student_id = ? OR mentor_id = ?)").all(userId, userId)
    const exchanges = db.prepare("SELECT requester_id, recipient_id FROM exchange_requests WHERE json_extract(data, '$.status') = 'active' AND (requester_id = ? OR recipient_id = ?)").all(userId, userId)
    const connected = new Map<string, { peer: Person; kind: string }>()
    for (const row of memberships) {
      const id = String(row.student_id === userId ? row.mentor_id : row.student_id)
      connected.set(id, { peer: person(id), kind: 'mentorship' })
    }
    for (const row of exchanges) {
      const id = String(row.requester_id === userId ? row.recipient_id : row.requester_id)
      if (!connected.has(id)) connected.set(id, { peer: person(id), kind: 'exchange' })
    }
    send(res, [...connected.values()])
  })
  app.get('/api/mentorship-details', auth, (_req, res) => {
    const rows = db.prepare('SELECT * FROM mentorships WHERE mentor_id = ? OR student_id = ? ORDER BY rowid DESC').all(res.locals.user.id, res.locals.user.id)
    send(res, rows.map(row => ({ id: row.id, mentorId: row.mentor_id, studentId: row.student_id, status: row.status, createdAt: row.created_at, mentor: person(String(row.mentor_id)), student: person(String(row.student_id)) })))
  })
  app.get('/api/challenges', auth, (_req, res) => send(res, challenges(res.locals.user.id).map(item => ({ ...item, mentor: person(item.mentorId), student: person(item.studentId) }))))
  app.post('/api/challenges', auth, (req, res) => {
    if (res.locals.user.role !== 'mentor') throw new HttpError(403, 'Only mentors can assign challenges')
    const input = z.object({ mentorshipId: uuid, title: text, description, skills,
      dueDate: z.iso.date().optional() }).strict().parse(req.body)
    const relation = activeMentorship(input.mentorshipId)
    if (relation.mentor_id !== res.locals.user.id) throw new HttpError(403, 'This mentorship belongs to another mentor')
    const createdAt = now()
    const item: Challenge = { ...input, id: randomUUID(), mentorId: res.locals.user.id, studentId: String(relation.student_id), status: 'assigned', attempts: [], createdAt, updatedAt: createdAt }
    db.prepare('INSERT INTO challenges VALUES (?, ?, ?, ?, ?)').run(item.id, item.mentorshipId, item.mentorId, item.studentId, JSON.stringify(item))
    send(res, item, 201)
  })
  app.post('/api/challenges/:id/submit', auth, (req, res) => {
    const input = z.object({ url, summary: description }).strict().parse(req.body)
    const item = challenge(req.params.id, res.locals.user.id)
    if (item.studentId !== res.locals.user.id) throw new HttpError(403, 'Only the assigned student can submit work')
    activeMentorship(item.mentorshipId)
    if (!['assigned', 'revision_requested'].includes(item.status)) throw new HttpError(409, 'This challenge is not awaiting a submission')
    if (item.attempts.length >= 20) throw new HttpError(409, 'Submission limit reached; ask for a new challenge')
    item.attempts.push({ ...input, submittedAt: now() })
    item.status = 'submitted'
    saveChallenge(item)
    send(res, item)
  })
  app.post('/api/challenges/:id/review', auth, (req, res) => {
    const input = z.object({ outcome: z.enum(['accepted', 'revision_requested']), feedback: description, endorsedSkills: z.array(text).max(20).default([]) }).strict().parse(req.body)
    const item = challenge(req.params.id, res.locals.user.id)
    if (item.mentorId !== res.locals.user.id) throw new HttpError(403, 'Only the assigned mentor can review work')
    activeMentorship(item.mentorshipId)
    if (item.status !== 'submitted') throw new HttpError(409, 'Only submitted work can be reviewed')
    if (input.endorsedSkills.some(skill => !item.skills.includes(skill)) || new Set(input.endorsedSkills).size !== input.endorsedSkills.length) throw new HttpError(400, 'Endorsements must be unique skills from the challenge')
    if (input.outcome !== 'accepted' && input.endorsedSkills.length) throw new HttpError(400, 'Only accepted work can receive endorsements')
    item.attempts.at(-1)!.review = { ...input, reviewedAt: now() }
    item.status = input.outcome
    saveChallenge(item)
    send(res, item)
  })
  app.get('/api/passport', auth, (_req, res) => {
    const row = db.prepare('SELECT share_token FROM passports WHERE user_id = ?').get(res.locals.user.id)
    send(res, { ...passport(res.locals.user.id), shareToken: row?.share_token ?? null })
  })
  app.put('/api/passport/sharing', auth, (req, res) => {
    const { published } = z.object({ published: z.boolean() }).strict().parse(req.body)
    const row = db.prepare('SELECT share_token FROM passports WHERE user_id = ?').get(res.locals.user.id)
    const token = published ? row?.share_token ?? randomBytes(24).toString('hex') : null
    db.prepare('INSERT INTO passports VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET share_token = excluded.share_token').run(res.locals.user.id, token)
    send(res, { shareToken: token })
  })
  app.get('/api/public/passports/:token', (req, res) => {
    const token = z.string().regex(/^[a-f0-9]{48}$/).safeParse(req.params.token)
    const row = token.success ? db.prepare('SELECT user_id FROM passports WHERE share_token = ?').get(token.data) : undefined
    if (!row) throw new HttpError(404, 'Passport is not shared')
    send(res, passport(String(row.user_id)))
  })
  app.get('/api/roadmap-templates', auth, (_req, res) => send(res, roadmapTemplates))
  app.get('/api/roadmaps', auth, (_req, res) => send(res, read<Roadmap>(db.prepare('SELECT data FROM roadmaps WHERE owner_id = ? ORDER BY rowid DESC').all(res.locals.user.id))))
  app.post('/api/roadmaps', auth, (req, res) => {
    const input = z.object({ templateId: text, title: text.optional() }).strict().parse(req.body)
    const template = roadmapTemplates.find(item => item.id === input.templateId)
    if (!template) throw new HttpError(400, 'Unknown roadmap template')
    // Materialize editable goals atomically; templates are guides, not AI predictions.
    const roadmap: Roadmap = { id: randomUUID(), title: input.title ?? template.title, templateId: template.id, goalIds: [], createdAt: now() }
    db.exec('BEGIN')
    try {
      for (const step of template.steps) {
        const goal = { id: randomUUID(), title: step.title, description: step.description, status: 'todo', priority: 'medium', skills: [], progress: 0,
          milestones: step.milestones.map(title => ({ id: randomUUID(), title, description: '', completed: false })), createdAt: roadmap.createdAt, updatedAt: roadmap.createdAt }
        roadmap.goalIds.push(goal.id)
        db.prepare('INSERT INTO records VALUES (?, ?, ?, ?)').run(goal.id, res.locals.user.id, 'goals', JSON.stringify(goal))
      }
      db.prepare('INSERT INTO roadmaps VALUES (?, ?, ?)').run(roadmap.id, res.locals.user.id, JSON.stringify(roadmap))
      db.exec('COMMIT')
    } catch (error) { db.exec('ROLLBACK'); throw error }
    send(res, roadmap, 201)
  })
  function offer(id: unknown): ExchangeOffer {
    const row = db.prepare('SELECT data FROM exchange_offers WHERE id = ?').get(uuid.parse(id))
    if (!row) throw new HttpError(404, 'Exchange offer not found')
    return JSON.parse(row.data as string)
  }
  function exchange(id: unknown, userId: string): ExchangeRequest {
    const row = db.prepare('SELECT data FROM exchange_requests WHERE id = ? AND (requester_id = ? OR recipient_id = ?)').get(uuid.parse(id), userId, userId)
    if (!row) throw new HttpError(404, 'Exchange request not found')
    return JSON.parse(row.data as string)
  }
  const reciprocal = (a: ExchangeOffer, b: ExchangeOffer) => key(a.teach) === key(b.learn) && key(a.learn) === key(b.teach)
  app.get('/api/exchange-offers', auth, (_req, res) => {
    const rows = read<ExchangeOffer>(db.prepare('SELECT data FROM exchange_offers ORDER BY rowid DESC').all())
    const own = rows.filter(item => item.ownerId === res.locals.user.id && item.active)
    send(res, rows.filter(item => item.active || item.ownerId === res.locals.user.id).map(item => ({ ...item, owner: person(item.ownerId), reciprocal: item.ownerId !== res.locals.user.id && own.some(mine => reciprocal(mine, item)) })))
  })
  app.post('/api/exchange-offers', auth, (req, res) => {
    const input = z.object({ teach: text, learn: text, description }).strict().refine(value => key(value.teach) !== key(value.learn), 'Choose two different skills').parse(req.body)
    const item: ExchangeOffer = { ...input, id: randomUUID(), ownerId: res.locals.user.id, active: true }
    db.prepare('INSERT INTO exchange_offers VALUES (?, ?, ?)').run(item.id, item.ownerId, JSON.stringify(item))
    send(res, item, 201)
  })
  app.patch('/api/exchange-offers/:id', auth, (req, res) => {
    const input = z.object({ active: z.boolean() }).strict().parse(req.body)
    const item = offer(req.params.id)
    if (item.ownerId !== res.locals.user.id) throw new HttpError(404, 'Exchange offer not found')
    item.active = input.active
    db.prepare('UPDATE exchange_offers SET data = ? WHERE id = ?').run(JSON.stringify(item), item.id)
    send(res, item)
  })
  app.get('/api/exchanges', auth, (_req, res) => {
    const rows = read<ExchangeRequest>(db.prepare('SELECT data FROM exchange_requests WHERE requester_id = ? OR recipient_id = ? ORDER BY rowid DESC').all(res.locals.user.id, res.locals.user.id))
    send(res, rows.map(item => ({ ...item, requester: person(item.requesterId), recipient: person(item.recipientId) })))
  })
  app.post('/api/exchanges', auth, (req, res) => {
    const input = z.object({ offerId: uuid, requesterOfferId: uuid }).strict().parse(req.body)
    const theirs = offer(input.offerId), mine = offer(input.requesterOfferId)
    if (mine.ownerId !== res.locals.user.id || theirs.ownerId === res.locals.user.id) throw new HttpError(403, 'Choose your own offer and another member’s offer')
    if (!mine.active || !theirs.active || !reciprocal(mine, theirs)) throw new HttpError(400, 'Active offers must exchange complementary skills')
    const pairKey = [mine.id, theirs.id].sort().join(':')
    if (db.prepare('SELECT id FROM exchange_requests WHERE pair_key = ?').get(pairKey)) throw new HttpError(409, 'An exchange request already exists for these offers')
    const item: ExchangeRequest = { ...input, id: randomUUID(), requesterId: mine.ownerId, recipientId: theirs.ownerId, status: 'pending', createdAt: now(), teach: mine.teach, learn: mine.learn }
    db.prepare('INSERT INTO exchange_requests VALUES (?, ?, ?, ?, ?)').run(item.id, item.requesterId, item.recipientId, pairKey, JSON.stringify(item))
    send(res, item, 201)
  })
  app.patch('/api/exchanges/:id', auth, (req, res) => {
    const { status } = z.object({ status: z.enum(['active', 'completed', 'cancelled']) }).strict().parse(req.body)
    const item = exchange(req.params.id, res.locals.user.id)
    if (['completed', 'cancelled'].includes(item.status)) throw new HttpError(409, 'This exchange is already closed')
    if (status === 'active') {
      if (item.status !== 'pending' || item.recipientId !== res.locals.user.id) throw new HttpError(403, 'Only the recipient can accept a pending exchange')
      if (!offer(item.offerId).active || !offer(item.requesterOfferId).active) throw new HttpError(409, 'An exchange offer is no longer active')
    }
    if (status === 'completed' && item.status !== 'active') throw new HttpError(409, 'Only active exchanges can be completed')
    item.status = status
    db.prepare('UPDATE exchange_requests SET data = ? WHERE id = ?').run(JSON.stringify(item), item.id)
    send(res, item)
  })
  app.get('/api/reports', auth, (_req, res) => {
    const userId = res.locals.user.id
    const relations = db.prepare('SELECT * FROM mentorships WHERE mentor_id = ? OR student_id = ? ORDER BY rowid DESC').all(userId, userId)
    const all = challenges(userId)
    const reports: ProgressReport[] = relations.map(row => {
      const items = all.filter(item => item.mentorshipId === row.id)
      const proof = evidence(items)
      return { mentorshipId: String(row.id), mentor: person(String(row.mentor_id)), student: person(String(row.student_id)), status: String(row.status),
        assigned: items.length, submitted: items.filter(item => item.attempts.length > 0).length, accepted: proof.length,
        revisions: items.flatMap(item => item.attempts).filter(attempt => attempt.review?.outcome === 'revision_requested').length,
        endorsedSkills: [...new Set(proof.flatMap(item => item.skills))], evidence: proof,
        timeline: items.flatMap(item => [{ at: item.createdAt, event: 'Assigned', title: item.title }, ...item.attempts.flatMap(attempt => [
          { at: attempt.submittedAt, event: 'Submitted', title: item.title },
          ...(attempt.review ? [{ at: attempt.review.reviewedAt, event: attempt.review.outcome === 'accepted' ? 'Accepted' : 'Revision requested', title: item.title }] : []),
        ])]).sort((a, b) => a.at.localeCompare(b.at)) }
    })
    send(res, reports)
  })
  app.get('/api/dashboard', auth, (_req, res) => {
    const userId = res.locals.user.id
    const records = db.prepare('SELECT kind, data FROM records WHERE owner_id = ?').all(userId)
    const goals = records.filter(row => row.kind === 'goals').map(row => JSON.parse(row.data as string))
    const all = challenges(userId)
    send(res, { skills: records.filter(row => row.kind === 'skills').length, activeGoals: goals.filter(g => g.status !== 'completed').length,
      completedGoals: goals.filter(g => g.status === 'completed').length, assignedChallenges: all.length,
      acceptedChallenges: all.filter(c => c.status === 'accepted').length,
      activeMentorships: Number(db.prepare("SELECT COUNT(*) AS count FROM mentorships WHERE status = 'active' AND (student_id = ? OR mentor_id = ?)").get(userId, userId)!.count) })
  })
}
