import { useEffect, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { MentorListing } from '@/types/api'
import toast from 'react-hot-toast'

export default function MentorSettings() {
  const { user } = useAuthStore()
  const [form, setForm] = useState({ title: '', company: '', location: '', bio: '', skills: '', experienceYears: 0, hourlyRate: 0, availabilityValue: 'flexible', specializations: [] as string[], languages: [] as string[] })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    let active = true
    api<MentorListing>(`/mentors/${user?.id}`).then(data => {
      if (active) setForm({ title: data.title, company: data.company, location: data.location, bio: data.bio,
        skills: data.skills.join(', '), experienceYears: data.experienceYears, hourlyRate: data.hourlyRate, availabilityValue: data.availabilityValue, specializations: data.specializations, languages: data.languages })
    }).catch(error => {
      if (active && !(error instanceof ApiError && error.status === 404)) setLoadError('Unable to load your mentor profile. Reload to try again.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user?.id])
  if (loading) return <p role="status">Loading mentor settings…</p>
  if (loadError) return <p role="alert">{loadError}</p>
  return <section className="bg-white rounded-lg border p-6 space-y-4">
    <h2 className="text-xl font-semibold">Mentor directory profile</h2>
    <p>Publish your expertise and availability so students can find you.</p>
    <form className="space-y-4" onSubmit={async event => {
      event.preventDefault()
      setSaving(true)
      try {
        await api('/mentors/me', { method: 'PUT', body: JSON.stringify({ ...form, skills: form.skills.split(',').map(value => value.trim()).filter(Boolean) }) })
        toast.success('Your mentor profile is published')
      } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to save mentor profile') }
      finally { setSaving(false) }
    }}>
      {(['title', 'company', 'location', 'skills'] as const).map(field => <Input key={field} label={field === 'skills' ? 'Skills (separate with commas)' : field.charAt(0).toUpperCase() + field.slice(1)} required maxLength={field === 'skills' ? 2000 : 200} value={form[field]} onChange={event => setForm({ ...form, [field]: event.target.value })} />)}
      <label className="block">Bio<textarea className="input" required maxLength={500} value={form.bio} onChange={event => setForm({ ...form, bio: event.target.value })} /></label>
      <Input label="Years of experience" type="number" required min={0} max={80} value={form.experienceYears} onChange={event => setForm({ ...form, experienceYears: Number(event.target.value) })} />
      <Input label="Hourly rate ($)" type="number" required min={0} max={10000} step="0.01" value={form.hourlyRate} onChange={event => setForm({ ...form, hourlyRate: Number(event.target.value) })} />
      <label className="block">Availability<select className="input" value={form.availabilityValue} onChange={event => setForm({ ...form, availabilityValue: event.target.value })}>
        <option value="immediate">Available now</option><option value="this-week">This week</option><option value="next-week">Next week</option><option value="flexible">Flexible</option>
      </select></label>
      <Button type="submit" loading={saving}>Publish mentor profile</Button>
    </form>
  </section>
}
