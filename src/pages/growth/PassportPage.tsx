import { useAction } from '@/hooks/useAction'
import { Link, useParams } from 'react-router-dom'
import type { Passport } from '@/types/growth'
import { useApiData } from '@/hooks/useApiData'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, LoadState } from '@/components/ui/Workspace'

export default function PassportPage() {
  const { token } = useParams()
  const resource = useApiData<Passport>(token ? `/public/passports/${token}` : '/passport')
  const { busy, run } = useAction()
  const sharedUrl = resource.data?.shareToken ? `${window.location.origin}/passport/${resource.data.shareToken}` : ''
  const content = <Workspace title={token ? `${resource.data?.name ?? 'Member'}’s skill passport` : 'Your skill passport'} description="Evidence-backed skills, linked to the work and the mentor who reviewed it. An endorsement records a mentor’s assessment, not an accredited certification."><LoadState {...resource} />
    {!token && <Panel title="Sharing controls"><p>Your passport is private by default. Publishing shares your name, accepted challenge briefs, project links, submission summaries, mentor feedback, endorsed skills, and reviewers’ names with anyone who has the link. Check that linked projects contain no private information.</p>
      {sharedUrl && <FieldLink url={sharedUrl} />}
      <Button loading={busy} onClick={() => void run(async () => { await api('/passport/sharing', { method: 'PUT', body: JSON.stringify({ published: !resource.data?.shareToken }) }); resource.refresh() }, resource.data?.shareToken ? 'Sharing revoked' : 'Passport published')} disabled={!resource.data}>{resource.data?.shareToken ? 'Revoke public link' : 'Publish passport'}</Button>
    </Panel>}
    {resource.data?.evidence.length === 0 && <Panel><p>No accepted challenge work yet. {token ? 'This member has not added reviewed work.' : <Link className="text-primary-600 underline" to="/dashboard/challenges">Complete a challenge with your mentor →</Link>}</p></Panel>}
    {resource.data?.evidence.map(item => <Panel key={item.id} title={item.title}><p className="text-primary-700 font-medium">Reviewed by {item.mentor.name} · {new Date(item.reviewedAt).toLocaleDateString()}</p><p>{item.description}</p><p className="whitespace-pre-wrap">{item.summary}</p><a className="text-primary-600 underline" href={item.url} target="_blank" rel="noreferrer">View reviewed project ↗</a><div className="flex flex-wrap gap-2">{item.skills.map(skill => <span className="rounded-full bg-teal-50 text-teal-800 px-3 py-1 text-sm" key={skill}>{skill} · Mentor endorsed</span>)}</div><blockquote className="border-l-4 border-primary-200 pl-4 whitespace-pre-wrap">{item.feedback}</blockquote></Panel>)}
  </Workspace>
  return token ? <main className="min-h-screen bg-neutral-50 p-6"><div className="max-w-3xl mx-auto"><Link to="/" className="text-primary-700 font-bold inline-block mb-6">SkillSync</Link>{content}</div></main> : content
}
function FieldLink({ url }: { url: string }) {
  return <label className="block">Public passport link<input className="input" readOnly value={url} onFocus={e => e.target.select()} /><a className="text-primary-600 underline" target="_blank" rel="noreferrer" href={url}>Open public passport</a></label>
}
