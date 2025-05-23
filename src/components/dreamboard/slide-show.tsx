'use client'

import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

interface Goal {
  metas_id: number
  user_id: string
  ano: string
  fotos: {
    foto: string
    id: string
  }[]
}

export function SlideShow() {
  const router = useRouter()
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })

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
    return <div className="text-center py-4">Carregando metas...</div>
  }

  const hasPhotos = currentGoal?.fotos && currentGoal.fotos.length > 0

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden relative"
    >
      {hasPhotos ? (
        <>
          <div className="absolute top-0 left-0 right-0 flex justify-between gap-1 p-3 z-50">
            {currentGoal?.fotos?.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300 bg-white',
                  index <= currentIndex ? 'opacity-100' : 'opacity-40',
                )}
                aria-label={`Step ${index + 1} of ${currentGoal?.fotos?.length}`}
              />
            ))}
          </div>
          <div className="relative h-48 overflow-hidden sm:h-64">
            <AnimatePresence initial={false} custom={currentIndex}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-40" />
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 gap-4 text-center h-48 sm:h-64">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Nenhuma imagem adicionada ainda
            </h4>
            <p className="text-xs text-muted-foreground">
              Adicione imagens para criar seu Dreamboard de Lei da Atração
            </p>
          </div>
          <Button size="sm" onClick={() => router.push('/lei-da-atracao')}>
            Adicionar imagens
          </Button>
        </div>
      )}
    </motion.div>
  )
}
