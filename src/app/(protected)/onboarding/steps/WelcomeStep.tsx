'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}
const itemUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="relative flex w-full flex-col justify-center items-center gap-8 overflow-hidden"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* BG fixo cobrindo a tela inteira */}
      <motion.div
        aria-hidden
        className="-z-10 fixed inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.30, scale: [1.05, 1, 1.03, 1] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.02, 1], y: [0, -6, 0] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <Image
            fill
            priority
            alt="Fundo do Modo Caverna"
            src="/images/bg.webp"
            className="object-cover pointer-events-none select-none"
          />
        </motion.div>
      </motion.div>

      <motion.div className="flex flex-col items-center gap-6" variants={itemUp}>
        <motion.h1 className="font-bold text-3xl lg:text-4xl text-center" variants={itemUp}>
          Seja bem vindo(a) <br /> ao <span className="text-primary">Modo Caverna</span>
        </motion.h1>

        <motion.p className="lg:text-lg text-base opacity-80 text-center max-w-md" variants={itemUp}>
          Aperte no botão abaixo, se você está preparado(a) para a jornada mais tranformadora da sua vida.
        </motion.p>

        <motion.div
          variants={itemUp}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >

          <Button onClick={onNext} size="lg">Estou Pronto(a) !</Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
