import { useAction } from '@/hooks/useAction'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Connection } from '@/types/growth'
import { useApiData } from '@/hooks/useApiData'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'
interface ChatMessage { id: string; senderId: string; receiverId: string; content: string; createdAt: string }
function Conversation({ peer }: { peer: Connection['peer'] }) {
  const [page, setPage] = useState(1)
  const resource = useApiData<ChatMessage[]>(`/messages/${peer.id}?page=${page}&limit=50`)
  const [content, setContent] = useState('')
  const { user } = useAuthStore(), { busy, run } = useAction()
  useEffect(() => { if (page !== 1) return; const timer = setInterval(resource.refresh, 10000); return () => clearInterval(timer) }, [page, resource.refresh])
  return <Panel title={`Conversation with ${peer.name}`}><p className="text-sm text-neutral-500">Latest messages refresh every 10 seconds. Text only; no read receipts.</p><LoadState {...resource} />
    <div className="max-h-[28rem] overflow-y-auto space-y-4" aria-label="Conversation messages">{resource.data?.length === 0 && <p>No messages on this page.</p>}{resource.data?.map(message => <div className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`} key={message.id}><div className={`max-w-[85%] rounded-lg p-3 ${message.senderId === user?.id ? 'bg-primary-600 text-white' : 'bg-neutral-100'}`}><p className="whitespace-pre-wrap break-words">{message.content}</p><time className="text-xs opacity-75">{new Date(message.createdAt).toLocaleString()}</time></div></div>)}</div>
    <div className="flex gap-2 items-center"><Button variant="secondary" disabled={page === 1 || resource.loading} onClick={() => setPage(p => p - 1)}>Newer messages</Button><span>Page {page}</span><Button variant="secondary" disabled={resource.loading || (resource.data?.length ?? 0) < 50} onClick={() => setPage(p => p + 1)}>Older messages</Button></div>
    <form className="space-y-3" onSubmit={event => { event.preventDefault(); void run(async () => { await api('/messages', { method: 'POST', body: JSON.stringify({ receiverId: peer.id, content }) }); setContent(''); setPage(1); resource.refresh() }, 'Message sent') }}><Field label="Your message"><textarea className="input" required maxLength={5000} value={content} onChange={e => setContent(e.target.value)} /></Field><Button type="submit" loading={busy} disabled={!content.trim()}>Send message</Button></form>
  </Panel>
}
export default function MessagesPage() {
  const connections = useApiData<Connection[]>('/connections')
  const [params, setParams] = useSearchParams()
  const selected = connections.data?.find(c => c.peer.id === params.get('peer'))
  return <Workspace title="Messages" description="Talk with members after a mentorship or skill exchange has been accepted. Conversations are private to the two participants."><LoadState {...connections} />
    <Button variant="secondary" onClick={connections.refresh}>Refresh connections</Button>
    {connections.data?.length === 0 && <Panel><p>No active connections. Accept a mentorship or peer exchange to start a conversation.</p></Panel>}
    <div className="grid lg:grid-cols-[16rem_1fr] gap-4"><div className="space-y-2">{connections.data?.map(item => <button key={item.peer.id} className={`w-full text-left p-4 rounded-lg border ${selected?.peer.id === item.peer.id ? 'bg-primary-50 border-primary-300' : 'bg-white'}`} onClick={() => setParams({ peer: item.peer.id })}><strong className="block">{item.peer.name}</strong><span className="text-sm capitalize">{item.kind}</span></button>)}</div><div>{selected ? <Conversation key={selected.peer.id} peer={selected.peer} /> : connections.data?.length ? <Panel><p>Select a connection to open the conversation.</p></Panel> : null}</div></div>
  </Workspace>
}
