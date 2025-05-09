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
import { CalendarEvent, GoogleEvent, RitualEvent } from './calendar-event'

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

  const { data: morningRitual } = useQuery({
    queryKey: ['rituais-blocos-matinais'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=1')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const { data: nightRitual } = useQuery({
    queryKey: ['rituais-blocos-noturnos'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=2')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const scrollableRef = useRef<HTMLDivElement | null>(null)

  function scrollToNow() {
    if (scrollableRef.current) {
      console.log('scrollToNow() chamado')
      const now = new Date()
      console.log('Agora:', now)
      const PIXELS_PER_MINUTE = 112 / 60
      const startMinutes = now.getHours() * 60 + now.getMinutes()
      console.log('Minutos desde meia-noite:', startMinutes)
      const top = startMinutes * PIXELS_PER_MINUTE
      console.log('Top calculado:', top)
      const viewportHeight = scrollableRef.current.clientHeight
      console.log('Altura da viewport:', viewportHeight)
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
      <div className="hidden lg:flex flex-col w-72 min-w-72 border-r overflow-y-auto scrollbar-minimal">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="w-full"
          locale={ptBR}
        />
      </div>
      <div className="flew h-[calc(100vh-98px)] flex-1 pb-4 overflow-hidden">
        <div
          ref={scrollableRef}
          className="flex flex-col xl:w-full h-full flex-1 overflow-auto scrollbar-minimal bg-black relative"
        >
          <div className="flex w-full min-w-fit pl-16 bg-zinc-900 border-b sticky top-0 left-0 z-50">
            {WEEKDAYS.map((day, index) => (
              <div
                key={index}
                className="flex flex-col min-w-40 w-40 xl:w-full h-14 p-1 items-center justify-end"
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
                  {dayjs(selected)
                    .startOf('week')
                    .add(index, 'day')
                    .format('DD')}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 min-h-0 h-full max-h-[calc(100vh-100px)] relative">
            <div className="flex flex-col bg-zinc-900 border-r">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-16 min-w-16 min-h-28 items-end justify-end p-2 bg-zinc-900 border-r"
                >
                  <span className="text-sm text-zinc-500">
                    {(index < 23 ? index + 1 : 0).toFixed(0).padStart(2, '0')}
                    :00
                  </span>
                </div>
              ))}
            </div>
            <NowIndicator />
            <div className="flex w-full flex-1 h-fit">
              {Array.from({ length: 7 }).map((_, i) => {
                const columnDate = dayjs(startWeek).add(i, 'day')

                const eventsNormal = compromissos
                  ? compromissos.compromissos.filter((event) =>
                      dayjs(event.comeca).isSame(columnDate, 'day'),
                    )
                  : []

                const googleCalendarEvents =
                  googleEvents && googleEvents.events
                    ? googleEvents.events
                        .filter((event) =>
                          dayjs(event.comeca).isSame(columnDate, 'day'),
                        )
                        .map((e) => ({
                          ...e,
                          compromisso_id: e.event_id,
                          repete: e.repete,
                          categoria: 'google' as const,
                        }))
                    : []

                return (
                  <Column
                    key={i}
                    date={columnDate}
                    events={eventsNormal}
                    googleEvents={googleCalendarEvents}
                    morningRitual={morningRitual}
                    nightRitual={nightRitual}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Column({
  date,
  events,
  googleEvents,
  morningRitual,
  nightRitual,
}: {
  date: dayjs.Dayjs
  events: Compromisso[]
  googleEvents: Array<
    GoogleEvent & { compromisso_id: string; categoria: string }
  >
  morningRitual?: RitualResponseItem
  nightRitual?: RitualResponseItem
}) {
  return (
    <div className="xl:w-full min-w-40 w-40 h-full flex-1 border-r relative">
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="flex min-w-40 w-40 h-28 border-b"></div>
      ))}
      {events.map((event) => (
        <CalendarEvent
          event={event}
          key={event.compromisso_id}
          now={date.toDate()}
          mode="weekly"
        />
      ))}
      {googleEvents.map((event) => (
        <GoogleEvent
          event={event}
          key={event.compromisso_id}
          now={date.toDate()}
          mode="weekly"
        />
      ))}
      {morningRitual && (
        <RitualEvent
          mode="weekly"
          now={date.toDate()}
          timeStart={morningRitual.horario_inicial}
          timeEnd={morningRitual.horario_final}
          title="Ritual Matinal"
          type="matinal"
        />
      )}
      {nightRitual && (
        <RitualEvent
          mode="weekly"
          now={date.toDate()}
          timeStart={nightRitual.horario_inicial}
          timeEnd={nightRitual.horario_final}
          title="Ritual Noturno"
          type="noturno"
        />
      )}
    </div>
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
