// store/usePopupDesafio.ts
import { create } from 'zustand'

type PopupDesafioStore = {
  isVisible: boolean
  show: () => void
  hide: () => void
}

export const usePopupDesafio = create<PopupDesafioStore>((set) => ({
  isVisible: false,
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
}))
