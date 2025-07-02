'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { api } from '@/lib/api'
import { getWorkouts } from '@/lib/api/exercises'
import { getMeals } from '@/lib/api/meals'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Bookmark,
  Calendar,
  Dot,
  Dumbbell,
  Sparkles,
  User,
  UtensilsCrossed,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function EventsCard() {
  const today = dayjs().format('YYYY-MM-DD')
  const [randomText, setRandomText] = useState<string>('')
  const startOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endOfDay = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')

  const { data } = useQuery({
    queryKey: ['events', today],
    queryFn: async () => {
      const response = await api.get('/compromissos/find', {
        params: {
          date_field: 'comeca',
          date_start: startOfDay,
          date_end: endOfDay,
        },
      })
      return response.data as EventsDTO
    },
  })

  const { data: googleEvents } = useQuery<GoogleEventsResponse>({
    queryKey: ['events-google', `${today}-${today}`],
    queryFn: async () => {
      const response = await api.get('/eventos-google/show', {
        params: {
          date_field: 'comeca',
          date_start: startOfDay,
          date_end: endOfDay,
        },
      })

      return response.data
    },
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

  const { data: workouts } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  const { data: meals } = useQuery({
    queryKey: ['meals'],
    queryFn: getMeals,
  })

  const allEvents = useMemo(() => {
    const local = data?.compromissos || []
    const google = googleEvents?.events || []
    const rituals = []

    const eventWorkouts =
      workouts
        ?.filter((item) => Number(item.indice) === dayjs().day())
        .map((item) => {
          const start = dayjs(`${today} ${item.horario}`).format(
            'YYYY-MM-DD HH:mm',
          )
          const end = dayjs(start).add(1, 'hours').format('YYYY-MM-DD HH:mm')

          return {
            comeca: start,
            termina: end,
            titulo: item.titulo,
            categoria: 'Treino',
            compromisso_id: `workout-${item.ficha_id}`,
          }
        }) || []

    const eventMeals =
      meals
        ?.filter((item) => Number(item.dia_semana) === dayjs().day())
        .map((item) => {
          const start = dayjs(`${today} ${item.hora_refeicao}`).format(
            'YYYY-MM-DD HH:mm',
          )
          const end = dayjs(start).add(1, 'hours').format('YYYY-MM-DD HH:mm')

          return {
            comeca: start,
            termina: end,
            titulo: item.nome_refeicao,
            categoria: 'Refeição',
            compromisso_id: `meal-${item.horario_id}`,
          }
        }) || []

    if (morningRitual) {
      rituals.push({
        comeca: dayjs(`${today} ${morningRitual.horario_inicial}`).format(
          'YYYY-MM-DD HH:mm',
        ),
        termina: dayjs(`${today} ${morningRitual.horario_final}`).format(
          'YYYY-MM-DD HH:mm',
        ),
        titulo: 'Ritual Matinal',
        categoria: 'Ritual',
        compromisso_id: 'morning-ritual',
      })
    }

    if (nightRitual) {
      rituals.push({
        comeca: dayjs(`${today} ${nightRitual.horario_inicial}`).format(
          'YYYY-MM-DD HH:mm',
        ),
        termina: dayjs(`${today} ${nightRitual.horario_final}`).format(
          'YYYY-MM-DD HH:mm',
        ),
        titulo: 'Ritual Noturno',
        categoria: 'Ritual',
        compromisso_id: 'night-ritual',
      })
    }

    const combined = [
      ...local,
      ...google,
      ...rituals,
      ...eventMeals,
      ...eventWorkouts,
    ].sort((a, b) => dayjs(a.comeca).diff(dayjs(b.comeca)))
    return combined
  }, [data, googleEvents, morningRitual, nightRitual, workouts])

  const nextEvent = useMemo(
    () => (allEvents ? getNextEvent(allEvents) : null),
    [allEvents],
  )

  const semCompromissos = [
    'Dia livre! Avance no Modo Caverna. 🔥',
    'Nada agendado. Que tal criar um compromisso?',
    'Sem compromissos. Aproveite para aprender nos cursos! 💡',
    'Seu dia está livre. Planeje algo produtivo!',
    'Sem compromissos. Explore Networking & Conhecimento! 🚀',
    'Agenda Livre. Aprenda algo novo na seção de cursos!',
    'Sem Compromissos. Busque insights na Comunidade Alcateia.',
    'Dia Livre? Invista em aprendizado e conexões!',
  ]

  useEffect(() => {
    if (randomText === '') {
      setRandomText(
        semCompromissos[Math.floor(Math.random() * semCompromissos.length)],
      )
    }
  }, [])

  console.log(allEvents)

  return (
    <Card className="flex flex-col md:row-span-2 h-fit md:h-full min-h-[300px] bg-gradient-to-b from-[#09373E] to-[#1A1A1A] to-[65%] p-4 gap-5">
      <CardHeader className="justify-between">
        <div className="flex items-center px-3 py-2 gap-[6px] border border-cyan-400 rounded-full">
          <Bookmark className="text-cyan-400" size={16} fill="#22d3ee" />
          <span className="text-[10px] text-cyan-400 pt-[1px] font-semibold">
            AGENDA DO DIA
          </span>
        </div>
      </CardHeader>

      {allEvents && allEvents.length > 0 ? (
        <>
          {nextEvent && (
            <div className="flex flex-col w-full gap-5 pb-6 md:border-b border-b-cyan-700">
              <div className="flex items-center gap-3">
                <Dot className="text-cyan-400 fill-cyan-400" />
                <h2 className="text-lg xl:text-2xl font-semibold">
                  Próximo Compromisso
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-cyan-400">
                  {dayjs(nextEvent.comeca, 'YYYY-MM-DD HH:mm').format('H[h]mm')}
                </span>
                <div className="flex w-full bg-gradient-to-r from-[#0A414A] to-[#15151a] p-6 border-l border-l-cyan-400 rounded-lg">
                  <span className="text-sm">
                    {nextEvent.titulo || nextEvent.summary}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="hidden md:flex flex-col gap-8 overflow-y-auto scrollbar-minimal">
            {allEvents
              .filter((event) => dayjs(event.comeca).isAfter(dayjs()))
              .slice(nextEvent ? 1 : 0)
              .map((event, i) => {
                const eventTime = dayjs(event.comeca, 'YYYY-MM-DD HH:mm')

                return (
                  <div
                    className="flex items-center gap-4"
                    key={event.compromisso_id + '-' + i}
                  >
                    <span className="text-sm text-zinc-300 w-11">
                      {eventTime.format('H[h]mm')}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-zinc-300">
                      {event.categoria === 'Compromisso' && (
                        <Bookmark className="text-blue-500" size={16} />
                      )}
                      {event.categoria === 'Refeição' && (
                        <UtensilsCrossed
                          className="text-yellow-500"
                          size={16}
                        />
                      )}
                      {event.categoria === 'Treino' && (
                        <Dumbbell className="text-red-500" size={16} />
                      )}
                      {event.categoria === 'Pessoal' && (
                        <User className="text-green-500" size={16} />
                      )}
                      {event.categoria === 'Ritual' && (
                        <Sparkles className="text-yellow-400" size={16} />
                      )}
                      {(event.titulo?.length ?? 0) > 0 && !event.categoria && (
                        <Calendar className="text-orange-400" size={16} />
                      )}
                      {event.titulo}
                    </span>
                  </div>
                )
              })}
          </div>

          {allEvents.filter((event) => dayjs(event.comeca).isAfter(dayjs()))
            .length <= (nextEvent ? 1 : 0) && (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-11">- - - -</span>
                Sem compromissos para o restante do dia
              </span>
            </div>
          )}
        </>
      ) : (
        <span className="flex items-center gap-2 text-xs text-gray-400">
          {randomText}
        </span>
      )}

      <Link className="mt-auto ml-auto" href="/agenda">
        <Button size="sm">Ver Compromissos</Button>
      </Link>
    </Card>
  )
}

// @ts-expect-error aqui estou usando o events para os dois tipos de eventos
function getNextEvent(events) {
  if (!Array.isArray(events) || events.length === 0) return null

  const now = dayjs()

  const futureEvents = events
    .filter((event) => {
      if (typeof event !== 'object' || event === null) return false
      if (!('comeca' in event) || typeof event.comeca !== 'string') return false
      const eventDate = dayjs(event.comeca)
      return eventDate.isValid() && eventDate.isAfter(now)
    })
    .sort((a, b) => dayjs(a.comeca).diff(dayjs(b.comeca)))

  return futureEvents.length > 0 ? futureEvents[0] : null
}
