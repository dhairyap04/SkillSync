import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApiData } from '@/hooks/useApiData'
import { useAction } from '@/hooks/useAction'
import { api } from '@/lib/api'
import type { ResourceRecommendation } from '@/types/recommendations'
import { Button } from '@/components/ui/Button'
import { RecommendationFeedback } from '@/components/ui/RecommendationFeedback'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'
export default function ResourcesPage() {
  const resource = useApiData<ResourceRecommendation[]>('/resources')
  const { busy, run } = useAction()
  const [view, setView] = useState('recommended'), [search, setSearch] = useState(''), [category, setCategory] = useState('all'), [difficulty, setDifficulty] = useState('all')
  const items = resource.data?.filter(item => {
    const r = item.resource
    return (view === 'all' || (view === 'recommended' && !item.completed && item.feedback !== 'not_for_me' && (!item.hasPreferences || item.score > 0)) || (view === 'saved' && item.saved) || (view === 'completed' && item.completed) || (view === 'dismissed' && item.feedback === 'not_for_me')) &&
      (category === 'all' || r.category === category) && (difficulty === 'all' || r.difficulty === difficulty) &&
      [r.title, r.description, ...r.skills].join(' ').toLowerCase().includes(search.toLowerCase().trim())
  }) ?? []
  const update = (id: string, state: { saved?: boolean; completed?: boolean }) => run(async () => { await api(`/resources/${id}/state`, { method: 'PUT', body: JSON.stringify(state) }); resource.refresh() }, 'Resource updated')
  return <Workspace title="Learning resources" description="Find real learning material matched to your interests, active goals, and self-reported skill gaps. Save resources, track completion, and tell us what helps.">
    <Link className="text-primary-600 underline" to="/dashboard/matches">Edit learning preferences →</Link>
    <Panel title="Explore your library"><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"><Field label="Resource view"><select className="input" value={view} onChange={e => setView(e.target.value)}><option value="recommended">Recommended</option><option value="all">All resources</option><option value="saved">Saved</option><option value="completed">Completed</option><option value="dismissed">Dismissed</option></select></Field>
    <Field label="Search resources"><input className="input" value={search} maxLength={200} onChange={e => setSearch(e.target.value)} /></Field>
    <Field label="Resource category"><select className="input" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option><option value="programming">Programming</option><option value="data">Data</option><option value="design">Design</option></select></Field>
    <Field label="Resource difficulty"><select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option></select></Field></div>
    <p className="text-sm text-neutral-500">Topic matches include known aliases and related skills. Recommendations use local text similarity and your explicit feedback, not a prediction of learning outcomes. Completed and dismissed items stay out of Recommended; you can restore them using the other views.</p>
    <Button variant="ghost" disabled={busy} onClick={() => void run(async () => { await api('/recommendation-feedback', { method: 'DELETE', body: JSON.stringify({ kind: 'resource' }) }); resource.refresh() }, 'Resource feedback reset')}>Reset resource feedback</Button></Panel>
    <LoadState {...resource} />{!resource.loading && !resource.error && items.length === 0 && <p>No resources match these filters. Try All resources or clear your search.</p>}
    <div className="grid md:grid-cols-2 gap-4">{items.map(item => <Panel key={item.resource.id} title={item.resource.title}><p className="text-sm text-neutral-500">{item.resource.provider} · {item.resource.category} · {item.resource.difficulty}</p><p>{item.resource.description}</p><strong className="text-primary-700">{item.hasPreferences ? `${item.score}% topic fit` : 'Explore this resource'}</strong><ul className="list-disc pl-5">{item.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul><p className="text-sm">{item.resource.skills.join(' · ')}</p><a className="text-primary-600 underline" href={item.resource.url} target="_blank" rel="noreferrer">Open learning material ↗</a>
      <div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={busy} aria-pressed={item.saved} onClick={() => void update(item.resource.id, { saved: !item.saved })}>{item.saved ? 'Unsave resource' : 'Save resource'}</Button><Button variant="secondary" disabled={busy} aria-pressed={item.completed} onClick={() => void update(item.resource.id, { completed: !item.completed })}>{item.completed ? 'Mark incomplete' : 'Mark completed'}</Button></div>
      <RecommendationFeedback kind="resource" targetId={item.resource.id} value={item.feedback} refresh={resource.refresh} />
    </Panel>)}</div>
  </Workspace>
}
