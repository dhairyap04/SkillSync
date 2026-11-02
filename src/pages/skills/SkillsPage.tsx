import { useAction } from '@/hooks/useAction'
import { useState } from 'react'
import type { Skill, SkillEvidence } from '@/types'
import { useApiData } from '@/hooks/useApiData'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'
import { Link } from 'react-router-dom'

const blank = () => ({ name: '', category: '', proficiency: 0, targetProficiency: 100, evidence: [] as SkillEvidence[] })
export default function SkillsPage() {
  const resource = useApiData<Skill[]>('/skills')
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const { busy, run } = useAction()
  return <Workspace title="Your skills" description="Track your confidence, attach evidence, and build toward mentor-reviewed proof. Proficiency here is self-reported.">
    <LoadState {...resource} />
    <Panel title={editing ? 'Edit skill' : 'Add a skill'}><form className="space-y-4" onSubmit={event => {
      event.preventDefault()
      void run(async () => {
        const input = { ...form, evidence: form.evidence.map(({ verified: _verified, ...item }) => item) }
        await api(editing ? `/skills/${editing}` : '/skills', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(input) })
        setForm(blank()); setEditing(null); resource.refresh()
      }, editing ? 'Skill updated' : 'Skill added')
    }}>
      <div className="grid sm:grid-cols-2 gap-4"><Field label="Skill name"><input className="input" required maxLength={200} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Category"><input className="input" required maxLength={200} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></Field>
      <Field label="Current proficiency (%)"><input className="input" type="number" min={0} max={100} required value={form.proficiency} onChange={e => setForm({ ...form, proficiency: Number(e.target.value) })} /></Field>
      <Field label="Target proficiency (%)"><input className="input" type="number" min={0} max={100} required value={form.targetProficiency} onChange={e => setForm({ ...form, targetProficiency: Number(e.target.value) })} /></Field></div>
      {form.evidence.map((item, index) => <fieldset key={item.id} className="border rounded-lg p-4 space-y-3"><legend>Evidence {index + 1} · Self-reported</legend>
        <Field label="Evidence title"><input className="input" required value={item.title} onChange={e => setForm({ ...form, evidence: form.evidence.map(v => v.id === item.id ? { ...v, title: e.target.value } : v) })} /></Field>
        <Field label="Evidence URL"><input className="input" type="url" pattern="https?://.*" value={item.url ?? ''} onChange={e => setForm({ ...form, evidence: form.evidence.map(v => v.id === item.id ? { ...v, url: e.target.value } : v) })} /></Field>
        <Field label="Evidence description"><textarea className="input" maxLength={2000} value={item.description} onChange={e => setForm({ ...form, evidence: form.evidence.map(v => v.id === item.id ? { ...v, description: e.target.value } : v) })} /></Field>
        <Button type="button" variant="ghost" onClick={() => setForm({ ...form, evidence: form.evidence.filter(v => v.id !== item.id) })}>Remove evidence</Button>
      </fieldset>)}
      <div className="flex flex-wrap gap-3"><Button type="button" variant="secondary" disabled={form.evidence.length >= 100} onClick={() => setForm({ ...form, evidence: [...form.evidence, { id: crypto.randomUUID(), title: '', description: '', url: '', type: 'project', date: new Date().toISOString().slice(0, 10), verified: false }] })}>Attach evidence</Button>
      <Button type="submit" loading={busy}>{editing ? 'Save skill' : 'Add skill'}</Button>{editing && <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(blank()) }}>Cancel edit</Button>}</div>
    </form></Panel>
    <div className="grid md:grid-cols-2 gap-4">{resource.data?.map(skill => <Panel key={skill.id} title={skill.name}><p className="text-neutral-500">{skill.category} · Self-reported</p><p>{skill.proficiency}% current / {skill.targetProficiency ?? 100}% target</p>
      <progress className="w-full" value={skill.proficiency} max={100} aria-label={`${skill.name} proficiency`} />
      {skill.evidence.map(item => <div key={item.id}><strong>{item.title}</strong><p>{item.description}</p>{item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-primary-600 underline">View evidence</a>}</div>)}
      <div className="flex gap-2"><Button variant="secondary" disabled={busy} onClick={() => { setEditing(skill.id); setForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency, targetProficiency: skill.targetProficiency ?? 100, evidence: skill.evidence }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit {skill.name}</Button>
      <Button variant="ghost" disabled={busy} onClick={() => { if (window.confirm(`Delete ${skill.name}?`)) void run(async () => { await api(`/skills/${skill.id}`, { method: 'DELETE' }); resource.refresh() }, 'Skill deleted') }}>Delete</Button></div>
    </Panel>)}</div>
    {resource.data?.length === 0 && <p>Add your first skill above. Reviewed challenge work appears in your <Link className="text-primary-600 underline" to="/dashboard/passport">skill passport</Link>.</p>}
  </Workspace>
}
