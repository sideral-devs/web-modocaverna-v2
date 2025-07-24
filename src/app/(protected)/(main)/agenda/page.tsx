'use client'
import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { ProtectedRoute } from '@/components/protected-route'
import { CalendarTour } from '@/components/tours/calendar'
import { Dialog } from '@/components/ui/dialog'
import { useCalendarDialogStore } from '@/store/calendar-dialog'
import 'dayjs/locale/pt-br'
import { useRef } from 'react'
import { EditRitualDialog } from '../dashboard/cards/ritual-modal/edit-ritual-dialog'
import { EventCalendar } from './calendar'
import { EditEventDialog } from './edit-event'
import { GoogleEditEventDialog } from './google-edit-event'
import CalendarHeader from './header'

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
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <ProtectedRoute>
      <UpgradeModalTrigger>
        <div
          className="flex flex-col w-screen h-screen items-center overflow-hidden relative"
          ref={containerRef}
        >
          <CalendarHeader />
          <EventCalendar />
          <CalendarTour
            disabled={ritualOpen && googleEventOpen && calendarEventOpen}
          />
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
      </UpgradeModalTrigger>
    </ProtectedRoute>
  )
}
