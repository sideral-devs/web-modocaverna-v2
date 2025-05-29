import { create } from 'zustand'

interface TourMenuData {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useTourMenu = create<TourMenuData>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
