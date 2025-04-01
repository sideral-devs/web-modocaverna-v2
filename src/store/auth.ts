import { api } from '@/lib/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStoreData {
  token: string | null
  hasHydrated: boolean

  setToken: (token: string | null) => void
  logout: () => Promise<void>

  setHydrated: (arg: boolean) => void
}

export const useAuthStore = create<AuthStoreData>()(
  persist(
    (set) => ({
      token: null,
      hasHydrated: false,

      setToken: (token) => {
        set({ token })

        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`
        } else {
          delete api.defaults.headers.Authorization
        }
      },

      logout: async () => {
        await api.post('/auth/logout')

        set({ token: null })

        delete api.defaults.headers.Authorization
      },

      setHydrated: (arg) => {
        set({ hasHydrated: arg })
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
