'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { SmileyAngry, Plus } from '@phosphor-icons/react'
import { WeightProgressIndicator } from '@/components/exercicios/exercicios-weight-progress-indicator'
import { ExerciseCard } from '@/components/exercicios/exercicios-card'
import { useState } from 'react'
import { Reorder, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Header, HeaderClose } from '@/components/header'
import { WEEK_DAYS } from '@/lib/constants'

interface Exercise {
  id: number
  name: string
  series: number
  repetitions: number
  currentWeight: number
  imageUrl: string
}

const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Supino reto',
    series: 12,
    repetitions: 5,
    currentWeight: 65,
    imageUrl: '/exercise-supino.png',
  },
  {
    id: 2,
    name: 'Supino invertido',
    series: 12,
    repetitions: 3,
    currentWeight: 10,
    imageUrl: '/exercise-supino.png',
  },
]

export default function Page() {
  const [selectedDay, setSelectedDay] = useState('Qui')
  const [exercises, setExercises] = useState(INITIAL_EXERCISES)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 0)
  })

  const currentDate = new Date()
  const formattedDate = format(currentDate, "dd 'de' MMMM, yyyy", {
    locale: ptBR,
  })

  return (
    <>
      <motion.div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <Header className="fixed bg-black/50 backdrop-blur-sm z-50 py-4">
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-white rounded-full">
            <span className="uppercase text-[10px] text-white font-semibold">
              Lei da Atração
            </span>
          </div>
          <HeaderClose />
        </Header>
      </motion.div>
      <div className="min-h-screen pt-32 pb-[400px] bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-zinc-500 text-sm">
              Última atualização · {formattedDate}
            </p>
            <h1 className="text-2xl font-semibold mt-2">Registro de Shape</h1>
          </div>

          <div className="flex justify-between mb-16 gap-4">
            <div className="relative w-1/2 border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
              <Image
                src="/placeholder-body.jpg"
                alt="Foto do corpo"
                width={600}
                height={600}
                className="w-full h-[456px] object-cover"
              />

              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />

              <div className="absolute bottom-4 right-4">
                <span className="text-red-500 flex items-center gap-2 text-base">
                  <SmileyAngry weight="bold" size={24} /> Não satisfeito
                </span>
              </div>

              <Button
                size="sm"
                className="absolute bottom-2 left-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Atualizar fotos
              </Button>
            </div>

            <div className="bg-zinc-800  w-1/2 rounded-lg p-6">
              <div className="space-y-8 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-red-500 font-medium mb-4">
                    Circunferência superior
                  </h2>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (D)</p>
                      <p className="text-sm">2 cm</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (E)</p>
                      <p className="text-sm">5 cm</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peitoral</p>
                      <p className="text-sm">20 cm</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Cintura</p>
                      <p className="text-sm">20 cm</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-red-500 w-full">
                      Circunferência inferior
                    </h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex mb-6 items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Glúteos</p>
                        <p className="text-sm">2 cm</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (D)</p>
                        <p className="text-sm">5 cm</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (E)</p>
                        <p className="text-sm">20 cm</p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadril</p>
                        <p className="text-sm">40 cm</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (D)</p>
                        <p className="text-sm">20 cm</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (E)</p>
                        <p className="text-sm">20 cm</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-red-500 w-full">Dados</h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Idade</p>
                      <p className="text-sm">27 anos</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Altura</p>
                      <p className="text-sm">1,72 cm</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peso</p>
                      <p className="text-sm">100 kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <WeightProgressIndicator currentWeight={124} targetWeight={76} />

          {/* Treinos */}
          <div className="mt-16 w-full">
            <h2 className="text-2xl font-medium mb-8">Organize seus treinos</h2>

            <div className="flex gap-4 w-full justify-between mb-8">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day.short}
                  onClick={() => setSelectedDay(day.short)}
                  className={`px-6 py-4 w-full rounded-lg text-base font-medium transition-colors
                  ${
                    selectedDay === day.short
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }
                `}
                >
                  {day.short}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base text-zinc-300">Treino de peito</h3>•
                  <span className="text-base text-zinc-400">12h30 - 14h10</span>
                </div>

                <Button
                  variant="secondary"
                  className="text-zinc-500 hover:text-zinc-300 pl-4 py-0 pr-0 gap-2"
                >
                  Novo exercício
                  <div className="h-full border-l flex items-center justify-center px-4 border-zinc-300">
                    <Plus className="w-5 h-5 text-red-500" weight="bold" />
                  </div>
                </Button>
              </div>

              <Reorder.Group
                axis="y"
                values={exercises}
                onReorder={setExercises}
                className="space-y-6"
              >
                {exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    value={exercise}
                    name={exercise.name}
                    series={exercise.series}
                    repetitions={exercise.repetitions}
                    currentWeight={exercise.currentWeight}
                    imageUrl={exercise.imageUrl}
                  />
                ))}
              </Reorder.Group>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
