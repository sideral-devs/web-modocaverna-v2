'use client'

import { ExerciseCard } from '@/components/exercicios/exercicios-card'
import { WeightProgressIndicator } from '@/components/exercicios/exercicios-weight-progress-indicator'
import { ExerciciosCreateUpdate } from '@/components/exercicios/modals/exercicios-create-update'
import { Header, HeaderClose } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import { useShape } from '@/hooks/queries/use-shape'
import type { Exercise, Workout } from '@/lib/api/exercises'
import { WEEK_DAYS } from '@/lib/constants'
import {
  ChartLineUp,
  Pencil,
  Plus,
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyXEyes,
  Trash,
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AnimatePresence,
  Reorder,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import { BicepsFlexed } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

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
  const [selectedDay, setSelectedDay] = useState(
    WEEK_DAYS[new Date().getDay()].workoutIndex,
  )
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCreateUpdateModal, setisCreateUpdateModal] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const { scrollY } = useScroll()
  const [localWorkouts, setLocalWorkouts] = useState<Workout[]>([])

  const {
    workouts: initialWorkouts,
    isLoading: isLoadingWorkouts,
    deleteWorkout,
    updateWorkout,
  } = useWorkouts()

  // Add debounce ref for exercises
  const updateTimeoutRef = useRef<NodeJS.Timeout>()

  // Add debounce ref for workouts
  // const updateWorkoutsTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize local workouts state from initial workouts
  useEffect(() => {
    if (initialWorkouts) {
      // Sort workouts by horario within each day
      const sortedWorkouts = [...initialWorkouts].sort((a, b) => {
        // First sort by day (indice)
        if (a.indice !== b.indice) {
          return a.indice - b.indice
        }
        // Then sort by horario within the same day
        return a.horario.localeCompare(b.horario)
      })
      setLocalWorkouts(sortedWorkouts)
    }
  }, [initialWorkouts])

  // Create a debounced update function for workouts
  // const debouncedWorkoutUpdate = useCallback(
  //   async (workouts: Workout[]) => {
  //     if (updateWorkoutsTimeoutRef.current) {
  //       clearTimeout(updateWorkoutsTimeoutRef.current)
  //     }

  //     updateWorkoutsTimeoutRef.current = setTimeout(async () => {
  //       try {
  //         // Update each workout with its new order index while maintaining its day
  //         await Promise.all(
  //           workouts.map((workout, index) =>
  //             updateWorkout({
  //               ficha_id: workout.ficha_id,
  //               titulo: workout.titulo,
  //               indice: selectedDay,
  //               horario: workout.horario,
  //               exercicios: workout.exercicios.map((exercise) => ({
  //                 nome: exercise.nome,
  //                 series: exercise.series.toString(),
  //                 repeticoes: exercise.repeticoes.toString(),
  //                 carga: exercise.carga.toString(),
  //                 indice: exercise.indice,
  //               })),
  //             }),
  //           ),
  //         )
  //         toast.success('Ordem dos treinos atualizada com sucesso')
  //       } catch (error) {
  //         console.error('Error updating workout order:', error)
  //         // Optionally handle error state here
  //       }
  //     }, 500)
  //   },
  //   [updateWorkout, selectedDay],
  // )

  // Create a debounced update function for exercises
  const debouncedUpdate = useCallback(
    (workout: Workout, exercises: Exercise[]) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      updateTimeoutRef.current = setTimeout(() => {
        updateWorkout({
          ficha_id: workout.ficha_id,
          titulo: workout.titulo,
          indice: workout.indice,
          horario: workout.horario,
          exercicios: exercises.map((exercise) => ({
            nome: exercise.nome,
            series: exercise.series.toString(),
            repeticoes: exercise.repeticoes.toString(),
            carga: exercise.carga.toString(),
            indice: exercise.indice,
          })),
        })
          .catch((error: unknown) => {
            console.error('Error updating exercise order:', error)
          })
          .finally(() => {
            toast.success('Treino atualizado com sucesso')
          })
      }, 500) // Wait 500ms after the last reorder before making the API call
    },
    [updateWorkout],
  )

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const {
    shapeRegistrations,
    // hasRegistration,

    isLoading: isLoadingShape,
  } = useShape()

  const firstShapeRegistration = shapeRegistrations?.[0]
  const lastShapeRegistration =
    shapeRegistrations && shapeRegistrations.length > 1
      ? shapeRegistrations[shapeRegistrations.length - 1]
      : shapeRegistrations?.[0]

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 0)
  })

  console.log(
    shapeRegistrations,
    'the first shape registration is: ',
    firstShapeRegistration,
  )

  // Redirect to the first step if no photos are uploaded
  useEffect(() => {
    if (!firstShapeRegistration && !isLoadingShape) {
      // No registration at all
      console.log('redirecting to the first step')
      router.push('/exercicios/steps?step=1')
    }
  }, [firstShapeRegistration, isLoadingShape, router])

  useEffect(() => {
    if (
      lastShapeRegistration?.fotos &&
      lastShapeRegistration.fotos.length > 0
    ) {
      const timer = setInterval(() => {
        setCurrentPhotoIndex(
          (prevIndex) =>
            (prevIndex + 1) % (lastShapeRegistration.fotos?.length || 0),
        )
      }, 6000)

      return () => clearInterval(timer)
    }
  }, [lastShapeRegistration?.fotos])

  // const currentDate = new Date()
  // const formattedDate = format(currentDate, "dd 'de' MMMM, yyyy", {
  //   locale: ptBR,
  // })

  const handleDeleteWorkout = async (workout: Workout) => {
    setWorkoutToDelete(workout)
  }

  const confirmDeleteWorkout = async () => {
    if (!workoutToDelete) return

    try {
      await deleteWorkout(workoutToDelete.ficha_id)
      setWorkoutToDelete(null)
    } catch (error) {
      console.error('Error deleting workout:', error)
    }
  }

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
          <div className="flex justify-between items-center">
            <div className="mb-8">
              <p className="text-zinc-500 text-sm">
                {lastShapeRegistration?.updated_at
                  ? `Última atualização · ${format(
                      new Date(lastShapeRegistration.updated_at),
                      "dd 'de' MMMM',' yyyy",
                      { locale: ptBR },
                    )}.`
                  : 'Não atualizadas'}
              </p>
              <h1 className="text-2xl font-semibold mt-2">Registro de Shape</h1>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/exercicios/evolucao')}
              >
                <ChartLineUp weight="bold" size={20} />
                Ver evolução do shape
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => router.push('/exercicios/steps?step=1')}
              >
                <Pencil weight="fill" size={20} />
                Novo registro
              </Button>
            </div>
          </div>

          <div className="flex justify-between mb-16 gap-4">
            <div className="relative w-1/2 border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
              {lastShapeRegistration?.fotos?.[0] ? (
                <>
                  <div className="absolute top-0 left-0 right-0 flex justify-between gap-1 p-3 z-50">
                    {lastShapeRegistration.fotos.map(
                      (_: string, index: number) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 bg-white ${
                            index <= currentPhotoIndex
                              ? 'opacity-100'
                              : 'opacity-40'
                          }`}
                          aria-label={`Photo ${index + 1} of ${lastShapeRegistration?.fotos?.length}`}
                        />
                      ),
                    )}
                  </div>

                  <div className="relative w-full h-[456px]">
                    <AnimatePresence
                      initial={false}
                      mode="wait"
                      custom={currentPhotoIndex}
                    >
                      <motion.div
                        key={currentPhotoIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_PROD_URL}/${lastShapeRegistration.fotos[currentPhotoIndex]}`}
                          alt="Foto do corpo"
                          width={600}
                          height={600}
                          className="w-full h-[456px] object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />
                </>
              ) : (
                <div className="flex items-center flex-col gap-4 justify-center h-[456px]">
                  <BicepsFlexed size={100} className="text-zinc-500" />
                  <p className="text-zinc-500 text-sm">
                    {' '}
                    Nenhuma foto cadastrada{' '}
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <span
                  className={`flex items-center gap-2 text-base ${
                    lastShapeRegistration?.nivel_satisfacao === 'Satisfeito'
                      ? 'text-green-500'
                      : lastShapeRegistration?.nivel_satisfacao ===
                          'Pouco satisfeito'
                        ? 'text-yellow-500'
                        : lastShapeRegistration?.nivel_satisfacao ===
                            'Não satisfeito'
                          ? 'text-orange-500'
                          : 'text-red-500'
                  }`}
                >
                  {lastShapeRegistration?.nivel_satisfacao === 'Satisfeito' ? (
                    <Smiley weight="bold" size={24} />
                  ) : lastShapeRegistration?.nivel_satisfacao ===
                    'Pouco satisfeito' ? (
                    <SmileyMeh weight="bold" size={24} />
                  ) : lastShapeRegistration?.nivel_satisfacao ===
                    'Não satisfeito' ? (
                    <SmileySad weight="bold" size={24} />
                  ) : (
                    <SmileyXEyes weight="bold" size={24} />
                  )}
                  {lastShapeRegistration?.nivel_satisfacao}
                </span>
              </div>

              {lastShapeRegistration &&
                new Date().getTime() -
                  new Date(lastShapeRegistration.updated_at).getTime() <
                  7 * 24 * 60 * 60 * 1000 && (
                  <Button
                    size="sm"
                    className="absolute bottom-2 left-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                    onClick={() =>
                      router.push('/exercicios/atualizar-medidas?photos=true')
                    }
                  >
                    <Pencil weight="fill" size={20} /> Atualizar
                  </Button>
                )}
            </div>

            <div className="bg-zinc-800 relative  w-1/2 rounded-lg p-6">
              {lastShapeRegistration &&
                new Date().getTime() -
                  new Date(lastShapeRegistration.updated_at).getTime() <
                  7 * 24 * 60 * 60 * 1000 && (
                  <Button
                    size="sm"
                    className="absolute z-10 px-3 py-3 top-2 right-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-900 transition-colors"
                    onClick={() => router.push('/exercicios/atualizar-medidas')}
                  >
                    <Pencil weight="fill" size={20} /> Atualizar
                  </Button>
                )}
              <div className="space-y-8 relative flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-yellow-500 font-medium mb-4">
                    Circunferência superior
                  </h2>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (D)</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores
                          .biceps_direito ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (E)</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores
                          .biceps_esquerdo ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peitoral</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores.peito ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Ombro</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores.ombro ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-yellow-500 w-full">
                      Circunferência inferior
                    </h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex mb-6 items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Glúteos</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores.gluteos ??
                            '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (D)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .quadriceps_direito ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (E)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .quadriceps_esquerdo ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadril</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores.quadril ??
                            '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (D)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .panturrilha_direita ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (E)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .panturrilha_esquerda ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-yellow-500 w-full">Dados</h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">IMC</p>
                      <p
                        className={`text-sm ${
                          Number(lastShapeRegistration?.imc.toFixed(1)) >= 25
                            ? 'text-red-500'
                            : Number(lastShapeRegistration?.imc.toFixed(1)) <=
                                18.5
                              ? 'text-red-500'
                              : 'text-green-500'
                        }`}
                      >
                        {lastShapeRegistration?.imc
                          ? Number(lastShapeRegistration.imc.toFixed(1)) < 18.5
                            ? 'Abaixo do peso'
                            : Number(lastShapeRegistration.imc.toFixed(1)) < 25
                              ? 'Peso normal'
                              : 'Sobrepeso'
                          : '-'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Altura</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.altura
                          ? lastShapeRegistration.altura
                          : '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peso</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.peso ?? '-'} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <WeightProgressIndicator
            currentWeight={lastShapeRegistration?.peso || 0}
            targetWeight={Number(lastShapeRegistration?.peso_meta) || 0}
          />

          {/* Workouts section */}
          <div className="mt-16 w-full">
            <div className="flex items-center mb-8 justify-between">
              <h2 className="text-2xl font-medium">Organize seus treinos</h2>
              <Button
                variant="secondary"
                className="text-zinc-500 pl-4 py-0 pr-0 gap-2"
                onClick={() => {
                  setEditingWorkout(null)
                  setisCreateUpdateModal(true)
                }}
              >
                Novo treino
                <div className="h-full border-l flex items-center justify-center px-4 border-zinc-300">
                  <Plus className="w-5 h-5 text-red-500" weight="bold" />
                </div>
              </Button>
            </div>

            <div className="flex gap-4 w-full justify-between mb-8">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day.short}
                  onClick={() => setSelectedDay(day.workoutIndex)}
                  className={`px-6 py-4 w-full rounded-lg text-base font-medium transition-colors
                  ${
                    selectedDay === day.workoutIndex
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }
                `}
                >
                  {day.short}
                </button>
              ))}
            </div>

            <div>
              <div className="flex flex-col">
                {localWorkouts.filter(
                  (workout) => workout.indice === selectedDay,
                ).length > 0 ? (
                  localWorkouts
                    .filter((workout) => workout.indice === selectedDay)
                    .map((workout) => (
                      <div
                        key={workout.ficha_id}
                        className="relative flex w-full mb-8"
                      >
                        <div className="relative translate-y-0.5 flex flex-col items-center">
                          <div className="text-red-500 font-medium whitespace-nowrap">
                            {workout.horario}
                          </div>
                          <div className="w-px h-full absolute top-8 bg-zinc-800" />
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 relative z-10" />
                        </div>

                        <div className="flex flex-col gap-4 ml-4 w-full">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base flex items-center gap-2 text-zinc-300">
                                {workout.titulo}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setisCreateUpdateModal(true)
                                  setEditingWorkout(workout)
                                }}
                                className="bg-zinc-700 hover:bg-red-800 px-2 py-1 gap-2"
                              >
                                Editar treino
                                <Pencil weight="fill" size={20} />
                              </Button>
                              <Button
                                onClick={() => handleDeleteWorkout(workout)}
                                variant="destructive"
                                className="bg-transparent aspect-square hover:bg-red-900 p-2"
                              >
                                <Trash size={20} />
                              </Button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {workout.exercicios.length > 0 && (
                              <Reorder.Group
                                axis="y"
                                values={workout.exercicios}
                                onReorder={(newExercises: Exercise[]) => {
                                  const updatedWorkouts = localWorkouts.map(
                                    (w) => {
                                      if (w.ficha_id === workout.ficha_id) {
                                        return {
                                          ...w,
                                          exercicios: newExercises,
                                        }
                                      }
                                      return w
                                    },
                                  )
                                  setLocalWorkouts(updatedWorkouts)

                                  // Get the updated workout
                                  const updatedWorkout = updatedWorkouts.find(
                                    (w) => w.ficha_id === workout.ficha_id,
                                  )

                                  // Call the debounced update if we have the workout
                                  if (updatedWorkout) {
                                    debouncedUpdate(
                                      workout,
                                      updatedWorkout.exercicios,
                                    )
                                  }
                                }}
                                className="space-y-6"
                                style={{ position: 'relative' }}
                              >
                                {workout.exercicios.map(
                                  (exercise: Exercise) => (
                                    <ExerciseCard
                                      key={`${workout.indice}-${exercise.indice}`}
                                      exercise={exercise}
                                      workoutIndex={workout.indice}
                                      onEdit={() => {
                                        setEditingExercise(exercise)
                                        setisCreateUpdateModal(true)
                                      }}
                                    />
                                  ),
                                )}
                              </Reorder.Group>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                    <p>Nenhum treino cadastrado para este dia</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreateUpdateModal && (
        <ExerciciosCreateUpdate
          isOpen={isCreateUpdateModal || !!editingExercise}
          onClose={() => {
            setisCreateUpdateModal(false)
            setEditingExercise(null)
          }}
          workout={editingWorkout || undefined}
        />
      )}

      <Dialog
        open={!!workoutToDelete}
        onOpenChange={() => setWorkoutToDelete(null)}
      >
        <DialogContent className="overflow-hidden">
          {/* <DialogHeader className="text-left flex">
            <h2 className="text-red-500 text-left">Excluir treino</h2>
           
          </DialogHeader> */}
          <DialogHeader className="p-4 relative w-full z-10">
            <DialogTitle className="flex pt-2 justify-between items-center w-full">
              Excluir treino
            </DialogTitle>
            <DialogDescription className="pt-4">
              Tem certeza que deseja excluir o treino{' '}
              <span className="text-red-500 font-bold">
                &ldquo;{workoutToDelete?.titulo}&rdquo;
              </span>{' '}
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end p-4 pt-0">
            <Button
              variant="outline"
              onClick={() => setWorkoutToDelete(null)}
              className="bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteWorkout}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
