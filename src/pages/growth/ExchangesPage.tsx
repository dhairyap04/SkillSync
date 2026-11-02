import { useAction } from '@/hooks/useAction'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ExchangeOffer, ExchangeRequest } from '@/types/growth'
import { useAuthStore } from '@/store/auth'
import { useApiData } from '@/hooks/useApiData'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Workspace, Panel, Field, LoadState } from '@/components/ui/Workspace'
export default function ExchangesPage() {
  const offers = useApiData<ExchangeOffer[]>('/exchange-offers'), requests = useApiData<ExchangeRequest[]>('/exchanges')
  const { user } = useAuthStore(), { busy, run } = useAction()
  const [form, setForm] = useState({ teach: '', learn: '', description: '' })
  const mine = offers.data?.filter(offer => offer.ownerId === user?.id) ?? []
  const refresh = () => { offers.refresh(); requests.refresh() }
  const transition = (id: string, status: string) => run(async () => { await api(`/exchanges/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); refresh() }, 'Exchange updated')
  return <Workspace title="Peer skill exchanges" description="Trade knowledge, not money. Offer a skill you can teach and name one you want to learn. Matching offers can start an exchange and a private conversation."><LoadState {...offers} /><LoadState {...requests} />
    <Panel title="Offer a skill exchange"><form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(async () => { await api('/exchange-offers', { method: 'POST', body: JSON.stringify(form) }); setForm({ teach: '', learn: '', description: '' }); offers.refresh() }, 'Exchange offer published') }}>
      <div className="grid sm:grid-cols-2 gap-4"><Field label="I can teach"><input className="input" required maxLength={200} value={form.teach} onChange={e => setForm({ ...form, teach: e.target.value })} /></Field><Field label="I want to learn"><input className="input" required maxLength={200} value={form.learn} onChange={e => setForm({ ...form, learn: e.target.value })} /></Field></div><Field label="What can you help with?"><textarea className="input" required maxLength={5000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field><Button type="submit" loading={busy}>Publish exchange offer</Button>
    </form></Panel>
    <div className="grid md:grid-cols-2 gap-4">{offers.data?.map(offer => {
      const complement = mine.find(m => m.active && m.teach.toLowerCase() === offer.learn.toLowerCase() && m.learn.toLowerCase() === offer.teach.toLowerCase())
      return <Panel key={offer.id} title={`${offer.teach} ↔ ${offer.learn}`}><p>{offer.owner?.name} offers {offer.teach} and wants to learn {offer.learn}.</p><p>{offer.description}</p>
        {offer.ownerId === user?.id ? <Button disabled={busy} variant="secondary" onClick={() => void run(async () => { await api(`/exchange-offers/${offer.id}`, { method: 'PATCH', body: JSON.stringify({ active: !offer.active }) }); offers.refresh() }, 'Offer updated')}>{offer.active ? 'Pause your offer' : 'Reactivate your offer'}</Button> : <><p className="text-sm text-teal-700">{offer.reciprocal ? 'You have a complementary offer' : 'Publish a complementary offer to request this exchange'}</p><Button disabled={busy || !complement} onClick={() => void run(async () => { await api('/exchanges', { method: 'POST', body: JSON.stringify({ offerId: offer.id, requesterOfferId: complement?.id }) }); requests.refresh() }, 'Exchange request sent')}>Request exchange</Button></>}
      </Panel>
    })}</div>
    <Panel title="Your exchange requests">{requests.data?.length === 0 && <p>No requests yet.</p>}{requests.data?.map(request => <div className="border rounded-lg p-4 space-y-2" key={request.id}><h3 className="font-semibold">{request.requester?.name} ↔ {request.recipient?.name}</h3><p>{request.teach} ↔ {request.learn} · {request.status}</p><div className="flex gap-2 flex-wrap">
      {request.status === 'pending' && request.recipientId === user?.id && <Button disabled={busy} onClick={() => void transition(request.id, 'active')}>Accept exchange</Button>}
      {request.status === 'active' && <><Link className="text-primary-600 underline p-2" to={`/dashboard/messages?peer=${request.requesterId === user?.id ? request.recipientId : request.requesterId}`}>Open conversation</Link><Button variant="secondary" disabled={busy} onClick={() => void transition(request.id, 'completed')}>Complete exchange</Button></>}
      {['pending', 'active'].includes(request.status) && <Button variant="ghost" disabled={busy} onClick={() => void transition(request.id, 'cancelled')}>Cancel exchange</Button>}
    </div></div>)}</Panel>
  </Workspace>
}
