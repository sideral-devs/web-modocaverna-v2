import { create } from 'zustand'

type DialogControlStore = {
  isAnyDialogOpen: boolean
  setDialogOpen: (value: boolean) => void
}

export const useDialogControl = create<DialogControlStore>((set) => ({
  isAnyDialogOpen: false,
  setDialogOpen: (value) => set({ isAnyDialogOpen: value }),
}))
