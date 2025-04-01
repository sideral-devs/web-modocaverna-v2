import { create } from 'zustand'

interface CalendarStoreData {
  selectedDate: Date
  setSelectedDate: (arg: Date | undefined) => void
}

export const useCalendarStore = create<CalendarStoreData>((set) => {
  return {
    selectedDate: new Date(),

    setSelectedDate: (arg) => {
      if (!arg) return
      set({ selectedDate: arg })
    },
  }
})
