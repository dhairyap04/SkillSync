import type { User } from '@/types'

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-SkillSync-Client': 'web', ...options.headers },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, body?.message ?? 'The server could not complete your request')
  return body.data as T
}
export const authApi = {
  login: (input: { email: string; password: string }) => api<User>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  signup: (input: { firstName: string; lastName: string; email: string; password: string; role: 'student' | 'mentor'; agreeToTerms: boolean }) => api<User>('/auth/signup', { method: 'POST', body: JSON.stringify(input) }),
  me: () => api<User>('/auth/me'),
  logout: () => api<null>('/auth/logout', { method: 'POST' }),
  updateProfile: (input: Partial<User>) => api<User>('/users/me', { method: 'PATCH', body: JSON.stringify(input) }),
}
