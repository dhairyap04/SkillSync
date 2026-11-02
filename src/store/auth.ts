import { create } from 'zustand'
import type { User } from '@/types'
import { authApi, ApiError } from '@/lib/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  sessionError: string | null
  login: (user: User) => void
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => Promise<void>
  restoreSession: () => Promise<void>
}

// Authentication is restored from the server's HttpOnly cookie, never localStorage.
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  sessionError: null,
  login: user => set({ user, isAuthenticated: true, isLoading: false, sessionError: null }),
  logout: async () => {
    await authApi.logout()
    set({ user: null, isAuthenticated: false, isLoading: false })
  },
  updateUser: async input => {
    const user = await authApi.updateProfile(input)
    set({ user })
  },
  restoreSession: async () => {
    set({ isLoading: true, sessionError: null })
    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true })
    } catch (error) {
      set({ user: null, isAuthenticated: false, sessionError: error instanceof ApiError && error.status === 401 ? null : 'Unable to connect to SkillSync. Please try again.' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
