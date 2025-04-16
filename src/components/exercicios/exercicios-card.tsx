'use client'

import Image from 'next/image'
import { DotsThree } from '@phosphor-icons/react'
import { motion, Reorder, useMotionValue } from 'framer-motion'
import { Exercise } from '@/types/type'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ExerciseCardProps {
  name: string
  series: number
  repetitions: number
  currentWeight: number
  imageUrl: string
  value: Exercise
  onEdit: () => void
}

export function ExerciseCard({
  name,
  series,
  repetitions,
  currentWeight,
  imageUrl,
  value,
  onEdit,
}: ExerciseCardProps) {
  const y = useMotionValue(0)
  const { deleteExercise } = useWorkouts()

  const handleDelete = async () => {
    await deleteExercise(value.id)
  }

  return (
    <Reorder.Item
      value={value}
      id={value.id}
      style={{ y }}
      className="bg-black w-full border border-zinc-700 rounded-xl p-2 cursor-grab active:cursor-grabbing"
    >
      <motion.div
        className="bg-zinc-800 rounded-lg p-2"
        whileTap={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-full gap-4 w-full">
            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h4 className="text-lg font-medium">{name}</h4>
              <p className="text-zinc-400">
                {series} × {repetitions} repetições
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors">
                <DotsThree className="w-6 h-6 text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
              <DropdownMenuItem
                className="text-zinc-400 hover:text-white cursor-pointer"
                onClick={onEdit}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 hover:text-red-400 cursor-pointer"
                onClick={handleDelete}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
      <div className="pt-4 pb-2 pl-2">
        <p className="text-zinc-400 text-sm">
          Carga atual · {currentWeight} KG
        </p>
      </div>
    </Reorder.Item>
  )
}
