import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fixture } from './helpers.js'
import { openDatabase } from '../server/db.js'

const signup = (email: string, role = 'student') => ({ email, password: 'StrongPass123', firstName: 'Test', lastName: 'Person', role, agreeToTerms: true })
const mentorProfile = { title: 'Engineer', company: 'SkillSync', location: 'Edmonton', bio: 'I teach React', skills: ['React'], experienceYears: 8, hourlyRate: 75, availabilityValue: 'this-week' }


test('accounts use hashed passwords and revocable HttpOnly sessions', async () => {
  const f = await fixture()
  try {
    const account = await f.request('/auth/signup', 'POST', signup(' User@Example.com '))
    assert.equal(account.status, 201)
    assert.equal(account.body.data.email, 'user@example.com')
    assert.equal(account.body.data.isVerified, false)
    assert.equal(account.body.data.password, undefined)
    assert.match(account.headers.get('set-cookie')!, /HttpOnly/)
    assert.match(account.headers.get('set-cookie')!, /SameSite=Lax/)
    const row = f.db.prepare('SELECT password_hash FROM users').get() as { password_hash: string }
    assert.notEqual(row.password_hash, 'StrongPass123')
    const session = f.db.prepare('SELECT token_hash FROM sessions').get() as { token_hash: string }
    assert.notEqual(session.token_hash, account.cookie.split('=')[1])
    assert.equal((await f.request('/auth/me', 'GET', undefined, account.cookie)).status, 200)
    assert.equal((await f.request('/auth/login', 'POST', { email: 'user@example.com', password: 'wrong' })).status, 401)
    assert.equal((await f.request('/auth/login', 'POST', { email: 'missing@example.com', password: 'wrong' })).status, 401)
    const login = await f.request('/auth/login', 'POST', { email: 'USER@example.com', password: 'StrongPass123' }, account.cookie)
    assert.equal(login.status, 200)
    assert.equal((await f.request('/auth/me', 'GET', undefined, account.cookie)).status, 401)
    await f.request('/auth/logout', 'POST', undefined, login.cookie)
    assert.equal((await f.request('/auth/me', 'GET', undefined, login.cookie)).status, 401)
  } finally { await f.close() }
})

test('validation rejects duplicate email, weak passwords, privilege escalation and CSRF', async () => {
  const f = await fixture()
  try {
    assert.equal((await f.request('/auth/signup', 'POST', { ...signup('a@example.com'), password: 'weak' })).status, 400)
    assert.equal((await f.request('/auth/signup', 'POST', { ...signup('a@example.com'), agreeToTerms: false })).status, 400)
    assert.equal((await f.request('/auth/signup', 'POST', signup('a@example.com'), '', { Origin: 'https://evil.example' })).status, 403)
    assert.equal((await f.request('/auth/signup', 'POST', signup('a@example.com'), '', { 'X-SkillSync-Client': '' })).status, 403)
    const account = await f.request('/auth/signup', 'POST', signup('a@example.com'))
    assert.equal((await f.request('/auth/signup', 'POST', signup('A@example.com'))).status, 409)
    assert.equal((await f.request('/users/me', 'PATCH', { role: 'mentor' }, account.cookie)).status, 400)
    assert.equal((await f.request('/users/me', 'PATCH', { isVerified: true }, account.cookie)).status, 400)
    assert.equal((await f.request('/users/me', 'PATCH', { website: 'javascript:alert(1)' }, account.cookie)).status, 400)
    assert.equal((await f.request('/users/me', 'PATCH', { bio: 'Updated' }, account.cookie)).body.data.bio, 'Updated')
    f.db.prepare('UPDATE sessions SET expires_at = 0').run()
    assert.equal((await f.request('/auth/me', 'GET', undefined, account.cookie)).status, 401)
  } finally { await f.close() }
})

test('skills and goals are validated, persistent and isolated by owner', async () => {
  const f = await fixture()
  try {
    const a = await f.request('/auth/signup', 'POST', signup('a@example.com'))
    const b = await f.request('/auth/signup', 'POST', signup('b@example.com'))
    assert.equal((await f.request('/skills')).status, 401)
    const skill = { name: 'React', category: 'Frontend', proficiency: 50 }
    assert.equal((await f.request('/skills', 'POST', { ...skill, proficiency: 101 }, a.cookie)).status, 400)
    const created = await f.request('/skills', 'POST', skill, a.cookie)
    assert.equal(created.status, 201)
    assert.equal((await f.request('/skills', 'GET', undefined, a.cookie)).body.data.length, 1)
    assert.deepEqual((await f.request('/skills', 'GET', undefined, b.cookie)).body.data, [])
    assert.equal((await f.request(`/skills/${created.body.data.id}`, 'PUT', skill, b.cookie)).status, 404)
    assert.equal((await f.request(`/skills/${created.body.data.id}`, 'DELETE', undefined, b.cookie)).status, 404)
    const goal = { title: 'Learn hooks', skills: [created.body.data.id] }
    assert.equal((await f.request('/goals', 'POST', goal, b.cookie)).status, 400)
    const made = await f.request('/goals', 'POST', goal, a.cookie)
    assert.equal(made.status, 201)
    assert.equal((await f.request(`/goals/${made.body.data.id}`, 'PUT', { ...goal, status: 'completed', progress: 100 }, a.cookie)).body.data.status, 'completed')
    assert.equal((await f.request(`/goals/${made.body.data.id}`, 'DELETE', undefined, a.cookie)).status, 200)
    assert.equal((await f.request(`/skills/${created.body.data.id}`, 'PUT', { ...skill, proficiency: 75 }, a.cookie)).body.data.proficiency, 75)
    assert.equal((await f.request(`/skills/${created.body.data.id}`, 'DELETE', undefined, a.cookie)).status, 200)
  } finally { await f.close() }
})

test('mentor discovery uses published profiles, filters and pagination', async () => {
  const f = await fixture()
  try {
    const mentor = await f.request('/auth/signup', 'POST', signup('mentor@example.com', 'mentor'))
    const student = await f.request('/auth/signup', 'POST', signup('student@example.com'))
    assert.equal((await f.request('/mentors')).body.data.length, 0)
    assert.equal((await f.request('/mentors/me', 'PUT', mentorProfile, student.cookie)).status, 403)
    assert.equal((await f.request('/mentors/me', 'PUT', mentorProfile, mentor.cookie)).status, 200)
    const result = await f.request('/mentors?search=skillsync&experience=senior&availability=this-week&maxPrice=75')
    assert.equal(result.body.data.length, 1)
    assert.equal(result.body.data[0].id, mentor.body.data.id)
    assert.equal(result.body.data[0].email, undefined)
    assert.equal((await f.request('/mentors?experience=junior')).body.data.length, 0)
    assert.equal((await f.request('/mentors?page=2&limit=1')).body.pagination.total, 1)
    assert.equal((await f.request('/mentors?page=2&limit=1')).body.data.length, 0)
    assert.equal((await f.request('/mentors?minPrice=90&maxPrice=10')).status, 400)
    assert.equal((await f.request('/mentors?limit=1000')).status, 400)
    assert.equal((await f.request(`/mentors/${mentor.body.data.id}`)).status, 200)
  } finally { await f.close() }
})

test('mentorship acceptance and messaging enforce roles and participants', async () => {
  const f = await fixture()
  try {
    const mentor = await f.request('/auth/signup', 'POST', signup('mentor@example.com', 'mentor'))
    const student = await f.request('/auth/signup', 'POST', signup('student@example.com'))
    const outsider = await f.request('/auth/signup', 'POST', signup('outsider@example.com'))
    await f.request('/mentors/me', 'PUT', mentorProfile, mentor.cookie)
    const input = { mentorId: mentor.body.data.id }
    assert.equal((await f.request('/mentorships', 'POST', input, mentor.cookie)).status, 403)
    const pending = await f.request('/mentorships', 'POST', input, student.cookie)
    assert.equal(pending.status, 201)
    assert.equal((await f.request('/mentorships', 'POST', input, student.cookie)).status, 409)
    assert.equal((await f.request('/mentorships', 'GET', undefined, outsider.cookie)).body.data.length, 0)
    const path = `/mentorships/${pending.body.data.id}`
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, student.cookie)).status, 403)
    assert.equal((await f.request('/messages', 'POST', { receiverId: mentor.body.data.id, content: 'Hi' }, student.cookie)).status, 403)
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, outsider.cookie)).status, 404)
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, mentor.cookie)).status, 200)
    const message = await f.request('/messages', 'POST', { receiverId: mentor.body.data.id, content: 'Hello mentor' }, student.cookie)
    assert.equal(message.status, 201)
    assert.equal(message.body.data.senderId, student.body.data.id)
    const messages = `/messages/${student.body.data.id}`
    assert.equal((await f.request(messages, 'GET', undefined, mentor.cookie)).body.data[0].content, 'Hello mentor')
    assert.equal((await f.request(messages, 'GET', undefined, outsider.cookie)).status, 403)
    assert.equal((await f.request(path, 'PATCH', { status: 'completed' }, mentor.cookie)).status, 200)
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, mentor.cookie)).status, 403)
    assert.equal((await f.request('/messages', 'POST', { receiverId: mentor.body.data.id, content: 'Hi' }, student.cookie)).status, 403)
  } finally { await f.close() }
})

test('SQLite data survives closing and reopening the database', () => {
  const directory = mkdtempSync(join(tmpdir(), 'skillsync-test-'))
  try {
    const filename = join(directory, 'app.sqlite')
    const first = openDatabase(filename)
    first.prepare('INSERT INTO users VALUES (?, ?, ?, ?)').run('test', 'test@example.com', 'hash', '{}')
    first.close()
    const second = openDatabase(filename)
    assert.equal((second.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number }).count, 1)
    second.close()
  } finally { rmSync(directory, { recursive: true, force: true }) }
})

test('session restoration does not exhaust the credential rate limit', async () => {
  const f = await fixture()
  try {
    const account = await f.request('/auth/signup', 'POST', signup('restore@example.com'))
    for (let i = 0; i < 55; i++) {
      assert.equal((await f.request('/auth/me', 'GET', undefined, account.cookie)).status, 200)
    }
    assert.equal((await f.request('/auth/login', 'POST', { email: 'restore@example.com', password: 'StrongPass123' })).status, 200)
  } finally { await f.close() }
})
