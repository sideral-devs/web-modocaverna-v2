'use client'

import { DotsThree } from '@phosphor-icons/react'
import { Reorder, motion, useDragControls } from 'framer-motion'
import { Exercise } from '@/lib/api/exercises'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'

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
  const dragControls = useDragControls()

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
      dragControls={dragControls}
      id={exercise.indice.toString()}
      value={exercise}
      className="flex select-none items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center"
          onPointerDown={(e) => dragControls.start(e)}
          whileHover={{ cursor: 'grab' }}
          whileTap={{ cursor: 'grabbing' }}
        >
          <GripVertical
            size={16}
            onPointerDown={(e) => {
              e.currentTarget.style.cursor = 'grabbing'
              dragControls.start(e)
            }}
            onPointerUp={(e) => {
              e.currentTarget.style.cursor = 'grab'
            }}
            className="reorder-handle cursor-grab text-zinc-400"
          />
        </motion.div>

        <div>
          <h4 className="text-zinc-300 font-medium">{exercise.nome}</h4>
          <p className="text-sm text-zinc-500">
            {exercise.series} séries x {exercise.repeticoes} repetições
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">{exercise.carga} kg</span>
      </div>
    </Reorder.Item>
  )
}
