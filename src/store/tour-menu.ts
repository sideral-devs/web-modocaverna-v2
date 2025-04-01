import { create } from 'zustand'

interface TourMenuData {
  open: boolean
  setOpen: (arg: boolean) => void
}

export const useTourMenu = create<TourMenuData>((set) => {
  return {
    open: false,

    setOpen: (arg) => {
      set({ open: arg })
    },
  }
})
