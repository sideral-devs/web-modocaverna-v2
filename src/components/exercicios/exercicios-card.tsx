'use client'

import { DotsThree } from '@phosphor-icons/react'
import { Reorder, useMotionValue } from 'framer-motion'
import { Exercise } from '@/lib/api/exercises'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ExerciseCardProps {
  exercise: Exercise
  workoutIndex: number
  onEdit: () => void
}

export function ExerciseCard({
  exercise,
  workoutIndex,
  onEdit,
}: ExerciseCardProps) {
  const { deleteExercise } = useWorkouts()
  const y = useMotionValue(0)

  const handleDelete = async () => {
    try {
      await deleteExercise({
        workoutIndex,
        exerciseIndex: exercise.indice,
      })
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  return (
    <Reorder.Item
      value={exercise}
      id={String(exercise.exercicio_id)}
      style={{ y }}
      className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
          <DotsThree weight="bold" className="text-zinc-400" />
        </div>

        <div>
          <h4 className="text-zinc-300 font-medium">{exercise.nome}</h4>
          <p className="text-sm text-zinc-500">
            {exercise.series} séries x {exercise.repeticoes} repetições
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">{exercise.carga} kg</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <DotsThree weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-900 border-zinc-800"
          >
            <DropdownMenuItem
              onClick={onEdit}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-500 hover:text-red-400 cursor-pointer"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Reorder.Item>
  )
}
