'use client'
import { ProtectedRoute } from '@/components/protected-route'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import CalendarHeader from '../header'
import { TodayEventCalendar } from './today-calendar'

dayjs.locale('pt-br')

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-screen h-screen items-center overflow-hidden">
        <CalendarHeader />
        <TodayEventCalendar />
      </div>
    </ProtectedRoute>
  )
}
