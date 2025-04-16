import Image from 'next/image'
import { DotsThree } from '@phosphor-icons/react'
import { Reorder, useMotionValue } from 'framer-motion'

export interface Exercise {
  id: string
  name: string
  series: number
  repetitions: number
  currentWeight: number
  imageUrl: string
  muscleGroups: {
    bicepsDireito?: number
    bicepsEsquerdo?: number
    peitoral?: number
    tricepsDireito?: number
    tricepsEsquerdo?: number
    costas?: number
    ombros?: number
    pernas?: number
  }
}

interface ExerciseCardProps {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const y = useMotionValue(0)

  return (
    <Reorder.Item
      value={exercise}
      id={exercise.id}
      style={{ y }}
      className="bg-black w-full border border-zinc-700 rounded-xl p-2 cursor-grab active:cursor-grabbing"
    >
      <div className="bg-zinc-800 rounded-lg p-2">
        <div className="flex items-start justify-between">
          <div className="flex h-full gap-4 w-full">
            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden">
              <Image
                src={exercise.imageUrl}
                alt={exercise.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h4 className="text-lg font-medium">{exercise.name}</h4>
              <p className="text-zinc-400">
                {exercise.series} × {exercise.repetitions} repetições
              </p>
            </div>
          </div>

          <button className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors">
            <DotsThree className="w-6 h-6 text-zinc-400" />
          </button>
        </div>
      </div>
      <div className="pt-4 pb-2 pl-2">
        <p className="text-zinc-400 text-sm">
          Carga atual · {exercise.currentWeight} KG
        </p>
      </div>
    </Reorder.Item>
  )
}
