'use client'

import { Button } from '@/components/ui/button'
import { SmileyAngry } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { Reorder, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Header, HeaderClose } from '@/components/header'
import { WEEK_DAYS } from '@/lib/constants'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import { useShape } from '@/hooks/queries/use-shape'
import { useRouter } from 'next/navigation'
import type { Exercise } from '@/lib/api/exercises'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'
import { WeightProgressIndicator } from '@/components/exercicios/exercicios-weight-progress-indicator'
import { ExerciseCard } from '@/components/exercicios/exercicios-card'
import { ExerciciosCreateUpdate } from '@/components/exercicios/modals/exercicios-create-update'

export interface ShapeRegistration {
  shape_id: number
  imc: number
  altura: number
  peso: number
  texto_meta: string | null
  classificacao: string
  satisfeito_fisico: number
  membros_superiores: {
    ombro: number | null
    peito: number | null
    bicepsD: number | null
    bicepsE: number | null
  }
  membros_inferiores: {
    gluteos: number | null
    quadril: number | null
    quadricepsD: number | null
    quadricepsE: number | null
    panturrilhaD: number | null
    panturrilhaE: number | null
  }
  fotos: string[] | null
  created_at: string
  updated_at: string
}

export default function Page() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState('Qui')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const { scrollY } = useScroll()

  const {
    workouts,
    isLoading: isLoadingWorkouts,
    reorderExercises,
  } = useWorkouts()
  const {
    shapeRegistrations,
    hasRegistration,
    isLoading: isLoadingShape,
  } = useShape()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 0)
  })

  useEffect(() => {
    if (!isLoadingShape && !hasRegistration) {
      router.push('/exercicios/steps')
    }
  }, [hasRegistration, isLoadingShape, router])

  const currentDate = new Date()
  const formattedDate = format(currentDate, "dd 'de' MMMM, yyyy", {
    locale: ptBR,
  })

  // Group workouts by day
  const workoutsByDay = workouts?.reduce(
    (acc, workout) => {
      if (!acc[workout.day]) {
        acc[workout.day] = []
      }
      acc[workout.day].push(workout)
      return acc
    },
    {} as Record<string, typeof workouts>,
  )

  const currentWorkouts = workoutsByDay?.[selectedDay] || []

  if (isLoadingWorkouts || isLoadingShape) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-6 h-6 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    )
  }

  if (!hasRegistration) {
    return null // Prevent flash of content before redirect
  }

  console.log(shapeRegistrations)
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
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
            <span className="uppercase text-[10px] text-yellow-500 font-semibold">
              Exercícios
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
                <span
                  className={`flex items-center gap-2 text-base ${shapeRegistrations?.[0]?.satisfeito_fisico ? 'text-green-500' : 'text-red-500'}`}
                >
                  <SmileyAngry weight="bold" size={24} />{' '}
                  {shapeRegistrations?.[0]?.satisfeito_fisico
                    ? 'Satisfeito'
                    : 'Não satisfeito'}
                </span>
              </div>

              <Button
                size="sm"
                className="absolute bottom-2 left-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Atualizar fotos
              </Button>
            </div>

            <div className="bg-zinc-800 w-1/2 rounded-lg p-6">
              <div className="space-y-8 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-red-500 font-medium mb-4">
                    Circunferência superior
                  </h2>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (D)</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.membros_superiores.bicepsD ??
                          '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (E)</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.membros_superiores.bicepsE ??
                          '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peitoral</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.membros_superiores.peito ??
                          '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Ombro</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.membros_superiores.ombro ??
                          '-'}{' '}
                        cm
                      </p>
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
                        <p className="text-sm">
                          {shapeRegistrations?.[0]?.membros_inferiores
                            .gluteos ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (D)</p>
                        <p className="text-sm">
                          {shapeRegistrations?.[0]?.membros_inferiores
                            .quadricepsD ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (E)</p>
                        <p className="text-sm">
                          {shapeRegistrations?.[0]?.membros_inferiores
                            .quadricepsE ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadril</p>
                        <p className="text-sm">
                          {shapeRegistrations?.[0]?.membros_inferiores
                            .quadril ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (D)</p>
                        <p className="text-sm">
                          {shapeRegistrations?.[0]?.membros_inferiores
                            .panturrilhaD ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (E)</p>
                        <p className="text-sm">
                          {shapeRegistrations?.[0]?.membros_inferiores
                            .panturrilhaE ?? '-'}{' '}
                          cm
                        </p>
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
                      <p className="text-zinc-400 text-sm">IMC</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.imc
                          ? shapeRegistrations[0].imc.toFixed(1)
                          : '-'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Altura</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.altura
                          ? shapeRegistrations[0].altura * 100
                          : '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peso</p>
                      <p className="text-sm">
                        {shapeRegistrations?.[0]?.peso ?? '-'} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <WeightProgressIndicator
            currentWeight={shapeRegistrations?.[0]?.peso || 0}
            targetWeight={Number(shapeRegistrations?.[0]?.texto_meta) || 0}
          />

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

            <div className="space-y-8">
              {currentWorkouts.map((workout) => (
                <div key={workout.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base text-zinc-300">
                        {workout.type}
                      </h3>
                      •
                      <span className="text-base text-zinc-400">
                        {workout.startTime} - {workout.endTime}
                      </span>
                    </div>
                  </div>

                  {workout.exercises.length > 0 && (
                    <Reorder.Group
                      axis="y"
                      values={workout.exercises}
                      onReorder={(newExercises) =>
                        reorderExercises({
                          workoutId: String(workout.id),
                          exerciseIds: newExercises.map((e) => e.id),
                        })
                      }
                      className="space-y-6"
                    >
                      {workout.exercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          value={exercise}
                          name={exercise.name}
                          series={exercise.series}
                          repetitions={exercise.repetitions}
                          currentWeight={exercise.currentWeight}
                          imageUrl={exercise.imageUrl}
                          onEdit={() => setEditingExercise(exercise)}
                        />
                      ))}
                    </Reorder.Group>
                  )}
                </div>
              ))}

              {currentWorkouts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <p>Nenhum treino cadastrado para este dia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && currentWorkouts.length > 0 && (
        <ExerciciosCreateUpdate
          isOpen={isCreateModalOpen || !!editingExercise}
          onClose={() => {
            setIsCreateModalOpen(false)
            setEditingExercise(null)
          }}
          exercise={editingExercise || undefined}
        />
      )}
    </>
  )
}
