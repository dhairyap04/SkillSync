import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fixture } from './helpers.js'
import { canonicalSkill, skillSimilarity, semanticScores, matchSkills } from '../server/skillSimilarity.js'
import { adaptedWeights } from '../server/recommendations.js'
import { openDatabase } from '../server/db.js'

const signup = (email: string, role = 'student') => ({ email, password: 'StrongPass123', firstName: 'Test', lastName: 'Member', role, agreeToTerms: true })
const mentorProfile = { title: 'Frontend engineer', company: 'SkillSync', location: 'Edmonton', bio: 'React applications and accessible forms', skills: ['React.js'], experienceYears: 8, hourlyRate: 75, availabilityValue: 'this-week' }
const preferences = { skills: ['ReactJS'], careerGoal: '', budget: null, availability: '' }

test('aliases match, adjacent skills receive partial credit, and lookalikes stay distinct', () => {
  assert.equal(canonicalSkill(' REACT.js '), canonicalSkill('ReactJS'))
  assert.equal(skillSimilarity('a11y', 'web accessibility'), 1)
  assert.equal(skillSimilarity('JS', 'ECMAScript'), 1)
  assert.ok(skillSimilarity('React', 'JavaScript') > 0 && skillSimilarity('React', 'JavaScript') < 1)
  assert.equal(skillSimilarity('Java', 'JavaScript'), 0)
  assert.equal(skillSimilarity('C', 'C++'), 0)
  assert.equal(skillSimilarity('C#', 'C++'), 0)
  assert.equal(skillSimilarity('SQL', 'NoSQL'), 0)
  assert.equal(skillSimilarity('Unknown skill', 'Unknown skill'), 1)
  assert.equal(skillSimilarity('', ''), 0)
  assert.equal(matchSkills(['React', 'ReactJS'], ['React.js']).matches.length, 1)
})

test('TF-IDF normalizes aliases and career phrases without substring matching', () => {
  const scores = semanticScores('front-end developer', ['Frontend engineer', 'Python engineer', 'A completely unrelated topic'])
  assert.equal(scores[0], 1)
  assert.equal(scores[1], 0)
  assert.deepEqual(semanticScores('Java', ['JavaScript', 'Java']), [0, 1])
  assert.deepEqual(semanticScores('', ['React', 'Python']), [0, 0])
  assert.ok(semanticScores('react.js', ['ReactJS components'])[0] > 0)
})

test('feedback learning needs mixed examples, adjusts weights, and remains bounded', () => {
  const base = { skills: 50, budget: 20 }
  const examples = [
    { target_id: '1', value: 'helpful' as const, features: JSON.stringify({ skills: 1, budget: 1 }) },
    { target_id: '2', value: 'helpful' as const, features: JSON.stringify({ skills: 0, budget: 1 }) },
    { target_id: '3', value: 'not_for_me' as const, features: JSON.stringify({ skills: 1, budget: 0 }) },
  ]
  assert.equal(adaptedWeights(base, examples.slice(0, 2)).learned, false)
  assert.equal(adaptedWeights(base, examples.map(e => ({ ...e, value: 'helpful' }))).learned, false)
  const model = adaptedWeights(base, examples)
  assert.equal(model.learned, true)
  assert.ok(model.weights.budget > base.budget)
  assert.ok(model.weights.skills < base.skills)
  assert.ok(Object.entries(model.weights).every(([k, value]) => value >= .65 * base[k as keyof typeof base] && value <= 1.35 * base[k as keyof typeof base]))
  assert.deepEqual(adaptedWeights(base, examples), model)
})

test('mentor matching uses aliases, saved gaps and server-owned feedback snapshots', async () => {
  const f = await fixture()
  try {
    const a = await f.request('/auth/signup', 'POST', signup('a@example.com'))
    const b = await f.request('/auth/signup', 'POST', signup('b@example.com'))
    const mentor = await f.request('/auth/signup', 'POST', signup('mentor@example.com', 'mentor'))
    await f.request('/mentors/me', 'PUT', mentorProfile, mentor.cookie)
    await f.request('/learning-profile', 'PUT', preferences, a.cookie)
    const matches = await f.request('/mentor-matches', 'GET', undefined, a.cookie)
    assert.equal(matches.body.data[0].score, 100)
    assert.ok(matches.body.data[0].reasons.some((r: string) => r.includes('Relevant skills')))
    const input = { kind: 'mentor', targetId: mentor.body.data.id, value: 'helpful' }
    for (let i = 0; i < 5; i++) assert.equal((await f.request('/recommendation-feedback', 'PUT', input, a.cookie)).status, 200)
    assert.equal(f.db.prepare('SELECT COUNT(*) AS count FROM recommendation_feedback').get()!.count, 1)
    assert.equal((await f.request('/mentor-matches', 'GET', undefined, a.cookie)).body.data[0].feedback, 'helpful')
    assert.equal((await f.request('/mentor-matches', 'GET', undefined, b.cookie)).body.data[0].feedback, null)
    assert.equal((await f.request('/recommendation-feedback', 'PUT', { ...input, features: { skills: 100 } }, a.cookie)).status, 400)
    assert.equal((await f.request('/recommendation-feedback', 'PUT', { ...input, targetId: a.body.data.id }, a.cookie)).status, 404)
    await f.request('/recommendation-feedback', 'PUT', { ...input, value: null }, a.cookie)
    assert.equal((await f.request('/mentor-matches', 'GET', undefined, a.cookie)).body.data[0].feedback, null)
    await f.request('/skills', 'POST', { name: 'ReactJS', category: 'Frontend', proficiency: 20, targetProficiency: 80 }, b.cookie)
    const inferred = (await f.request('/mentor-matches', 'GET', undefined, b.cookie)).body.data[0]
    assert.equal(inferred.score, 100)
    assert.equal(inferred.hasPreferences, true)
    assert.ok(inferred.reasons.includes('Uses your saved skill gaps'))
  } finally { await f.close() }
})

test('resources personalize from interests, goals, gaps and feedback, with isolated persistent state', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'skillsync-recs-')), filename = join(directory, 'db.sqlite')
  let f = await fixture(filename)
  try {
    const a = await f.request('/auth/signup', 'POST', signup('a@example.com'))
    const b = await f.request('/auth/signup', 'POST', signup('b@example.com'))
    assert.equal((await f.request('/resources')).status, 401)
    const cold = (await f.request('/resources', 'GET', undefined, a.cookie)).body.data
    assert.ok(cold.every((r: { score: number; hasPreferences: boolean }) => r.score === 0 && !r.hasPreferences))
    assert.ok(cold.every((r: { resource: { url: string } }) => !r.resource.url.includes('example.com')))
    await f.request('/learning-profile', 'PUT', preferences, a.cookie)
    await f.request('/learning-profile', 'PUT', { ...preferences, skills: ['Python'] }, b.cookie)
    const initial = (await f.request('/resources', 'GET', undefined, a.cookie)).body.data
    assert.equal(initial[0].resource.id, 'react-learn')
    const others = (await f.request('/resources', 'GET', undefined, b.cookie)).body.data
    assert.ok(others[0].resource.skills.includes('Python'))
    assert.ok(others.find((r: { resource: { id: string } }) => r.resource.id === 'python-tutorial').score > others.find((r: { resource: { id: string } }) => r.resource.id === 'react-learn').score)
    await f.request('/skills', 'POST', { name: 'Python', category: 'Data', proficiency: 50, targetProficiency: 90 }, a.cookie)
    const beforeLearning = (await f.request('/resources', 'GET', undefined, a.cookie)).body.data
    for (const [targetId, value] of [['python-tutorial', 'helpful'], ['pandas-tutorials', 'helpful'], ['react-learn', 'not_for_me']]) {
      assert.equal((await f.request('/recommendation-feedback', 'PUT', { kind: 'resource', targetId, value }, a.cookie)).status, 200)
    }
    const learned = (await f.request('/resources', 'GET', undefined, a.cookie)).body.data
    assert.ok(learned.every((r: { feedbackAdjusted: boolean }) => r.feedbackAdjusted))
    const mdn = (data: typeof initial) => data.find((r: { resource: { id: string } }) => r.resource.id === 'mdn-web')
    assert.notEqual(mdn(learned).score, mdn(beforeLearning).score, 'unrated items should be reranked by learned weights')
    assert.equal((await f.request('/resources', 'GET', undefined, b.cookie)).body.data[0].feedbackAdjusted, false)
    assert.equal((await f.request('/resources/react-learn/state', 'PUT', { saved: true }, a.cookie)).status, 200)
    await f.request('/resources/react-learn/state', 'PUT', { completed: true }, a.cookie)
    const state = f.db.prepare('SELECT saved, completed FROM resource_states WHERE user_id = ?').get(a.body.data.id)!
    assert.equal(state.saved, 1); assert.equal(state.completed, 1)
    assert.equal((await f.request('/resources/unknown/state', 'PUT', { saved: true }, a.cookie)).status, 404)
    assert.equal((await f.request('/resources/react-learn/state', 'PUT', { saved: 'yes' }, a.cookie)).status, 400)
    await f.close(); f = await fixture(filename)
    const login = await f.request('/auth/login', 'POST', { email: 'a@example.com', password: 'StrongPass123' })
    const saved = (await f.request('/resources', 'GET', undefined, login.cookie)).body.data.find((r: { resource: { id: string } }) => r.resource.id === 'react-learn')
    assert.equal(saved.saved, true); assert.equal(saved.completed, true); assert.equal(saved.feedback, 'not_for_me')
    await f.request('/recommendation-feedback', 'DELETE', { kind: 'resource' }, login.cookie)
    const reset = (await f.request('/resources', 'GET', undefined, login.cookie)).body.data
    assert.ok(reset.every((r: { feedbackAdjusted: boolean; feedback: unknown }) => !r.feedbackAdjusted && r.feedback === null))
    assert.equal(reset.find((r: { resource: { id: string } }) => r.resource.id === 'react-learn').saved, true)
  } finally { await f.close(); rmSync(directory, { recursive: true, force: true }) }
})

test('active goals influence resource ranking and completed goals stop influencing it', async () => {
  const f = await fixture()
  try {
    const a = await f.request('/auth/signup', 'POST', signup('a@example.com'))
    const made = await f.request('/goals', 'POST', { title: 'Learn SQL with PostgreSQL', description: 'Write relational database queries' }, a.cookie)
    const result = (await f.request('/resources', 'GET', undefined, a.cookie)).body.data
    assert.equal(result[0].resource.id, 'postgres-tutorial')
    assert.ok(result[0].reasons.includes('Relevant to your career goal or active goals'))
    await f.request(`/goals/${made.body.data.id}`, 'PUT', { title: 'Learn SQL with PostgreSQL', description: 'Write relational database queries', status: 'completed', progress: 100 }, a.cookie)
    assert.ok((await f.request('/resources', 'GET', undefined, a.cookie)).body.data.every((r: { hasPreferences: boolean }) => !r.hasPreferences))
  } finally { await f.close() }
})

test('schema upgrade preserves v2 records and adds recommendation tables', () => {
  const directory = mkdtempSync(join(tmpdir(), 'skillsync-schema-')), filename = join(directory, 'db.sqlite')
  try {
    const old = openDatabase(filename)
    old.prepare('INSERT INTO users VALUES (?, ?, ?, ?)').run('legacy', 'legacy@example.com', 'hash', '{}')
    old.exec('DROP TABLE resource_states; DROP TABLE recommendation_feedback; PRAGMA user_version = 2')
    old.close()
    const migrated = openDatabase(filename)
    assert.equal(migrated.prepare('PRAGMA user_version').get()!.user_version, 3)
    assert.equal(migrated.prepare('SELECT COUNT(*) AS count FROM users').get()!.count, 1)
    assert.equal(migrated.prepare('SELECT COUNT(*) AS count FROM recommendation_feedback').get()!.count, 0)
    migrated.close()
  } finally { rmSync(directory, { recursive: true, force: true }) }
})
