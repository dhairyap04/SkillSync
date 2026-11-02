import { useAction } from '@/hooks/useAction'
import { Link } from 'react-router-dom'
import type { MentorshipSummary } from '@/types/growth'
import { useApiData } from '@/hooks/useApiData'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, LoadState } from '@/components/ui/Workspace'
export default function MentorshipsPage() {
  const resource = useApiData<MentorshipSummary[]>('/mentorship-details')
  const { user } = useAuthStore(), { busy, run } = useAction()
  const transition = (id: string, status: string) => run(async () => { await api(`/mentorships/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); resource.refresh() }, 'Mentorship updated')
  return <Workspace title="Your mentorships" description="Manage requests, agree to work together, and turn the connection into meaningful practice."><LoadState {...resource} />
    {resource.data?.length === 0 && <Panel><p>No mentorship requests yet.</p><Link to={user?.role === 'mentor' ? '/dashboard/profile' : '/dashboard/matches'} className="text-primary-600 underline">{user?.role === 'mentor' ? 'Publish your mentor profile' : 'Find a mentor match'} →</Link></Panel>}
    {resource.data?.map(item => <Panel key={item.id} title={user?.id === item.mentorId ? item.student.name : item.mentor.name}><p className="capitalize">{item.status} · Requested {new Date(item.createdAt).toLocaleDateString()}</p><div className="flex gap-3 flex-wrap items-center">
      {item.status === 'pending' && item.mentorId === user?.id && <Button disabled={busy} onClick={() => void transition(item.id, 'active')}>Accept mentorship</Button>}
      {item.status === 'active' && <><Link className="text-primary-600 underline" to={`/dashboard/messages?peer=${item.mentorId === user?.id ? item.studentId : item.mentorId}`}>Message</Link><Link className="text-primary-600 underline" to="/dashboard/challenges">Challenges</Link><Button variant="secondary" disabled={busy} onClick={() => void transition(item.id, 'completed')}>Complete mentorship</Button></>}
      {['pending', 'active'].includes(item.status) && <Button variant="ghost" disabled={busy} onClick={() => void transition(item.id, 'cancelled')}>Cancel mentorship</Button>}
      <Link className="text-primary-600 underline" to="/dashboard/reports">View progress reports</Link>
    </div></Panel>)}
  </Workspace>
}
