import { splitSkills } from '@/lib/growth'
import { useAction } from '@/hooks/useAction'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useApiData } from '@/hooks/useApiData'
import type { Challenge, MentorshipSummary } from '@/types/growth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'

function ChallengeCard({ item, refresh }: { item: Challenge; refresh: () => void }) {
  const { user } = useAuthStore()
  const { busy, run } = useAction()
  const [url, setUrl] = useState(''), [summary, setSummary] = useState(''), [feedback, setFeedback] = useState('')
  const [outcome, setOutcome] = useState<'accepted' | 'revision_requested'>('accepted')
  const [endorsedSkills, setEndorsedSkills] = useState(item.skills)
  const isMentor = item.mentorId === user?.id
  return <Panel title={item.title}><p className="text-sm text-primary-700 font-medium">{item.status.replace('_', ' ')} · {isMentor ? item.student?.name : item.mentor?.name}</p><p className="whitespace-pre-wrap">{item.description}</p><p>Skills: {item.skills.join(', ')}{item.dueDate && ` · Due ${item.dueDate}`}</p>
    {item.attempts.map((attempt, index) => <div key={index} className="bg-neutral-50 rounded-lg p-4 space-y-2"><h3 className="font-semibold">Submission {index + 1}</h3><p className="whitespace-pre-wrap">{attempt.summary}</p><a className="text-primary-600 underline break-all" href={attempt.url} target="_blank" rel="noreferrer">View submitted work</a><p className="text-xs text-neutral-500">{new Date(attempt.submittedAt).toLocaleString()}</p>
      {attempt.review && <div><strong>{attempt.review.outcome === 'accepted' ? 'Accepted' : 'Revision requested'}</strong><p className="whitespace-pre-wrap">{attempt.review.feedback}</p>{attempt.review.endorsedSkills.length > 0 && <p>Endorsed: {attempt.review.endorsedSkills.join(', ')}</p>}</div>}
    </div>)}
    {!isMentor && ['assigned', 'revision_requested'].includes(item.status) && <form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(async () => { await api(`/challenges/${item.id}/submit`, { method: 'POST', body: JSON.stringify({ url, summary }) }); setUrl(''); setSummary(''); refresh() }, 'Work submitted for review') }}>
      <Field label="Project URL"><input className="input" type="url" pattern="https?://.*" required maxLength={2000} value={url} onChange={e => setUrl(e.target.value)} /></Field><Field label="What did you build or improve?"><textarea className="input" required maxLength={5000} value={summary} onChange={e => setSummary(e.target.value)} /></Field><Button type="submit" loading={busy}>Submit work</Button>
    </form>}
    {isMentor && item.status === 'submitted' && <form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(async () => { await api(`/challenges/${item.id}/review`, { method: 'POST', body: JSON.stringify({ outcome, feedback, endorsedSkills: outcome === 'accepted' ? endorsedSkills : [] }) }); setFeedback(''); refresh() }, 'Review saved') }}>
      <p className="text-sm text-neutral-500">The student may publish accepted work, your feedback, your name, and endorsed skills in their passport.</p><Field label="Review decision"><select className="input" value={outcome} onChange={e => setOutcome(e.target.value as typeof outcome)}><option value="accepted">Accept work</option><option value="revision_requested">Request revision</option></select></Field>
      <Field label="Mentor feedback"><textarea className="input" required maxLength={5000} value={feedback} onChange={e => setFeedback(e.target.value)} /></Field>
      {outcome === 'accepted' && <fieldset><legend className="font-medium">Skills demonstrated in this work</legend>{item.skills.map(skill => <label key={skill} className="inline-flex gap-2 mr-4"><input type="checkbox" checked={endorsedSkills.includes(skill)} onChange={e => setEndorsedSkills(e.target.checked ? [...endorsedSkills, skill] : endorsedSkills.filter(s => s !== skill))} />{skill}</label>)}</fieldset>}
      <Button type="submit" loading={busy}>Save review</Button>
    </form>}
  </Panel>
}
export default function ChallengesPage() {
  const resource = useApiData<Challenge[]>('/challenges'), relations = useApiData<MentorshipSummary[]>('/mentorship-details')
  const { user } = useAuthStore(), { busy, run } = useAction()
  const [form, setForm] = useState({ mentorshipId: '', title: '', description: '', skills: '', dueDate: '' })
  const active = relations.data?.filter(item => item.status === 'active') ?? []
  return <Workspace title="Skill challenges" description="Practice on real projects, revise with feedback, and collect mentor-reviewed evidence of what you can do."><LoadState {...resource} /><LoadState {...relations} />
    {user?.role === 'mentor' && <Panel title="Assign a challenge"><form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(async () => {
      await api('/challenges', { method: 'POST', body: JSON.stringify({ ...form, skills: splitSkills(form.skills), dueDate: form.dueDate || undefined }) }); setForm({ mentorshipId: '', title: '', description: '', skills: '', dueDate: '' }); resource.refresh()
    }, 'Challenge assigned') }}>
      <Field label="Student mentorship"><select className="input" required value={form.mentorshipId} onChange={e => setForm({ ...form, mentorshipId: e.target.value })}><option value="">Choose an active student</option>{active.map(m => <option key={m.id} value={m.id}>{m.student.name}</option>)}</select></Field>
      <Field label="Challenge title"><input className="input" required maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Brief and acceptance criteria"><textarea className="input" required maxLength={5000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
      <Field label="Challenge skills (comma-separated)"><input className="input" required maxLength={2000} value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} /></Field>
      <Field label="Due date (optional)"><input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></Field><Button type="submit" loading={busy} disabled={!active.length}>Assign challenge</Button>
      {!active.length && <p>Accept a mentorship request first in Mentorships.</p>}
    </form></Panel>}
    {resource.data?.length === 0 && <Panel><p>No challenges yet. {user?.role === 'mentor' ? 'Assign one to an active student.' : 'Connect with a mentor and ask for a practical challenge.'}</p></Panel>}
    {resource.data?.map(item => <ChallengeCard key={item.id} item={item} refresh={resource.refresh} />)}
  </Workspace>
}
