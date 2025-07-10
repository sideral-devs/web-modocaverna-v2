import { create } from 'zustand'

interface InteractionStore {
  hasUserInteracted: boolean
  setHasUserInteracted: (arg: boolean) => void
}

export const useInteractionStore = create<InteractionStore>((set) => {
  return {
    hasUserInteracted: false,

    setHasUserInteracted: (arg) => {
      set({ hasUserInteracted: arg })
    },
  }
})
