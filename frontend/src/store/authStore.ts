import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (response: AuthResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (response: AuthResponse) =>
        set({
          user: response.user,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'cg_auth',
    },
  ),
)
