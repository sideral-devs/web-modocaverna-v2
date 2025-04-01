'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Bookmark, Dot } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function EventsCard() {
  const today = dayjs().format('YYYY-MM-DD')
  const [randomText, setRandomText] = useState<string>('')

  const { data } = useQuery({
    queryKey: ['events', today],
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

  const nextEvent = useMemo(
    () => (data ? getNextEvent(data.compromissos) : null),
    [data],
  )

  const semCompromissos = [
    'Dia livre! Avance no Modo Caverna. 🔥',
    'Nada agendado. Que tal criar um compromisso?',
    'Sem compromissos. Aproveite para aprender nos cursos! 💡',
    'Seu dia está livre. Planeje algo produtivo!',
    'Sem compromissos. Explore Networking & Conhecimento! 🚀',
    'Agenda Livre. Aprenda algo novo na seção de cursos!',
    'Sem Compromissos. Busque insights na Comunidade Alcatéia.',
    'Dia Livre? Invista em aprendizado e conexões!',
  ]

  useEffect(() => {
    if (randomText === '') {
      setRandomText(
        semCompromissos[Math.floor(Math.random() * semCompromissos.length)],
      )
    }
  }, [])

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
      {data && data.compromissos.length > 0 ? (
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
                  <span className="text-sm">{nextEvent.titulo}</span>
                </div>
              </div>
            </div>
          )}

          <div className="hidden md:flex flex-col gap-8 overflow-y-auto scrollbar-minimal">
            {data.compromissos.slice(1).map((event, i) => (
              <div
                className="flex items-center gap-4"
                key={event.compromisso_id + '-' + i}
              >
                <span className="text-sm text-zinc-300 w-11">
                  {dayjs(event.comeca, 'YYYY-MM-DD HH:mm').format('H[h]mm')}
                </span>
                <span className="flex items-center gap-2 text-sm text-zinc-300">
                  <div className="w-3 h-3 border-white border-[1px] rounded" />
                  {event.titulo}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs  text-slate-400 ">
                <span className="w-11">- - - -</span>
                Sem compromissos para o restante do dia
              </span>
            </div>
          </div>
        </>
      ) : (
        <span className="flex items-center gap-2 text-xs text-gray-400">
          {/* <span className="w-11">- - - -</span> */}
          {randomText}
        </span>
      )}
      <Link className="mt-auto ml-auto" href="/agenda">
        <Button size="sm">Ver agenda</Button>
      </Link>
    </Card>
  )
}

function getNextEvent(events: Compromisso[]) {
  const now = dayjs()

  return (
    events
      .filter((event) => dayjs(event.comeca).isAfter(now))
      .sort((a, b) => dayjs(a.comeca).diff(dayjs(b.comeca)))[0] || null
  )
}
