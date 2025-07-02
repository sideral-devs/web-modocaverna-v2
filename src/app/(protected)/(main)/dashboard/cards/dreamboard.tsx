'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Goal {
  metas_id: number
  user_id: string
  ano: string
  fotos: {
    foto: string
    id: string
  }[]
}

export default function DreamboardCard({
  hideLabel = false,
}: {
  hideLabel?: boolean
}) {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [dreamboardMessage, setDreamboardMessage] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const hasPhotos = currentGoal?.fotos && currentGoal.fotos.length > 0

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })

  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }

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

  useEffect(() => {
    if (currentGoal && currentGoal?.fotos?.length >= 0) {
      const timer = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % currentGoal?.fotos.length,
        )
      }, 6000)

      return () => clearInterval(timer)
    }
  }, [currentGoal?.fotos.length])

  useEffect(() => {
    if (goals) {
      setCurrentGoal(
        goals.find((goal) => goal.ano === dayjs().format('YYYY')) || null,
      )
    }
  }, [goals])

  if (isLoading) {
    return (
      <Skeleton className="flex flex-col w-full h-full min-h-[300px] p-0 gap-4 relative overflow-hidden" />
    )
  }

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] p-0 gap-4 relative overflow-hidden">
      {hideLabel || (
        <div className="flex flex-col absolute inset-0 p-4 z-10">
          <CardHeader>
            <div className="flex w-fit px-3 py-2 bg-card border border-white rounded-full">
              <span className="text-[10px] text-white font-semibold">
                LEI DA ATRAÇÃO
              </span>
            </div>
          </CardHeader>
          <Link href={'/lei-da-atracao'} className="mt-auto ml-auto">
            <Button size="sm">Manifestar Futuro</Button>
          </Link>
        </div>
      )}

      <motion.div className="overflow-hidden absolute inset-0">
        {hasPhotos ? (
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false} custom={currentIndex}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <Image
                  src={
                    env.NEXT_PUBLIC_PROD_URL +
                    currentGoal?.fotos[currentIndex]?.foto
                  }
                  alt="Imagem de meta"
                  className="rounded-t-xl object-cover"
                  fill
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-row items-center justify-center flex-1 px-6 gap-4 w-full">
            <Image
              src="/images/empty-states/empty_dream_board.png"
              alt="Nenhum objetivo encontrado"
              width={100}
              height={110}
              className="opacity-50"
            />
            <div className="flex flex-col gap-4 w-[372px]">
              <p className="text-center text-[13px] text-zinc-500">
                {dreamboardMessage}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </Card>
  )
}
