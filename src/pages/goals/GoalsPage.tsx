import { useAction } from '@/hooks/useAction'
import { useState } from 'react'
import type { Goal, Skill } from '@/types'
import { Link } from 'react-router-dom'
import { useApiData } from '@/hooks/useApiData'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'

type Draft = Pick<Goal, 'title' | 'description' | 'status' | 'priority' | 'skills' | 'progress' | 'milestones'> & { dueDate: string }
const blank = (): Draft => ({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', skills: [], progress: 0, milestones: [] })
const goalInput = (goal: Draft | Goal) => ({ title: goal.title, description: goal.description, status: goal.status, priority: goal.priority,
  ...(goal.dueDate ? { dueDate: goal.dueDate } : {}), skills: goal.skills, progress: goal.progress,
  milestones: goal.milestones.map(({ id, title, description, completed, dueDate }) => ({ id, title, description, completed, ...(dueDate ? { dueDate } : {}) })) })
export default function GoalsPage() {
  const resource = useApiData<Goal[]>('/goals'), skills = useApiData<Skill[]>('/skills')
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Draft>(blank)
  const { busy, run } = useAction()
  const update = (goal: Goal) => run(async () => {
    const previous = resource.data
    resource.setData(items => items?.map(item => item.id === goal.id ? goal : item) ?? null)
    try {
      await api(`/goals/${goal.id}`, { method: 'PUT', body: JSON.stringify(goalInput(goal)) })
      resource.refresh()
    } catch (error) { resource.setData(previous); throw error }
  }, 'Goal updated')
  return <Workspace title="Goals & milestones" description="Turn intentions into small steps. Your goals and roadmap milestones stay saved to your account.">
    <Link className="text-primary-600 underline" to="/dashboard/roadmaps">Start with a career roadmap →</Link><LoadState {...resource} /><LoadState {...skills} />
    <Panel title={editing ? 'Edit goal' : 'Create a goal'}><form className="space-y-4" onSubmit={event => {
      event.preventDefault(); void run(async () => { await api(editing ? `/goals/${editing}` : '/goals', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(goalInput(form)) }); setEditing(null); setForm(blank()); resource.refresh() }, 'Goal saved')
    }}><Field label="Goal title"><input className="input" required maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
    <Field label="Description"><textarea className="input" maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
    <div className="grid sm:grid-cols-3 gap-4"><Field label="Status"><select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Goal['status'], ...(e.target.value === 'completed' ? { progress: 100 } : {}) })}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></Field>
    <Field label="Priority"><select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Goal['priority'] })}><option>low</option><option>medium</option><option>high</option></select></Field>
    <Field label="Due date"><input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></Field></div>
    <Field label="Progress (%)"><input className="input" type="number" required min={0} max={100} value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} /></Field>
    <fieldset><legend className="text-sm font-medium">Related skills</legend>{skills.data?.map(skill => <label key={skill.id} className="inline-flex items-center gap-2 mr-4"><input type="checkbox" checked={form.skills.includes(skill.id)} onChange={e => setForm({ ...form, skills: e.target.checked ? [...form.skills, skill.id] : form.skills.filter(id => id !== skill.id) })} />{skill.name}</label>)}</fieldset>
    {form.milestones.map((milestone, index) => <div className="flex gap-2" key={milestone.id}><Field label={`Milestone ${index + 1}`}><input className="input" required maxLength={200} value={milestone.title} onChange={e => setForm({ ...form, milestones: form.milestones.map(m => m.id === milestone.id ? { ...m, title: e.target.value } : m) })} /></Field><Button type="button" variant="ghost" onClick={() => setForm({ ...form, milestones: form.milestones.filter(m => m.id !== milestone.id) })}>Remove</Button></div>)}
    <div className="flex gap-3 flex-wrap"><Button type="button" variant="secondary" disabled={form.milestones.length >= 100} onClick={() => setForm({ ...form, milestones: [...form.milestones, { id: crypto.randomUUID(), title: '', description: '', completed: false }] })}>Add milestone</Button><Button type="submit" loading={busy}>Save goal</Button>{editing && <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(blank()) }}>Cancel edit</Button>}</div>
    </form></Panel>
    {resource.data?.length === 0 && <p>No goals yet. Add one above or choose a roadmap.</p>}
    <div className="grid md:grid-cols-2 gap-4">{resource.data?.map(goal => <Panel key={goal.id} title={goal.title}><p>{goal.description}</p><p className="text-sm text-neutral-500">{goal.status.replace('_', ' ')} · {goal.priority} priority{goal.dueDate && ` · Due ${goal.dueDate}`}</p>
      <progress className="w-full" value={goal.progress} max={100} aria-label={`${goal.title} progress`} /><p>{goal.progress}% complete</p>
      {goal.milestones.map(milestone => <label key={milestone.id} className="flex gap-2"><input type="checkbox" disabled={busy} checked={milestone.completed} onChange={e => {
        const milestones = goal.milestones.map(m => m.id === milestone.id ? { ...m, completed: e.target.checked } : m)
        const progress = Math.round(100 * milestones.filter(m => m.completed).length / milestones.length)
        void update({ ...goal, milestones, progress, status: progress === 100 ? 'completed' : progress ? 'in_progress' : 'todo' })
      }} />{milestone.title}</label>)}
      <div className="flex gap-2"><Button variant="secondary" disabled={busy} onClick={() => { setEditing(goal.id); setForm({ ...goalInput(goal), dueDate: goal.dueDate ?? '' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit {goal.title}</Button><Button variant="ghost" disabled={busy} onClick={() => { if (window.confirm(`Delete ${goal.title}? This also removes it from any roadmap.`)) void run(async () => { await api(`/goals/${goal.id}`, { method: 'DELETE' }); resource.refresh() }, 'Goal deleted') }}>Delete</Button></div>
    </Panel>)}</div>
  </Workspace>
}
