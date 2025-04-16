'use client'
import { Calendar } from '@/components/ui/calendar'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { CalendarEvent, GoogleEvent, RitualEvent } from '../calendar-event'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export function TodayEventCalendar() {
  const session = useSession()
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  const today = dayjs(selected).startOf('day').format('YYYY-MM-DD')
  const scrollableRef = useRef<HTMLDivElement | null>(null)
  const startWeek = dayjs(selected).startOf('week').format('YYYY-MM-DD')
  const endWeek = dayjs(selected).endOf('week').format('YYYY-MM-DD')

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
          <div className="flex flex-1 h-full max-h-[calc(100vh-100px)] relative">
            <div className="flex flex-col">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-16 min-w-16 h-28 min-h-28 items-end justify-end p-2 bg-zinc-900 border-r"
                >
                  <span className="text-sm text-zinc-500">
                    {(index < 23 ? index + 1 : 0).toFixed(0).padStart(2, '0')}
                    :00
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full relative">
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="flex w-full h-28 border-b">
                  <div className="min-w-36 w-full h-full border-r" />
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
              {googleEvents &&
                googleEvents.events &&
                googleEvents.events
                  .filter(
                    (event) =>
                      dayjs(today).isBetween(
                        dayjs(event.comeca),
                        dayjs(event.termina),
                        null,
                        '[]',
                      ) || dayjs(event.comeca).isSame(today, 'day'),
                  )
                  .map((e) => ({
                    ...e,
                    compromisso_id: e.event_id,
                    repete: e.repete,
                    categoria: 'google' as const,
                  }))
                  .map((event) => (
                    <GoogleEvent
                      event={event}
                      key={event.compromisso_id}
                      now={selected}
                      mode="daily"
                    />
                  ))}
              {morningRitual && (
                <RitualEvent
                  mode="weekly"
                  now={selected}
                  timeStart={morningRitual.horario_inicial}
                  timeEnd={morningRitual.horario_final}
                  title="Ritual Matinal"
                  type="matinal"
                />
              )}
              {nightRitual && (
                <RitualEvent
                  mode="weekly"
                  now={selected}
                  timeStart={nightRitual.horario_inicial}
                  timeEnd={nightRitual.horario_final}
                  title="Ritual Noturno"
                  type="noturno"
                />
              )}
            </div>
            <Now />
          </div>
        </div>
      </div>
    </section>
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
