import type { Express, RequestHandler } from 'express'
import type { DatabaseSync } from 'node:sqlite'
import { z } from 'zod'
import { HttpError } from './errors.js'
import { canonicalSkill, matchSkills, semanticScores } from './skillSimilarity.js'
import { resourceCatalog } from './resourceCatalog.js'
import type { MentorListing } from '../src/types/api.js'
import type { LearningProfile } from '../src/types/growth.js'
import type { MentorRecommendation, ResourceRecommendation, RecommendationKind, FeedbackValue } from '../src/types/recommendations.js'

type Features = Record<string, number | null>
interface Feedback { target_id: string; value: FeedbackValue; features: string }
interface Skill { name: string; proficiency: number; targetProficiency?: number }
const defaults: LearningProfile = { skills: [], careerGoal: '', budget: null, availability: '' }
const mentorWeights = { skills: 50, budget: 20, availability: 20, career: 10 }
const resourceWeights = { interests: 55, goals: 25, gaps: 15, level: 5 }

// Replay each member's explicit labels with regularization toward the prior.
// One current label per target means repeated clicks cannot amplify a vote.
export function adaptedWeights(base: Record<string, number>, examples: Feedback[]) {
  const weights = { ...base }, usable = examples.slice(0, 200)
  if (usable.length < 3 || !usable.some(e => e.value === 'helpful') || !usable.some(e => e.value === 'not_for_me')) return { weights, learned: false }
  const parsed = usable.map(e => ({ value: e.value, features: JSON.parse(e.features) as Features }))
  const delta = Object.fromEntries(Object.keys(base).map(k => [k, 0]))
  for (let iteration = 0; iteration < 25; iteration++) {
    for (const k of Object.keys(base)) {
      let gradient = .4 * delta[k]
      for (const example of parsed) {
        const values = Object.entries(example.features).filter((entry): entry is [string, number] => entry[1] !== null && entry[0] in base)
        const logit = values.reduce((sum, [name, value]) => sum + (value - .5) * (1 + delta[name]), 0)
        const prediction = 1 / (1 + Math.exp(-logit))
        const feature = example.features[k]
        if (feature !== null && feature !== undefined) gradient += (prediction - (example.value === 'helpful' ? 1 : 0)) * (feature - .5) / parsed.length
      }
      delta[k] = Math.max(-.35, Math.min(.35, delta[k] - .3 * gradient))
    }
  }
  for (const k of Object.keys(base)) weights[k] = base[k] * (1 + delta[k])
  return { weights, learned: true }
}
function weightedScore(features: Features, weights: Record<string, number>) {
  let total = 0, score = 0
  for (const [k, value] of Object.entries(features)) if (value !== null) { total += weights[k]; score += weights[k] * value }
  return total ? Math.max(0, Math.min(100, Math.round(100 * score / total))) : 0
}

export function registerRecommendationRoutes(app: Express, db: DatabaseSync, auth: RequestHandler, mentors: () => MentorListing[]) {
  function context(userId: string) {
    const row = db.prepare('SELECT data FROM learning_profiles WHERE user_id = ?').get(userId)
    const profile: LearningProfile = row ? JSON.parse(row.data as string) : defaults
    const records = db.prepare('SELECT kind, data FROM records WHERE owner_id = ?').all(userId)
    const skillRecords: Skill[] = records.filter(r => r.kind === 'skills').map(r => JSON.parse(r.data as string))
    const gaps = skillRecords.filter(s => s.proficiency < (s.targetProficiency ?? 100))
    const goalTexts = records.filter(r => r.kind === 'goals').map(r => JSON.parse(r.data as string)).filter(g => g.status !== 'completed').map(g => `${g.title} ${g.description}`)
    return { profile, skillRecords, gaps, goals: goalTexts.join(' ') }
  }
  function feedback(userId: string, kind: RecommendationKind) {
    return db.prepare('SELECT target_id, value, features FROM recommendation_feedback WHERE user_id = ? AND kind = ? ORDER BY updated_at DESC, target_id').all(userId, kind) as unknown as Feedback[]
  }
  function rankMentors(userId: string) {
    const { profile, gaps, goals } = context(userId)
    const wanted = profile.skills.length ? profile.skills : gaps.map(s => s.name)
    const candidates = mentors().filter(m => m.id !== userId)
    const goal = profile.careerGoal || goals
    const titleScores = semanticScores(goal, candidates.map(m => m.title))
    const textScores = semanticScores(goal, candidates.map(m => `${m.bio} ${m.specializations.join(' ')} ${m.skills.join(' ')}`))
    const examples = feedback(userId, 'mentor'), learned = adaptedWeights(mentorWeights, examples)
    const labels = new Map(examples.map(e => [e.target_id, e.value]))
    return candidates.map((mentor, index) => {
      const skills = matchSkills(wanted, mentor.skills)
      const career = Math.max(titleScores[index], .8 * textScores[index])
      const features: Features = { skills: wanted.length ? skills.score : null,
        budget: profile.budget === null ? null : Number(mentor.hourlyRate <= profile.budget),
        availability: profile.availability ? Number(mentor.availabilityValue === profile.availability || mentor.availabilityValue === 'flexible') : null,
        career: goal ? career : null }
      const reasons: string[] = []
      const exact = skills.matches.filter(m => m.similarity === 1), related = skills.matches.filter(m => m.similarity > 0 && m.similarity < 1)
      if (exact.length) reasons.push(`Relevant skills: ${exact.map(m => m.wanted).join(', ')}`)
      for (const match of related) reasons.push(`Related skill: ${match.wanted} ↔ ${match.offered} (partial match)`)
      if (wanted.length && !skills.score) reasons.push('No known matching skills')
      if (!profile.skills.length && gaps.length) reasons.push('Uses your saved skill gaps')
      if (features.budget !== null) reasons.push(features.budget ? 'Within your hourly budget' : 'Above your hourly budget')
      if (features.availability !== null) reasons.push(features.availability ? 'Availability matches or is flexible' : 'Availability differs from your preference')
      if (goal) reasons.push(career > 0 ? 'Career or goal text overlaps this profile' : 'No career or goal text overlap')
      if (learned.learned) reasons.push('Ranking weights adapted to your helpful/not-for-me feedback')
      const label = labels.get(mentor.id) ?? null
      if (label === 'helpful') reasons.push('You marked this mentor helpful (+3 points when preferences are set)')
      const baseScore = weightedScore(features, learned.weights)
      const hasPreferences = Object.values(features).some(value => value !== null)
      const recommendation: MentorRecommendation = { mentor, score: hasPreferences ? Math.min(100, baseScore + (label === 'helpful' ? 3 : 0)) : 0,
        reasons: reasons.length ? reasons : ['Save preferences or add skill goals to compare mentors'], hasPreferences, feedback: label, feedbackAdjusted: learned.learned }
      return { recommendation, features }
    }).sort((a, b) => b.recommendation.score - a.recommendation.score || a.recommendation.mentor.name.localeCompare(b.recommendation.mentor.name) || a.recommendation.mentor.id.localeCompare(b.recommendation.mentor.id))
  }
  function rankResources(userId: string) {
    const { profile, gaps, goals, skillRecords } = context(userId)
    const goalQuery = [profile.careerGoal, goals].join(' ').trim()
    const textScores = semanticScores(goalQuery, resourceCatalog.map(r => `${r.title} ${r.description} ${r.skills.join(' ')}`))
    const examples = feedback(userId, 'resource'), learned = adaptedWeights(resourceWeights, examples)
    const labels = new Map(examples.map(e => [e.target_id, e.value]))
    const states = new Map(db.prepare('SELECT resource_id, saved, completed FROM resource_states WHERE user_id = ?').all(userId).map(r => [r.resource_id, r]))
    return resourceCatalog.map((resource, index) => {
      const interest = matchSkills(profile.skills, resource.skills)
      const gap = matchSkills(gaps.map(s => s.name), resource.skills)
      const relatedRecords = skillRecords.filter(s => resource.skills.some(t => canonicalSkill(t) === canonicalSkill(s.name)))
      const level = relatedRecords.length ? (relatedRecords.reduce((sum, s) => sum + s.proficiency, 0) / relatedRecords.length < 40 ? 'beginner' : 'intermediate') : 'beginner'
      const hasPreferences = !!(profile.skills.length || goalQuery || gaps.length)
      const features: Features = { interests: profile.skills.length ? interest.score : null, goals: goalQuery ? textScores[index] : null,
        gaps: gaps.length ? gap.score : null, level: hasPreferences && relatedRecords.length ? Number(resource.difficulty === level) : null }
      const reasons: string[] = []
      if (interest.score) reasons.push(`Matches your interests: ${interest.matches.filter(m => m.similarity > 0).map(m => m.wanted).join(', ')}`)
      if (textScores[index] > 0) reasons.push('Relevant to your career goal or active goals')
      if (gap.score) reasons.push(`Supports skill gaps: ${gap.matches.filter(m => m.similarity > 0).map(m => m.wanted).join(', ')}`)
      if (features.level === 1) reasons.push(`Fits your self-reported ${level} level`)
      if (learned.learned) reasons.push('Ranking weights adapted to your resource feedback')
      const label = labels.get(resource.id) ?? null, state = states.get(resource.id)
      if (label === 'helpful') reasons.push('You marked this resource helpful (+3 points when context is available)')
      const recommendation: ResourceRecommendation = { resource, score: Math.min(100, weightedScore(features, learned.weights) + (hasPreferences && label === 'helpful' ? 3 : 0)),
        reasons: reasons.length ? reasons : [hasPreferences ? 'Explore a different topic' : 'Explore the catalog or save learning preferences for personalized suggestions'], hasPreferences,
        feedback: label, feedbackAdjusted: learned.learned, saved: !!state?.saved, completed: !!state?.completed }
      return { recommendation, features }
    }).sort((a, b) => b.recommendation.score - a.recommendation.score || a.recommendation.resource.id.localeCompare(b.recommendation.resource.id))
  }
  app.get('/api/mentor-matches', auth, (_req, res) => res.json({ success: true, data: rankMentors(res.locals.user.id).map(m => m.recommendation) }))
  app.get('/api/resources', auth, (_req, res) => res.json({ success: true, data: rankResources(res.locals.user.id).map(m => m.recommendation) }))
  app.put('/api/resources/:id/state', auth, (req, res) => {
    const id = z.string().max(100).parse(req.params.id)
    if (!resourceCatalog.some(r => r.id === id)) throw new HttpError(404, 'Resource not found')
    const input = z.object({ saved: z.boolean().optional(), completed: z.boolean().optional() }).strict().refine(v => v.saved !== undefined || v.completed !== undefined).parse(req.body)
    const row = db.prepare('SELECT saved, completed FROM resource_states WHERE user_id = ? AND resource_id = ?').get(res.locals.user.id, id)
    const state = { saved: input.saved ?? !!row?.saved, completed: input.completed ?? !!row?.completed }
    db.prepare('INSERT INTO resource_states VALUES (?, ?, ?, ?) ON CONFLICT(user_id, resource_id) DO UPDATE SET saved = excluded.saved, completed = excluded.completed').run(res.locals.user.id, id, Number(state.saved), Number(state.completed))
    res.json({ success: true, data: state })
  })
  app.put('/api/recommendation-feedback', auth, (req, res) => {
    const input = z.object({ kind: z.enum(['mentor', 'resource']), targetId: z.string().trim().min(1).max(100), value: z.enum(['helpful', 'not_for_me']).nullable() }).strict().parse(req.body)
    const userId = res.locals.user.id
    if (input.value === null) {
      db.prepare('DELETE FROM recommendation_feedback WHERE user_id = ? AND kind = ? AND target_id = ?').run(userId, input.kind, input.targetId)
    } else {
      // Compute training features on the server; never accept client-supplied scores.
      const candidates = input.kind === 'mentor' ? rankMentors(userId).map(r => ({ id: r.recommendation.mentor.id, features: r.features })) : rankResources(userId).map(r => ({ id: r.recommendation.resource.id, features: r.features }))
      const target = candidates.find(item => item.id === input.targetId)
      if (!target) throw new HttpError(404, 'Recommendation not found')
      db.prepare('INSERT INTO recommendation_feedback VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id, kind, target_id) DO UPDATE SET value = excluded.value, features = excluded.features, updated_at = excluded.updated_at').run(userId, input.kind, input.targetId, input.value, JSON.stringify(target.features), new Date().toISOString())
    }
    res.json({ success: true, data: { value: input.value } })
  })
  app.delete('/api/recommendation-feedback', auth, (req, res) => {
    const { kind } = z.object({ kind: z.enum(['mentor', 'resource']) }).strict().parse(req.body)
    db.prepare('DELETE FROM recommendation_feedback WHERE user_id = ? AND kind = ?').run(res.locals.user.id, kind)
    res.json({ success: true, data: null })
  })
}
