import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardingStoreData {
  cellphone: string | null
  setCellphone: (cellphone: string | null) => void
}

export const useOnboardingStore = create<OnboardingStoreData>()(
  persist(
    (set) => ({
      cellphone: null,

      setCellphone: (cellphone) => {
        set({ cellphone })
      },
    }),
    {
      name: 'onboarding-storage',
    },
  ),
)
