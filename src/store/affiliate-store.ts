import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AffiliateStoreData {
  code: string | null

  setCode: (code: string | null) => void
}

export const useAffiliateStore = create<AffiliateStoreData>()(
  persist(
    (set) => ({
      code: null,

      setCode: (code) => {
        set({ code })
      },
    }),
    {
      name: 'affiliate-storage',
    },
  ),
)
