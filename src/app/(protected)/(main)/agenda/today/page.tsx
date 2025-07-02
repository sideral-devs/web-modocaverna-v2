'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Dialog } from '@/components/ui/dialog'
import { useCalendarDialogStore } from '@/store/calendar-dialog'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { EditRitualDialog } from '../../dashboard/cards/ritual-modal/edit-ritual-dialog'
import { EditEventDialog } from '../edit-event'
import { GoogleEditEventDialog } from '../google-edit-event'
import CalendarHeader from '../header'
import { TodayEventCalendar } from './today-calendar'

dayjs.locale('pt-br')

export default function Page() {
  const {
    ritualOpen,
    ritualDefaultTab,
    setRitualOpen,
    googleEvent,
    googleEventOpen,
    setGoogleEventOpen,
    calendarEventOpen,
    event,
    setCalendarEventOpen,
  } = useCalendarDialogStore()

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-screen h-screen items-center overflow-hidden">
        <CalendarHeader />
        <TodayEventCalendar />
      </div>
      <Dialog open={ritualOpen} onOpenChange={setRitualOpen}>
        <EditRitualDialog defaultTab={ritualDefaultTab} />
      </Dialog>
      {googleEvent && (
        <GoogleEditEventDialog
          event={googleEvent}
          open={googleEventOpen}
          setOpen={setGoogleEventOpen}
        />
      )}
      {event && (
        <EditEventDialog
          event={event}
          open={calendarEventOpen}
          setOpen={setCalendarEventOpen}
        />
      )}
    </ProtectedRoute>
  )
}
