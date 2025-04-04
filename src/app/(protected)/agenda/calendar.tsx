'use client'
import { Calendar } from '@/components/ui/calendar'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { EditEventDialogTrigger } from './edit-event'
import { GoogleEditEventDialogTrigger } from './google-edit-event'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

export function EventCalendar() {
  const session = useSession()
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  const startWeek = dayjs(selected).startOf('week').format('YYYY-MM-DD')
  const endWeek = dayjs(selected).endOf('week').format('YYYY-MM-DD')

  const { data: compromissos } = useQuery({
    queryKey: ['events', `${startWeek}-${endWeek}`],
    queryFn: async () => {
      const response = await api.get('/compromissos/find', {
        params: {
          date_field: 'comeca',
          date_start: startWeek,
          date_end: endWeek,
        },
      })
      return response.data as EventsDTO
    },
  })

  const { data: googleEvents } = useQuery<GoogleEventsResponse>({
    queryKey: ['events-google', `${startWeek}-${endWeek}`],
    queryFn: async () => {
      const response = await api.get('/eventos-google/show', {
        params: {
          date_field: 'comeca',
          date_start: startWeek,
          date_end: endWeek,
        },
      })
      return response.data
    },
    enabled: !!session,
  })
  const scrollableRef = useRef<HTMLDivElement | null>(null)
  function scrollToNow() {
    if (scrollableRef.current) {
      const now = new Date()
      const PIXELS_PER_MINUTE = 112 / 60
      const startMinutes = now.getHours() * 60 + now.getMinutes()
      const top = startMinutes * PIXELS_PER_MINUTE
      const viewportHeight = scrollableRef.current.clientHeight
      scrollableRef.current.scrollTo({
        top: top - viewportHeight / 2,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToNow()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="flex w-full max-w-[1512px] h-[calc(100vh-98px)]">
      {/* Sidebar Calendar */}
      <div className="flex flex-col max-w-72 w-72 border-r border-zinc-800 overflow-y-auto scrollbar-minimal bg-zinc-950">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="w-full"
          locale={ptBR}
        />
      </div>

      {/* Main Calendar Grid */}
      <div
        ref={scrollableRef}
        className="flex flex-col flex-1 h-full overflow-y-auto scrollbar-minimal bg-zinc-950"
      >
        {/* Weekday Header */}
        <div className="flex w-full min-w-fit pl-16 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-20">
          {WEEKDAYS.map((day, index) => (
            <div
              key={index}
              className="flex flex-col w-full min-w-36 h-14 p-1 items-center justify-end"
            >
              <span className="text-zinc-500 text-xs capitalize">{day}</span>
              <span
                className={cn(
                  'text-white text-sm capitalize p-1 rounded-full',
                  dayjs(selected)
                    .startOf('week')
                    .add(index, 'day')
                    .isSame(dayjs().startOf('day')) && 'bg-primary',
                )}
              >
                {dayjs(selected).startOf('week').add(index, 'day').format('DD')}
              </span>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex-1 min-h-0 relative">
          <div className="flex flex-col h-full max-h-[calc(100vh-100px)]">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="flex w-16 min-w-16 h-28 items-end justify-end p-2 bg-zinc-900 border-r border-zinc-800">
                  <span className="text-sm text-zinc-500">
                    {(index < 23 ? index + 1 : 0).toFixed(0).padStart(2, '0')}
                    :00
                  </span>
                </div>
                <div className="flex w-full h-28 border-b border-zinc-800">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-36 w-full h-full border-r border-zinc-800"
                    ></div>
                  ))}
                </div>
              </div>
            ))}

            {/* Events */}
            <div className="absolute inset-0 pointer-events-none">
              {compromissos?.compromissos.map((event) => (
                <CompromissoEvent
                  event={event}
                  key={event.compromisso_id}
                  now={selected}
                />
              ))}
              {googleEvents &&
                (googleEvents?.events ?? []).map((event) => (
                  <GoogleEvent
                    event={{
                      ...event,
                      compromisso_id: event.event_id,
                      repete: event.repete,
                      categoria: 'google',
                    }}
                    key={event.event_id}
                    now={selected}
                  />
                ))}
              <NowIndicator />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompromissoEvent({
  event,
  now,
}: {
  event: Compromisso
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

  const baseLeft = 70

  return (
    <EditEventDialogTrigger event={event}>
      <div
        className={`
          absolute flex flex-col py-2 px-4 gap-2 w-32 2xl:w-36 3xl:w-40 
          bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg 
          border-l-4 ${
            event.categoria === 'Compromisso'
              ? ' border-blue-500'
              : event.categoria === 'Refeição'
                ? ' border-yellow-500'
                : event.categoria === 'Treino'
                  ? ' border-red-500'
                  : event.categoria === 'Pessoal'
                    ? ' border-green-500'
                    : ' border-zinc-500'
          } cursor-pointer transition-colors
          shadow-md overflow-hidden pointer-events-auto
        `}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          left: `calc(${baseLeft}px + ${dayIndex * 144}px)`,
        }}
      >
        <span
          className={`${height < 80 ? 'text-[10px]' : 'text-xs'} font-medium  ${
            event.categoria === 'Compromisso'
              ? ' text-blue-400'
              : event.categoria === 'Refeição'
                ? ' text-yellow-400'
                : event.categoria === 'Treino'
                  ? ' text-red-400'
                  : event.categoria === 'Pessoal'
                    ? ' text-green-400'
                    : ' text-zinc-400'
          }`}
        >
          {`${eventStart.format('HH:mm')} - ${eventEnd.format('HH:mm')}`}
        </span>
        <p
          className={`${height < 80 ? 'text-[10px]' : 'text-xs'} font-medium line-clamp-2`}
        >
          {event.titulo}
        </p>

        {/* {event.descricao && (
          <p className="text-xs text-zinc-400 line-clamp-2">
            {event.descricao}
          </p>
        )} */}
      </div>
    </EditEventDialogTrigger>
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

  const baseLeft = 80

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

function NowIndicator() {
  const now = new Date()
  const PIXELS_PER_MINUTE = 112 / 60
  const startMinutes = now.getHours() * 60 + now.getMinutes()
  const top = startMinutes * PIXELS_PER_MINUTE
  const left = 64

  return (
    <div
      className="absolute h-1 bg-gradient-to-r from-cyan-400/80 from-10% via-cyan-400 via-50% to-cyan-400/0 to-90% z-10"
      style={{ top: `${top}px`, left, width: 144 * 7 }}
    >
      {now.getMinutes() > 10 && now.getMinutes() < 50 && (
        <span className="absolute -left-4 -translate-x-[100%] -translate-y-1/2 text-sm text-cyan-400 bg-zinc-900 px-1 rounded">
          {now.getHours().toString().padStart(2, '0')}:
          {now.getMinutes().toString().padStart(2, '0')}
        </span>
      )}
    </div>
  )
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
