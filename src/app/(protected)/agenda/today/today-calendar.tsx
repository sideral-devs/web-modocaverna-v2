'use client'
import { Calendar } from '@/components/ui/calendar'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { CalendarEvent } from '../calendar-event'
import { GoogleEditEventDialogTrigger } from '../google-edit-event'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

export function TodayEventCalendar() {
  const session = useSession()
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  const today = dayjs(selected).startOf('day').format('YYYY-MM-DD')
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  const { data } = useQuery({
    queryKey: ['events', `${today}-${today}`],
    queryFn: async () => {
      const response = await api.get('/compromissos/find', {
        params: {
          date_field: 'comeca',
          date_start: today,
          date_end: today,
        },
      })
      return response.data as EventsDTO
    },
  })

  const { data: googleEvents } = useQuery({
    queryKey: ['events-google', `${today}-${today}`],
    queryFn: async () => {
      const response = await api.get('/eventos-google/show', {
        params: {
          date_field: 'comeca',
          date_start: today,
          date_end: today,
        },
      })
      return response.data
    },
    enabled: !!session,
  })

  function scrollToNow() {
    if (scrollableRef.current) {
      const now = new Date()
      const PIXELS_PER_MINUTE = 112 / 60
      const startMinutes = now.getHours() * 60 + now.getMinutes()
      const top = startMinutes * PIXELS_PER_MINUTE

      // Subtrair uma quantia para a barra ficar mais ou menos no meio
      const diff = dayjs().add(-2, 'hours').isSame(dayjs(), 'day')
        ? PIXELS_PER_MINUTE * 60 * 2
        : 0

      scrollableRef.current.scrollTo({
        top: top - diff,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    scrollToNow()
  }, [])

  return (
    <section className="flex w-full max-w-[1512px] h-[calc(100vh-98px)]">
      <div className="flex flex-col max-w-72 w-72 border-r overflow-y-auto scrollbar-minimal">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="w-full"
        />
      </div>
      <div
        ref={scrollableRef}
        className="flex flex-col xl:w-full h-full flex-1 overflow-y-auto scrollbar-minimal"
      >
        <div className="flex-1 min-h-0">
          <div className="flex flex-col h-full max-h-[calc(100vh-100px)] relative">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="flex w-16 min-w-16 h-28 items-end justify-end p-2 bg-zinc-900 border-r">
                  <span className="text-sm text-zinc-500">
                    {(index < 23 ? index + 1 : 0).toFixed(0).padStart(2, '0')}
                    :00
                  </span>
                </div>
                <div className="flex w-full h-28 border-b">
                  <div className="min-w-36 w-full h-full border-r" />
                </div>
              </div>
            ))}
            {data &&
              data.compromissos.map((event) => (
                <CalendarEvent
                  event={event}
                  key={event.compromisso_id}
                  now={selected}
                  mode="daily"
                />
              ))}
            {googleEvents?.events?.length > 0 &&
              googleEvents.events?.map((event: GoogleEvent, index: number) => (
                <GoogleEvent
                  event={{
                    ...event,
                    compromisso_id: event.event_id, // Assigning compromisso_id
                    event_id: event.event_id,
                    repete: event.repete,
                    categoria: 'google',
                  }}
                  key={event.event_id || `google-event-${index}`}
                  now={selected}
                />
              ))}
            <Now />
          </div>
        </div>
      </div>
    </section>
  )
}

function GoogleEvent({
  event,
  now,
}: {
  event: GoogleEvent & { compromisso_id: string; categoria: string }
  now: Date | undefined
}) {
  const PIXELS_PER_MINUTE = 112 / 60
  const minHeight = 44

  const eventStart = dayjs(event.comeca, 'YYYY-MM-DD HH:mm')
  const eventEnd = dayjs(event.termina, 'YYYY-MM-DD HH:mm')

  const dayIndex = eventStart.day()

  if (
    eventEnd.isBefore(dayjs(now).startOf('week')) ||
    eventStart.isAfter(dayjs(now).endOf('week'))
  ) {
    return null
  }

  const startMinutes = eventStart.hour() * 60 + eventStart.minute()
  const endMinutes = eventEnd.hour() * 60 + eventEnd.minute()

  const top = startMinutes * PIXELS_PER_MINUTE
  const height = Math.max(
    (endMinutes - startMinutes) * PIXELS_PER_MINUTE,
    minHeight,
  )
  console.log(height)
  const baseLeft = 70

  return (
    <GoogleEditEventDialogTrigger event={event}>
      <div
        className={`
          absolute flex flex-col py-3 px-4 gap-2 w-32 2xl:w-36 3xl:w-40 
          ${event.checked ? 'bg-yellow-950' : 'bg-yellow-900'}
          hover:bg-yellow-800 text-white rounded-lg 
          border-l-4 border-yellow-500 cursor-pointer transition-colors
          shadow-md overflow-hidden pointer-events-auto
        `}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          left: `calc(${baseLeft}px + ${dayIndex * 144}px)`,
        }}
      >
        <span
          className={`${height < 80 ? 'text-[10px]' : 'text-xs'} font-medium text-yellow-400`}
        >
          {`${eventStart.format('HH:mm')} - ${eventEnd.format('HH:mm')}`}
        </span>
        {height >= 80 && (
          <p
            className={`${height < 80 ? 'text-[10px]' : 'text-xs'} font-normal line-clamp-2 ${event.checked ? 'line-through opacity-75' : ''}`}
          >
            {event.titulo}
          </p>
        )}
        {/* {event.descricao && (
          <p className="text-xs text-yellow-200 line-clamp-2">
            {event.descricao}
          </p>
        )} */}
      </div>
    </GoogleEditEventDialogTrigger>
  )
}

function Now() {
  const now = new Date()

  const PIXELS_PER_MINUTE = 112 / 60

  const startMinutes = now.getHours() * 60 + now.getMinutes()

  const top = startMinutes * PIXELS_PER_MINUTE
  const left = 64

  return (
    <div
      className="absolute h-1 bg-cyan-400"
      style={{ top: `${top}px`, left, right: 0 }}
    >
      {now.getMinutes() > 10 && now.getMinutes() < 50 && (
        <span className="absolute -left-4 -translate-x-[100%] -translate-y-[40%] text-sm text-cyan-400">
          {now.getHours().toFixed(0).padStart(2, '0')}:
          {now.getMinutes().toFixed(0).padStart(2, '0')}
        </span>
      )}
    </div>
  )
}
