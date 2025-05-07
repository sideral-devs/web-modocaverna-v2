import { create } from 'zustand'

type ExtendedGoogleEvent = GoogleEvent & {
  compromisso_id: string
  categoria: string
}

interface CalendarDialog {
  calendarEventOpen: boolean
  googleEventOpen: boolean
  ritualOpen: boolean
  ritualDefaultTab: 'matinal' | 'noturno'

  event: Compromisso | null
  googleEvent: ExtendedGoogleEvent | null

  setCalendarEventOpen: (open: boolean) => void
  setGoogleEventOpen: (open: boolean) => void
  setRitualOpen: (open: boolean) => void
  setRitualDefaultTab: (tab: 'matinal' | 'noturno') => void
  setEvent: (event: Compromisso | null) => void
  setGoogleEvent: (event: ExtendedGoogleEvent | null) => void
}

export const useCalendarDialogStore = create<CalendarDialog>((set) => {
  return {
    calendarEventOpen: false,
    googleEventOpen: false,
    ritualOpen: false,
    ritualDefaultTab: 'matinal',

    event: null,
    googleEvent: null,

    setCalendarEventOpen: (open) => set({ calendarEventOpen: open }),
    setGoogleEventOpen: (open) => set({ googleEventOpen: open }),
    setRitualOpen: (open) => set({ ritualOpen: open }),
    setRitualDefaultTab: (tab) => set({ ritualDefaultTab: tab }),
    setEvent: (event) => set({ event }),
    setGoogleEvent: (event) => set({ googleEvent: event }),
  }
})
