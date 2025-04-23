'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Exercise, Workout } from '@/lib/api/exercises'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import { WEEK_DAYS } from '@/lib/constants'
import { useState } from 'react'
import { Plus, Trash, X } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ExerciciosCreateUpdateProps {
  workout?: Workout
  isOpen: boolean
  onClose: () => void
  isEdit?: boolean
}

export function ExerciciosCreateUpdate({
  workout,
  isOpen,
  onClose,
  isEdit,
}: ExerciciosCreateUpdateProps) {
  // const { workouts, isLoading: isLoadingWorkouts } = useWorkouts()
  const { createWorkout, updateWorkout } = useWorkouts()
  const [exercises, setExercises] = useState<Exercise[]>(
    workout?.exercicios || [],
  )
  const [selectedDay, setSelectedDay] = useState(workout?.indice || 0)
  const [workoutTitle, setWorkoutTitle] = useState(workout?.titulo || '')
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    nome: '',
    series: '0',
    repeticoes: '0',
    carga: '0',
    indice: exercises.length,
  })

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentExercise.nome) {
      setExercises([
        ...exercises,
        { ...currentExercise, indice: exercises.length },
      ])
      setCurrentExercise({
        nome: '',
        series: '0',
        repeticoes: '0',
        carga: '0',
        indice: exercises.length + 1,
      })
    }
  }

  const handleRemoveExercise = (index: number) => {
    const newExercises = [...exercises]
    newExercises.splice(index, 1)
    // Update indices after removal
    newExercises.forEach((ex, i) => {
      ex.indice = i
    })
    setExercises(newExercises)
  }

  const handleSaveWorkout = async () => {
    try {
      if (exercises.length === 0) {
        toast.error('Adicione pelo menos um exercício')
        return
      }

      if (workout) {
        const sanitizedExercises = exercises.map((exercise, index) => ({
          nome: exercise.nome,
          series: exercise.series.toString(),
          repeticoes: exercise.repeticoes.toString(),
          carga: exercise.carga.toString(),
          indice: index,
        }))

        await updateWorkout({
          ficha_id: workout.ficha_id,
          titulo: workoutTitle,
          indice: selectedDay,
          exercicios: sanitizedExercises,
        })
      } else {
        await createWorkout({
          titulo: workoutTitle,
          indice: selectedDay,
          exercicios: exercises,
        })
      }
      onClose()
    } catch (error) {
      console.error('Error saving workout:', error)
    }
  }

  const handleDayClick = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedDay(index)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 select-none ring-0 border border-t-4 rounded-2xl border-zinc-700 !p-0 max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader className="p-4 relative w-full border-b border-zinc-700 bg-zinc-900 z-10">
          <DialogTitle className="flex justify-between items-center w-full">
            <div className="flex items-start px-3 py-2 gap-1 border border-yellow-500 rounded-full">
              <span className="uppercase text-[10px] text-yellow-500 font-semibold">
                {isEdit ? 'Editar' : 'Adicionar'} treino
              </span>
            </div>
          </DialogTitle>

          <div className="absolute cursor-pointer right-2 top-4">
            <DialogClose asChild>
              <X size={16} className="text-zinc-400" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 px-4">
            <label className="text-sm text-zinc-400">Dia da semana</label>
            <div className="grid grid-cols-7 gap-2">
              {WEEK_DAYS.map((day, index) => (
                <Button
                  key={day.short}
                  type="button"
                  variant={selectedDay === index ? 'default' : 'outline'}
                  onClick={handleDayClick(index)}
                  className={`${
                    selectedDay === index
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'border-zinc-700 text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  {day.short}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 px-4">
            <label className="text-sm text-zinc-400">Título do treino</label>
            <Input
              id="workoutTitle"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Ex: Treino de Peito"
            />
          </div>

          <div className="h-px w-full bg-zinc-700" />

          <form onSubmit={handleAddExercise} className="space-y-4">
            <div className="space-y-2 px-4">
              <label className="text-sm text-zinc-400">Nome do exercício</label>
              <Input
                id="nome"
                value={currentExercise.nome}
                onChange={(e) =>
                  setCurrentExercise({
                    ...currentExercise,
                    nome: e.target.value,
                  })
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="flex justify-between gap-4 px-4">
              <div className="space-y-2 w-full">
                <label className="text-sm text-zinc-400">Séries</label>
                <Input
                  id="series"
                  type="number"
                  value={currentExercise.series}
                  onChange={(e) =>
                    setCurrentExercise({
                      ...currentExercise,
                      series: e.target.value,
                    })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm text-zinc-400">Repetições</label>
                <Input
                  id="repeticoes"
                  type="number"
                  value={currentExercise.repeticoes}
                  onChange={(e) =>
                    setCurrentExercise({
                      ...currentExercise,
                      repeticoes: e.target.value,
                    })
                  }
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2 px-4">
              <label className="text-sm text-zinc-400">Carga atual</label>
              <Input
                id="carga"
                type="number"
                value={currentExercise.carga}
                onChange={(e) =>
                  setCurrentExercise({
                    ...currentExercise,
                    carga: e.target.value,
                  })
                }
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="px-4">
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="w-full bg-zinc-500 hover:bg-zinc-700"
              >
                Adicionar exercício <Plus size={16} />
              </Button>
            </div>
          </form>

          <div className="flex flex-col px-4 gap-4">
            {exercises.length > 0 && (
              <div className="space-y-2 border border-zinc-800 rounded-lg px-4 pt-4 pb-8">
                <label className="text-sm text-zinc-400">
                  Exercícios adicionados
                </label>
                <div className="space-y-2">
                  {exercises.map((ex, index) => (
                    <div
                      key={index}
                      className="flex overflow-y-auto items-center justify-between bg-zinc-800 py-2 rounded-full px-4"
                    >
                      <span className="text-zinc-300 text-sm truncate">
                        {ex.nome}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500 text-sm">
                          {ex.series} séries x {ex.repeticoes} reps ({ex.carga}
                          kg)
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="py-2 px-2 border-t flex justify-end w-full border-zinc-700 sticky bottom-0 bg-zinc-900 z-10">
          <Button
            type="button"
            variant="outline"
            className="bg-red-500 hover:bg-red-600"
            onClick={handleSaveWorkout}
          >
            {workout ? 'Salvar treino' : 'Criar treino'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
