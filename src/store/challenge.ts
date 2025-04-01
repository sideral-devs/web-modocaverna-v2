import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChallengerData {
  textarea_oque_deseja: string | null
  textarea_oque_motivou: string | null
  initialReasonPhotos: string[] | null
  initialSituationPhotos: string[] | null
  compromisses: string[] | null
  fail: string[] | null

  setWish: (wish: string | null) => void
  setReason: (reason: string | null) => void
  setInitialSituationPhotos: (initialSituationPhotos: string[] | null) => void
  setInitialReasonPhotos: (initialReasonPhotos: string[] | null) => void
  setCompromisses: (compromisses: string[] | null) => void
  setFail: (fail: string[] | null) => void
}

export const useChallengerStore = create<ChallengerData>()(
  persist(
    (set) => {
      return {
        textarea_oque_deseja: null,
        textarea_oque_motivou: null,
        initialSituationPhotos: null,
        initialReasonPhotos: null,
        compromisses: null,
        fail: null,

        setWish: (wish) => {
          set({ textarea_oque_deseja: wish })
        },

        setReason: (reason) => {
          set({ textarea_oque_motivou: reason })
        },

        setInitialSituationPhotos: (initialSituationPhotos) => {
          set({ initialSituationPhotos })
        },

        setInitialReasonPhotos: (initialReasonPhotos) => {
          set({ initialReasonPhotos })
        },

        setCompromisses: (compromisses) => {
          set({ compromisses })
        },

        setFail: (fail) => {
          set({ fail })
        },
      }
    },
    {
      name: 'challenge-storage',
    },
  ),
)
