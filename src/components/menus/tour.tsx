/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from '@/lib/api'
import { videos } from '@/lib/constants'
import { useTourMenu } from '@/store/tour-menu'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertOctagonIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { VideoPlayer } from '../video-player'

export function TourMenu() {
  const { open, setOpen } = useTourMenu()

  function handleClose() {
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TourMenuContent onClose={handleClose} />
    </AlertDialog>
  )
}

function TourMenuContent({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    <FirstStep key="tour-steps-1" onClose={onClose} onNext={nextStep} />,
    <SecondStep key="tour-steps-2" onNext={handleFinish} />,
  ]

  function nextStep() {
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
  }

  async function handleFinish() {
    try {
      await api.post('/users/onboarding/videos/watch')
      onClose()
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <AlertDialogContent className="bg-zinc-800 border-zinc-700 gap-4 overflow-hidden">
      <div className="relative w-full h-full overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </AlertDialogContent>
  )
}

function FirstStep({ onNext }: { onClose: () => void; onNext: () => void }) {
  const [timed, setTimed] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setTimed(true)
      },
      1.5 * 60 * 1000,
    )

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full-items-center gap-8 lg:gap-16">
        <Image
          src={'/images/lobo-face.svg'}
          width={125}
          height={109}
          alt="Capitão Caverna"
          className="scale-75 lg:scale-100"
        />

        <div className="flex flex-col relative w-full p-4 lg:p-6 gap-6 border border-zinc-700 rounded-lg">
          <p className="text-sm lg:text-base font-semibold">
            Este vídeo tour vai te transformar em um(a) verdadeiro(a)
            explorador(a) da Caverna! Assista.
          </p>
          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px] bottom-6"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          <VideoPlayer id={videos.onboardingTutorial} />
        </div>
        <span className="text-zinc-400 text-center text-sm">
          *Você não verá isto novamente. Avance apenas quando estiver pronto.
        </span>
      </div>
      <AlertDialogFooter className="mt-6">
        <Button variant="ghost" onClick={onNext}>
          Pular Tour
        </Button>
        <Button onClick={onNext} disabled={!timed}>
          Avançar
        </Button>
      </AlertDialogFooter>
    </div>
  )
}

function SecondStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative justify-between items-center gap-48 lg:gap-16 overflow-visible">
      <div
        style={{
          width: 212,
          height: 358,
        }}
        className="absolute right-0 bottom-0 translate-y-1/4 scale-90 lg:hidden"
      >
        <Image
          src={'/images/lobo/legal-mobile.png'}
          alt="Capitão Caverna"
          fill
          className="object-cover"
          style={{
            maskImage: 'linear-gradient(to bottom, black 40%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 40%, transparent)',
          }}
        />
      </div>
      <div className="flex items-start gap-6">
        <Image
          src={'/images/lobo/legal.png'}
          alt="Capitão Caverna"
          width={222}
          height={373}
          className="hidden lg:block"
        />

        <div className="flex flex-col relative w-full p-6 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">Chegou o grande momento</h1>
          <p className="text-sm text-zinc-400">
            Eu estarei sempre por perto para te ajudar, mas essa jornada é sua.
            Tem coisas que só você pode fazer por você mesmo(a).
          </p>
          <div className="w-full flex items-center p-6 gap-4 bg-[#323232]/50 rounded-lg">
            <p className="text-sm text-zinc-400">
              Clique no botão abaixo, assista as aulas do curso Modo Caverna e
              inicie uma nova fase, cheia de foco e conquistas.
            </p>
          </div>
          <div className="w-full flex items-center px-4 py-6 gap-4 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon className="text-yellow-400 min-w-6" size={24} />
            <p className="text-sm text-yellow-400">
              Lembre- se: O que você faz hoje define quem você será amanhã. A
              mudança começa agora!
            </p>
          </div>

          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="hidden lg:block absolute -left-[54px] top-14"
          />
        </div>
      </div>

      <AlertDialogFooter>
        <Button onClick={onNext}>Ativar Modo Caverna</Button>
      </AlertDialogFooter>
    </div>
  )
}
