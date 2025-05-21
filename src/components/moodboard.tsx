'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { SlideShow } from './dreamboard/slide-show'

interface GoalsSwiperProps {
  className?: string
}

export function Moodboard({ className }: GoalsSwiperProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  return (
    <motion.div
      className={cn('w-full flex flex-col rounded-t-xl bg-card', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between border-b p-3 dark:border-gray-700">
        <h3 className="text-xs">Combustível 🔥</h3>
        <button
          onClick={toggleMinimize}
          aria-label={isMinimized ? 'Expandir' : 'Minimizar'}
        >
          {isMinimized ? <PlusIcon size={16} /> : <MinusIcon size={16} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!isMinimized && <SlideShow />}
      </AnimatePresence>
    </motion.div>
  )
}
