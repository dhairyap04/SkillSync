import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

export function useAction() {
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  const run = async (action: () => Promise<void>, success?: string) => {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    try { await action(); if (success) toast.success(success) }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to complete this action') }
    finally { lock.current = false; setBusy(false) }
  }
  return { busy, run }
}
