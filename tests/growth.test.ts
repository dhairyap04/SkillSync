import test from 'node:test'
import assert from 'node:assert/strict'
import { fixture } from './helpers.js'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const signup = (email: string, role = 'student') => ({ email, password: 'StrongPass123', firstName: role === 'mentor' ? 'Mentor' : 'Student', lastName: 'Person', role, agreeToTerms: true })
const mentorProfile = { title: 'Frontend engineer', company: 'SkillSync', location: 'Edmonton', bio: 'Build frontend applications with React', skills: ['React'], experienceYears: 8, hourlyRate: 75, availabilityValue: 'this-week' }
async function members(f: Awaited<ReturnType<typeof fixture>>) {
  const mentor = await f.request('/auth/signup', 'POST', signup('mentor@example.com', 'mentor'))
  const student = await f.request('/auth/signup', 'POST', signup('student@example.com'))
  const outsider = await f.request('/auth/signup', 'POST', signup('outsider@example.com'))
  const otherMentor = await f.request('/auth/signup', 'POST', signup('othermentor@example.com', 'mentor'))
  for (const account of [mentor, student, outsider, otherMentor]) assert.equal(account.status, 201)
  await f.request('/mentors/me', 'PUT', mentorProfile, mentor.cookie)
  const relation = await f.request('/mentorships', 'POST', { mentorId: mentor.body.data.id }, student.cookie)
  await f.request(`/mentorships/${relation.body.data.id}`, 'PATCH', { status: 'active' }, mentor.cookie)
  return { mentor, student, outsider, otherMentor, relation }
}
async function assigned(f: Awaited<ReturnType<typeof fixture>>, m: Awaited<ReturnType<typeof members>>) {
  const result = await f.request('/challenges', 'POST', { mentorshipId: m.relation.body.data.id, title: 'Build a React app', description: 'Build a tested accessible form', skills: ['React', 'Accessibility'] }, m.mentor.cookie)
  assert.equal(result.status, 201)
  return result.body.data
}

test('challenge workflow enforces assignment, revision, reviewer authority and immutable accepted work', async () => {
  const f = await fixture()
  try {
    const m = await members(f)
    const item = await assigned(f, m), base = `/challenges/${item.id}`
    assert.equal((await f.request('/challenges')).status, 401)
    assert.equal((await f.request('/challenges', 'GET', undefined, m.outsider.cookie)).body.data.length, 0)
    assert.equal((await f.request('/challenges', 'POST', { mentorshipId: m.relation.body.data.id, title: 'Spoofed', description: 'Test', skills: ['React'] }, m.student.cookie)).status, 403)
    assert.equal((await f.request('/challenges', 'POST', { mentorshipId: m.relation.body.data.id, title: 'Spoofed', description: 'Test', skills: ['React'] }, m.otherMentor.cookie)).status, 403)
    const submission = { url: 'https://example.com/project', summary: 'A working form with tests' }
    const accept = { outcome: 'accepted', feedback: 'Well tested and accessible', endorsedSkills: ['React'] }
    assert.equal((await f.request(base + '/submit', 'POST', submission, m.mentor.cookie)).status, 403)
    assert.equal((await f.request(base + '/submit', 'POST', submission, m.outsider.cookie)).status, 404)
    assert.equal((await f.request(base + '/submit', 'POST', { ...submission, url: 'javascript:alert(1)' }, m.student.cookie)).status, 400)
    assert.equal((await f.request(base + '/review', 'POST', accept, m.mentor.cookie)).status, 409)
    assert.equal((await f.request(base + '/submit', 'POST', submission, m.student.cookie)).status, 200)
    assert.equal((await f.request(base + '/submit', 'POST', submission, m.student.cookie)).status, 409)
    assert.equal((await f.request(base + '/review', 'POST', accept, m.student.cookie)).status, 403)
    assert.equal((await f.request(base + '/review', 'POST', accept, m.otherMentor.cookie)).status, 404)
    assert.equal((await f.request(base + '/review', 'POST', { ...accept, endorsedSkills: ['Unrelated'] }, m.mentor.cookie)).status, 400)
    assert.equal((await f.request(base + '/review', 'POST', { outcome: 'revision_requested', feedback: 'Add keyboard tests', endorsedSkills: ['React'] }, m.mentor.cookie)).status, 400)
    assert.equal((await f.request(base + '/review', 'POST', { outcome: 'revision_requested', feedback: 'Add keyboard tests' }, m.mentor.cookie)).status, 200)
    assert.equal((await f.request('/passport', 'GET', undefined, m.student.cookie)).body.data.evidence.length, 0)
    await f.request(base + '/submit', 'POST', { ...submission, summary: 'Added keyboard tests' }, m.student.cookie)
    const accepted = await f.request(base + '/review', 'POST', accept, m.mentor.cookie)
    assert.equal(accepted.body.data.attempts.length, 2)
    assert.equal(accepted.body.data.attempts[0].review.feedback, 'Add keyboard tests')
    assert.equal(accepted.body.data.status, 'accepted')
    assert.equal((await f.request(base + '/submit', 'POST', submission, m.student.cookie)).status, 409)
    assert.equal((await f.request(base + '/review', 'POST', accept, m.mentor.cookie)).status, 409)
    const reports = await f.request('/reports', 'GET', undefined, m.student.cookie)
    assert.equal(reports.body.data[0].accepted, 1)
    assert.equal(reports.body.data[0].submitted, 1)
    assert.equal(reports.body.data[0].revisions, 1)
    assert.deepEqual(reports.body.data[0].endorsedSkills, ['React'])
    assert.equal(reports.body.data[0].timeline.length, 5)
    assert.deepEqual((await f.request('/reports', 'GET', undefined, m.outsider.cookie)).body.data, [])
    const dashboard = (await f.request('/dashboard', 'GET', undefined, m.student.cookie)).body.data
    assert.equal(dashboard.acceptedChallenges, 1)
    assert.equal(dashboard.activeMentorships, 1)
  } finally { await f.close() }
})

test('passports are opt-in, expose only accepted work, revoke immediately and rotate links', async () => {
  const f = await fixture()
  try {
    const m = await members(f), item = await assigned(f, m)
    await f.request(`/challenges/${item.id}/submit`, 'POST', { url: 'https://example.com/project', summary: 'Public project' }, m.student.cookie)
    await f.request(`/challenges/${item.id}/review`, 'POST', { outcome: 'accepted', feedback: 'Good work', endorsedSkills: ['React'] }, m.mentor.cookie)
    await assigned(f, m) // unsubmitted work must remain private
    const privateView = await f.request('/passport', 'GET', undefined, m.student.cookie)
    assert.equal(privateView.body.data.shareToken, null)
    assert.equal(privateView.body.data.evidence.length, 1)
    assert.equal((await f.request('/passport')).status, 401)
    assert.equal((await f.request('/public/passports/' + '0'.repeat(48))).status, 404)
    const publish = await f.request('/passport/sharing', 'PUT', { published: true }, m.student.cookie)
    const token = publish.body.data.shareToken
    assert.match(token, /^[a-f0-9]{48}$/)
    const publicView = await f.request(`/public/passports/${token}`)
    assert.equal(publicView.status, 200)
    assert.equal(publicView.body.data.evidence.length, 1)
    assert.equal(publicView.body.data.evidence[0].skills[0], 'React')
    const json = JSON.stringify(publicView.body)
    assert.ok(!json.includes('email') && !json.includes('password') && !json.includes('shareToken'))
    assert.equal((await f.request('/passport/sharing', 'PUT', { published: true }, m.student.cookie)).body.data.shareToken, token)
    await f.request('/passport/sharing', 'PUT', { published: false }, m.student.cookie)
    assert.equal((await f.request(`/public/passports/${token}`)).status, 404)
    const next = await f.request('/passport/sharing', 'PUT', { published: true }, m.student.cookie)
    assert.notEqual(next.body.data.shareToken, token)
    assert.equal((await f.request(`/public/passports/${token}`)).status, 404)
  } finally { await f.close() }
})

test('mentor scores explain weighted preferences without inventing confidence', async () => {
  const f = await fixture()
  try {
    const m = await members(f)
    await f.request('/mentors/me', 'PUT', { ...mentorProfile, title: 'Python engineer', bio: 'Data work', skills: ['Python'], hourlyRate: 100, availabilityValue: 'next-week' }, m.otherMentor.cookie)
    const unset = await f.request('/mentor-matches', 'GET', undefined, m.student.cookie)
    assert.ok(unset.body.data.every((match: { score: number; hasPreferences: boolean }) => match.score === 0 && !match.hasPreferences))
    const prefs = { skills: ['react'], budget: 75, availability: 'this-week', careerGoal: 'frontend developer' }
    assert.equal((await f.request('/learning-profile', 'PUT', prefs, m.student.cookie)).status, 200)
    const result = await f.request('/mentor-matches', 'GET', undefined, m.student.cookie)
    assert.equal(result.body.data[0].mentor.id, m.mentor.body.data.id)
    assert.equal(result.body.data[0].score, 100)
    assert.equal(result.body.data[1].score, 0)
    assert.ok(result.body.data[0].reasons.includes('Within your hourly budget'))
    assert.equal((await f.request('/learning-profile', 'GET', undefined, m.outsider.cookie)).body.data.skills.length, 0)
    await f.request('/learning-profile', 'PUT', { skills: [], budget: 0, availability: '', careerGoal: '' }, m.student.cookie)
    assert.ok((await f.request('/mentor-matches', 'GET', undefined, m.student.cookie)).body.data.every((match: { score: number }) => match.score === 0))
    assert.equal((await f.request('/learning-profile', 'PUT', { ...prefs, budget: -1 }, m.student.cookie)).status, 400)
  } finally { await f.close() }
})

test('roadmap creates editable owned goals and persists through database reopening', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'skillsync-roadmap-')), filename = join(directory, 'db.sqlite')
  let f = await fixture(filename)
  try {
    const user = await f.request('/auth/signup', 'POST', signup('roadmap@example.com'))
    const outsider = await f.request('/auth/signup', 'POST', signup('outsider@example.com'))
    assert.equal((await f.request('/roadmaps', 'POST', { templateId: 'unknown' }, user.cookie)).status, 400)
    assert.equal((await f.request('/goals', 'GET', undefined, user.cookie)).body.data.length, 0)
    const made = await f.request('/roadmaps', 'POST', { templateId: 'frontend', title: 'My path' }, user.cookie)
    assert.equal(made.status, 201)
    assert.equal(made.body.data.goalIds.length, 4)
    const goals = (await f.request('/goals', 'GET', undefined, user.cookie)).body.data
    assert.equal(goals.length, 4)
    assert.ok(goals.every((g: { milestones: unknown[] }) => g.milestones.length > 0))
    assert.deepEqual((await f.request('/roadmaps', 'GET', undefined, outsider.cookie)).body.data, [])
    const { id, createdAt: _createdAt, updatedAt: _updatedAt, ...goal } = goals[0]
    await f.request(`/goals/${id}`, 'PUT', { ...goal, title: 'Customized first step', status: 'completed', progress: 100 }, user.cookie)
    await f.close(); f = await fixture(filename)
    const login = await f.request('/auth/login', 'POST', { email: 'roadmap@example.com', password: 'StrongPass123' })
    assert.equal((await f.request('/roadmaps', 'GET', undefined, login.cookie)).body.data[0].title, 'My path')
    assert.equal((await f.request('/goals', 'GET', undefined, login.cookie)).body.data[0].title, 'Customized first step')
    const dashboard = await f.request('/dashboard', 'GET', undefined, login.cookie)
    assert.equal(dashboard.body.data.completedGoals, 1)
    await f.request(`/goals/${id}`, 'DELETE', undefined, login.cookie)
    assert.equal((await f.request('/roadmaps', 'GET', undefined, login.cookie)).body.data[0].goalIds.length, 3)
  } finally { await f.close(); rmSync(directory, { recursive: true, force: true }) }
})

test('complementary peer offers require consent, isolate requests, and enable private messaging', async () => {
  const f = await fixture()
  try {
    const m = await members(f)
    const a = await f.request('/exchange-offers', 'POST', { teach: 'React', learn: 'Python', description: 'I teach React' }, m.student.cookie)
    const b = await f.request('/exchange-offers', 'POST', { teach: 'python', learn: 'react', description: 'I teach Python' }, m.outsider.cookie)
    const unrelated = await f.request('/exchange-offers', 'POST', { teach: 'Design', learn: 'Music', description: 'An unrelated offer' }, m.mentor.cookie)
    assert.equal(a.status, 201); assert.equal(b.status, 201)
    const offers = (await f.request('/exchange-offers', 'GET', undefined, m.student.cookie)).body.data
    assert.equal(offers.find((o: { id: string }) => o.id === b.body.data.id).reciprocal, true)
    assert.ok(!JSON.stringify(offers).includes('@example.com'))
    const payload = { offerId: b.body.data.id, requesterOfferId: a.body.data.id }
    assert.equal((await f.request('/exchanges', 'POST', payload, m.mentor.cookie)).status, 403)
    assert.equal((await f.request('/exchanges', 'POST', { ...payload, offerId: a.body.data.id }, m.student.cookie)).status, 403)
    assert.equal((await f.request('/exchanges', 'POST', { ...payload, offerId: unrelated.body.data.id }, m.student.cookie)).status, 400)
    const request = await f.request('/exchanges', 'POST', payload, m.student.cookie)
    assert.equal(request.status, 201)
    assert.equal((await f.request('/exchanges', 'POST', payload, m.student.cookie)).status, 409)
    assert.deepEqual((await f.request('/exchanges', 'GET', undefined, m.otherMentor.cookie)).body.data, [])
    const path = `/exchanges/${request.body.data.id}`
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, m.student.cookie)).status, 403)
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, m.otherMentor.cookie)).status, 404)
    assert.equal((await f.request(path, 'PATCH', { status: 'completed' }, m.outsider.cookie)).status, 409)
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, m.outsider.cookie)).status, 200)
    assert.equal((await f.request('/connections', 'GET', undefined, m.outsider.cookie)).body.data[0].peer.id, m.student.body.data.id)
    assert.equal((await f.request('/messages', 'POST', { receiverId: m.outsider.body.data.id, content: 'Ready to exchange skills?' }, m.student.cookie)).status, 201)
    assert.equal((await f.request(`/messages/${m.student.body.data.id}`, 'GET', undefined, m.outsider.cookie)).body.data.length, 1)
    assert.equal((await f.request(`/messages/${m.student.body.data.id}`, 'GET', undefined, m.otherMentor.cookie)).status, 403)
    assert.equal((await f.request(path, 'PATCH', { status: 'completed' }, m.student.cookie)).status, 200)
    assert.equal((await f.request('/messages', 'POST', { receiverId: m.outsider.body.data.id, content: 'Closed' }, m.student.cookie)).status, 403)
    assert.equal((await f.request(path, 'PATCH', { status: 'active' }, m.outsider.cookie)).status, 409)
    assert.equal((await f.request(`/exchange-offers/${a.body.data.id}`, 'PATCH', { active: false }, m.outsider.cookie)).status, 404)
  } finally { await f.close() }
})

test('closed mentorships block new challenge mutations while retaining reviewed evidence', async () => {
  const f = await fixture()
  try {
    const m = await members(f), item = await assigned(f, m)
    await f.request(`/mentorships/${m.relation.body.data.id}`, 'PATCH', { status: 'completed' }, m.mentor.cookie)
    assert.equal((await f.request(`/challenges/${item.id}/submit`, 'POST', { url: 'https://example.com', summary: 'Done' }, m.student.cookie)).status, 409)
    assert.equal((await f.request('/challenges', 'POST', { mentorshipId: m.relation.body.data.id, title: 'Late assignment', description: 'Test', skills: ['React'] }, m.mentor.cookie)).status, 409)
    assert.equal((await f.request('/reports', 'GET', undefined, m.mentor.cookie)).body.data[0].status, 'completed')
  } finally { await f.close() }
})
