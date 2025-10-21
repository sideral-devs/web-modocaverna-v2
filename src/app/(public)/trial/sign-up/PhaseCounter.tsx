'use client'
import { cn } from '@/lib/utils'
import { motion, TargetAndTransition } from 'framer-motion'

export function PhaseCounter({
  total,
  current,
  className,
  animate,
}: {
  total: number
  current: number
  className?: string
  animate?: TargetAndTransition
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex w-full h-2 bg-zinc-700 rounded-xl">
        <motion.div
          className={cn('flex h-2 bg-primary rounded-xl', className)}
          animate={{
            width: (Math.min(current, total) / total) * 100 + '%',
            transition: {
              duration: 0.5,
            },
            backgroundColor: current > total ? '#34D298' : '#EE4444',
            ...animate,
          }}
        ></motion.div>
      </div>
    </div>
  )
}
