import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field } from '@/components/ui/Workspace'
import { useAction } from '@/hooks/useAction'
import MentorSettings from './MentorSettings'
export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { busy, run } = useAction()
  const [form, setForm] = useState({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '', bio: user?.bio ?? '', location: user?.location ?? '', company: user?.company ?? '', title: user?.title ?? '', website: user?.website ?? '', linkedinUrl: user?.linkedinUrl ?? '', githubUrl: user?.githubUrl ?? '' })
  return <Workspace title="Your profile" description="Keep your account details up to date. Mentor directory publishing and passport sharing are controlled separately."><Panel title="Account profile"><form className="space-y-4" onSubmit={e => { e.preventDefault(); void run(async () => { await updateUser(form) }, 'Profile saved') }}><div className="grid sm:grid-cols-2 gap-4">{(['firstName', 'lastName', 'email', 'location', 'company', 'title', 'website', 'linkedinUrl', 'githubUrl'] as const).map(field => <Field key={field} label={{ firstName: 'First name', lastName: 'Last name', email: 'Email', location: 'Location', company: 'Company', title: 'Professional title', website: 'Website', linkedinUrl: 'LinkedIn URL', githubUrl: 'GitHub URL' }[field]}><input className="input" type={field === 'email' ? 'email' : ['website', 'linkedinUrl', 'githubUrl'].includes(field) ? 'url' : 'text'} required={['firstName', 'lastName', 'email'].includes(field)} maxLength={['website', 'linkedinUrl', 'githubUrl'].includes(field) ? 2000 : 200} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} /></Field>)}</div><Field label="Bio"><textarea className="input" maxLength={500} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></Field><Button type="submit" loading={busy}>Save profile</Button></form></Panel>{user?.role === 'mentor' && <MentorSettings />}</Workspace>
}
