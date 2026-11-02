import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { Button } from './Button'

export function Workspace({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="space-y-6"><header><p className="text-primary-600 font-semibold text-sm mb-2">YOUR NEXT CHAPTER</p><h1 className="text-3xl font-bold text-neutral-900">{title}</h1><p className="text-neutral-600 mt-2 max-w-3xl">{description}</p></header>{children}</div>
}
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">{title && <h2 className="text-xl font-semibold">{title}</h2>}{children}</section>
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  const generatedId = useId()
  const child = isValidElement(children) ? children as ReactElement<{ id?: string }> : null
  const id = child?.props.id ?? generatedId
  return <div className="block text-sm font-medium text-neutral-700 space-y-1"><label htmlFor={id}>{label}</label>{child ? cloneElement(child, { id }) : children}</div>
}
export function LoadState({ loading, error, refresh }: { loading: boolean; error: string; refresh: () => void }) {
  if (error) return <div role="alert" className="rounded-lg border border-red-200 p-4 text-red-700">{error} <Button variant="secondary" size="sm" onClick={refresh}>Retry</Button></div>
  return loading ? <p role="status" className="text-neutral-500">Loading…</p> : null
}
