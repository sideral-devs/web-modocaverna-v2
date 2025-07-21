'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { api } from '@/lib/api'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function GoalCard({
  hideLabel = false,
}: {
  hideLabel?: boolean
}) {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [dreamboardMessage, setDreamboardMessage] = useState('')
  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }
  const { data: goals, isFetched } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })
  const messagesQuadroSonhos = [
    'Comece agora a traçar seu novo caminho. Defina suas primeiras metas e objetivos!',
  ]

  useEffect(() => {
    setDreamboardMessage(getMessageForTime(messagesQuadroSonhos))
    setInterval(() => {
      setDreamboardMessage(getMessageForTime(messagesQuadroSonhos))
    }, 1200000)
    if (goals) {
      setCurrentGoal(
        goals.find((goal) => goal.ano === dayjs().format('YYYY')) || null,
      )
    }
  }, [goals])

  if (!isFetched) {
    return (
      <Skeleton className="flex flex-col w-full h-full min-h-[300px] relative overflow-hidden" />
    )
  }

  return (
    <Card
      className="flex flex-col w-full h-full min-h-[300px] p-0 gap-4 relative overflow-hidden"
      data-tutorial-id="metas"
    >
      {hideLabel || (
        <div className="flex flex-col absolute inset-0 p-4 z-10">
          <CardHeader>
            <div className="flex w-fit px-3 py-2 border border-white rounded-full">
              <span className="text-[10px] text-white font-semibold">
                METAS
              </span>
            </div>
          </CardHeader>
          <Link href={'/metas'} className="mt-auto ml-auto">
            <Button size="sm">Acessar</Button>
          </Link>
        </div>
      )}

      {currentGoal ? (
        <div className="flex flex-col flex-1 items-center justify-center md:pt-0">
          <div className=" flex flex-col max-w-80 items-start">
            <Image
              height={40}
              width={40}
              alt="Quote"
              src={'/icons/quote.svg'}
              className="relative  right-2"
            />
            <p className="text-base w-80 text-center mt-2 line-clamp-5 overflow-hidden">
              {currentGoal.objetivos.principal}
            </p>
            <Image
              className=" translate-x-72 bottom-5"
              height={40}
              width={40}
              alt="Quote"
              src={'/icons/quote-revers.svg'}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col  flex-1 items-center justify-center md:justify-center md:pt-0">
          <div className=" flex flex-col max-w-80 items-start">
            <Image
              height={40}
              width={40}
              alt="Quote"
              src={'/icons/quote.svg'}
              className="relative  right-2"
            />
            <p className="text-base w-80 text-center mt-2 line-clamp-5 overflow-hidden">
              {dreamboardMessage}
            </p>
            <Image
              className=" translate-x-72 bottom-5"
              height={40}
              width={40}
              alt="Quote"
              src={'/icons/quote-revers.svg'}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
