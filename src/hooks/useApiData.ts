import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'

export function useApiData<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const refresh = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    api<T>(path, { signal: controller.signal }).then(value => {
      if (!controller.signal.aborted) setData(value)
    }).catch(reason => {
      if (!controller.signal.aborted) { setData(null); setError(reason instanceof Error ? reason.message : 'Unable to load data') }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [path, revision])
  return { data, setData, loading, error, refresh }
}
