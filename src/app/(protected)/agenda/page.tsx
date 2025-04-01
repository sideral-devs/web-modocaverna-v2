import { ProtectedRoute } from '@/components/protected-route'
import 'dayjs/locale/pt-br'
import { EventCalendar } from './calendar'
import CalendarHeader from './header'

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-screen h-screen items-center overflow-hidden">
        <CalendarHeader />
        <EventCalendar />
      </div>
    </ProtectedRoute>
  )
}
