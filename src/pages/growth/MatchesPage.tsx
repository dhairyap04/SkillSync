import { splitSkills } from '@/lib/growth'
import { useAction } from '@/hooks/useAction'
import { useState } from 'react'
import type { LearningProfile } from '@/types/growth'
import type { MentorListing } from '@/types/api'
import { useApiData } from '@/hooks/useApiData'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'
export default function MatchesPage() {
  const profile = useApiData<LearningProfile>('/learning-profile')
  const matches = useApiData<{ mentor: MentorListing; score: number; reasons: string[]; hasPreferences: boolean }[]>('/mentor-matches')
  const { busy, run } = useAction(), { user } = useAuthStore()
  return <Workspace title="Find your mentor match" description="Compare mentors against your learning interests, budget, availability, and career goal. Every score comes with its reasons."><LoadState {...profile} />
    {profile.data && <PreferencesForm initial={profile.data} saved={matches.refresh} />}
    <LoadState {...matches} />{matches.data?.length === 0 && <p>No published mentors yet.</p>}
    <div className="grid md:grid-cols-2 gap-4">{matches.data?.map(match => <Panel key={match.mentor.id} title={match.mentor.name}><p>{match.mentor.title} · {match.mentor.company}</p><strong className="text-primary-700 text-xl">{match.hasPreferences ? `${match.score}% preference fit` : 'Set preferences to see a score'}</strong><ul className="list-disc pl-5 space-y-1">{match.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul><p>${match.mentor.hourlyRate}/hr · {match.mentor.availability}</p>
      <Button disabled={busy || user?.role !== 'student'} onClick={() => void run(async () => { await api('/mentorships', { method: 'POST', body: JSON.stringify({ mentorId: match.mentor.id }) }) }, 'Mentorship request sent')}>Request mentorship</Button>
    </Panel>)}</div>
  </Workspace>
}

function PreferencesForm({ initial, saved }: { initial: LearningProfile; saved: () => void }) {
  const [form, setForm] = useState(() => ({ skills: initial.skills.join(', '), careerGoal: initial.careerGoal, budget: initial.budget === null ? '' : String(initial.budget), availability: initial.availability }))
  const { busy, run } = useAction()
  return (    <Panel title="Your learning preferences"><form className="space-y-4" onSubmit={e => { e.preventDefault(); void run(async () => { await api('/learning-profile', { method: 'PUT', body: JSON.stringify({ ...form, skills: splitSkills(form.skills), budget: form.budget === '' ? null : Number(form.budget) }) }); saved() }, 'Preferences saved') }}>
      <Field label="Skills to learn (comma-separated)"><input className="input" maxLength={2000} value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} /></Field><Field label="Career goal"><input className="input" maxLength={500} value={form.careerGoal} onChange={e => setForm({ ...form, careerGoal: e.target.value })} /></Field>
      <div className="grid sm:grid-cols-2 gap-4"><Field label="Maximum hourly budget ($, optional)"><input className="input" type="number" min={0} max={10000} value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} /></Field><Field label="Preferred availability"><select className="input" value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })}><option value="">No preference</option><option value="immediate">Available now</option><option value="this-week">This week</option><option value="next-week">Next week</option><option value="flexible">Flexible</option></select></Field></div>
      <Button type="submit" loading={busy}>Save preferences</Button>
    </form><p className="text-xs text-neutral-500">Rule-based fit score: skills 50%, budget 20%, availability 20%, career keywords 10%. Unset preferences are excluded and the remaining weights are normalized. This is not a prediction of mentoring quality.</p></Panel>)
}
