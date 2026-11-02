import { useAction } from '@/hooks/useAction'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Roadmap, RoadmapTemplate } from '@/types/growth'
import type { Goal } from '@/types'
import { useApiData } from '@/hooks/useApiData'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'
export default function RoadmapsPage() {
  const templates = useApiData<RoadmapTemplate[]>('/roadmap-templates'), roadmaps = useApiData<Roadmap[]>('/roadmaps'), goals = useApiData<Goal[]>('/goals')
  const [title, setTitle] = useState('')
  const { busy, run } = useAction()
  return <Workspace title="Career roadmaps" description="Choose a starting path, then adapt the goals and milestones to your ambitions. These are editable guides, not promises of a job."><LoadState {...templates} /><LoadState {...roadmaps} /><LoadState {...goals} />
    <Panel title="Start a path"><Field label="Personal roadmap title (optional)"><input className="input" maxLength={200} value={title} onChange={e => setTitle(e.target.value)} /></Field><div className="grid md:grid-cols-3 gap-4">{templates.data?.map(template => <div className="border rounded-lg p-4 space-y-3" key={template.id}><h3 className="font-semibold">{template.title}</h3><p>{template.description}</p><ol className="list-decimal pl-5 text-sm">{template.steps.map(step => <li key={step.title}>{step.title}</li>)}</ol><Button disabled={busy} onClick={() => void run(async () => { await api('/roadmaps', { method: 'POST', body: JSON.stringify({ templateId: template.id, ...(title.trim() ? { title: title.trim() } : {}) }) }); roadmaps.refresh(); goals.refresh(); setTitle('') }, 'Roadmap created with editable goals')}>Start {template.title}</Button></div>)}</div></Panel>
    {roadmaps.data?.map(roadmap => {
      const steps = roadmap.goalIds.map(id => goals.data?.find(goal => goal.id === id)).filter((goal): goal is Goal => !!goal)
      const progress = steps.length ? Math.round(steps.reduce((sum, goal) => sum + goal.progress, 0) / steps.length) : 0
      return <Panel key={roadmap.id} title={roadmap.title}><p>{progress}% complete across {steps.length} current goals</p><progress className="w-full" max={100} value={progress} aria-label={`${roadmap.title} progress`} /><ol className="space-y-3 list-decimal pl-5">{steps.map(goal => <li key={goal.id}><strong>{goal.title}</strong><p>{goal.description}</p><span className="text-sm text-neutral-500">{goal.progress}% · {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</span></li>)}</ol><Link to="/dashboard/goals" className="text-primary-600 underline">Edit goals, change milestones, and track progress →</Link></Panel>
    })}
  </Workspace>
}
