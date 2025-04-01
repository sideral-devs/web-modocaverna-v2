'use client'
import { DreamboardMaker } from '@/components/dreamboard/dreamboard-maker'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DreamboardCard({
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
  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })
  const messagesQuadroSonhos = [
    'Adicione imagens que te inspirem e representem o que você quer conquistar, como momentos com a família.',
    'Preencha com fotos que refletem suas aspirações, incluindo momentos importantes com a família.',
    'Visualize o que você deseja alcançar com imagens que te inspirem, como a sua família.',
    'Adicione fotos que representam o que você quer conquistar, como os laços familiares.',
    'Adicione imagens que simbolizem o que te inspira, como momentos com quem você ama.',
    'Adicione fotos que representem suas conquistas e o apoio da família.',
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

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] p-0 gap-4 relative overflow-hidden">
      {hideLabel || (
        <div className="flex flex-col absolute inset-0 p-4 z-10">
          <CardHeader>
            <div className="flex w-fit px-3 py-2 border border-white rounded-full">
              <span className="text-[10px] text-white font-semibold">
                LEI DA ATRAÇÃO
              </span>
            </div>
          </CardHeader>
          <Link href={'/sonhos-e-metas'} className="mt-auto ml-auto">
            <Button size="sm">Ver Sonhos & Metas</Button>
          </Link>
        </div>
      )}

      {currentGoal ? (
        currentGoal.fotos.length > 0 ? (
          <DreamboardMaker
            editable={false}
            year={dayjs().year()}
            startingContent={currentGoal.fotos.map((foto) => ({
              id: foto.id,
              height: Number(foto.height),
              width: Number(foto.width),
              x: Number(foto.x),
              y: Number(foto.y),
              rotation: foto.rotation,
              src: `${env.NEXT_PUBLIC_PROD_URL}${foto.foto}`,
            }))}
          />
        ) : (
          <div className="flex flex-row items-center justify-center flex-1 gap-4 w-full">
            <Image
              src="/images/empty-states/empty_dream_board.png"
              alt="Nenhum objetivo encontrado"
              width={100}
              height={110}
              className="opacity-50"
            />
            <div className="flex flex-col gap-4 w-[40dvh]">
              <p className="text-center text-[13px] text-zinc-500">
                {dreamboardMessage}
              </p>
            </div>
          </div>
        )
      ) : (
        <Skeleton className="flex flex-col flex-1 items-center gap-8 w-full" />
      )}
    </Card>
  )
}
