import { Button } from './Button'
import { useAction } from '@/hooks/useAction'
import { api } from '@/lib/api'
import type { FeedbackValue, RecommendationKind } from '@/types/recommendations'
export function RecommendationFeedback({ kind, targetId, value, refresh }: { kind: RecommendationKind; targetId: string; value: FeedbackValue | null; refresh: () => void }) {
  const { busy, run } = useAction()
  const vote = (next: FeedbackValue | null) => run(async () => {
    await api('/recommendation-feedback', { method: 'PUT', body: JSON.stringify({ kind, targetId, value: next }) })
    refresh()
  }, next ? 'Recommendation feedback saved' : 'Recommendation feedback removed')
  return <div className="flex flex-wrap items-center gap-2" aria-label="Recommendation feedback">
    <Button size="sm" variant={value === 'helpful' ? 'primary' : 'secondary'} disabled={busy} aria-pressed={value === 'helpful'} onClick={() => void vote(value === 'helpful' ? null : 'helpful')}>Helpful</Button>
    <Button size="sm" variant="ghost" disabled={busy} aria-pressed={value === 'not_for_me'} onClick={() => void vote(value === 'not_for_me' ? null : 'not_for_me')}>{value === 'not_for_me' ? 'Restore recommendation' : 'Not for me'}</Button>
  </div>
}
