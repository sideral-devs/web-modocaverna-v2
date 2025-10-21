'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { useOnboardingStore } from '@/store/onboarding'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { PhaseCounter } from '../../../(public)/trial/sign-up/PhaseCounter'
import { ActivateCaveModeStep } from './ActivateCaveModeStep'
import { ConnectStep } from './ConnectStep'
import { QuizStep } from './QuizStep'
import { StartQuizStep } from './StartQuizStep'
import { WelcomeStep } from './WelcomeStep'
import { PhoneNumberStep } from './PhoneNumberStep'
import { FirstStep } from '../../(main)/desafio-caverna/steps/first'

export default function Page() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: user } = useUser()
  const [currentPhase, setCurrentPhase] = useState(0)
  const isDesafioPlan = user?.plan === 'DESAFIO'

  const { cellphone } = useOnboardingStore()

  const STEPS = isDesafioPlan
    ? [
      <WelcomeStep key={1} onNext={nextPhase} />,
      <ConnectStep key={2} onNext={nextPhase} />,
      <PhoneNumberStep key={3} onNext={nextPhase} />,
      <FirstStep key={4} onNext={nextPhase} />,
      <StartQuizStep key={5} onNext={nextPhase} />,
      <QuizStep key={6} onNext={handleFinish} />,
    ]
    : [
      <WelcomeStep key={1} onNext={nextPhase} />,
      <ConnectStep key={2} onNext={nextPhase} />,
      <PhoneNumberStep key={3} onNext={nextPhase} />,
      <FirstStep key={4} onNext={nextPhase} />,
      <StartQuizStep key={5} onNext={nextPhase} />,
      <QuizStep key={6} onNext={nextPhase} />,
      <ActivateCaveModeStep key={7} onNext={handleFinish} />,
    ]

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  async function handleFinish() {
    try {
      await api.put('/users/update?save=true', {
        tutorial_complete: true,
        telefone: cellphone,
      })

      queryClient.clear()

      if (window?.innerWidth < 768) {
        router.replace('/onboarding/concluido')
      } else {
        router.replace('/dashboard?startTour=true&tourRedirect=true')
      }
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  if (user && !!Number(user.tutorial_complete)) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-dvh items-center gap-0 overflow-hidden relative">
        <Image
          src={'/images/bg.webp'}
          alt="bg"
          className='w-full !min-h-screen'
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: -1,
            opacity: 0.3,
          }}
        />
        <header className="flex w-full max-w-8xl mb-7 items-center justify-between p-6 z-10">
          <span className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
            Onboarding
          </span>
          <div className="flex flex-col flex-1 w-full max-w-xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <PhaseCounter current={currentPhase + 1} total={STEPS.length} />
          </div>
          <span className="text-[10px] md:text-xs lg:text-sm text-right text-muted-foreground">
            Passo {currentPhase + 1} de {STEPS.length}
          </span>
        </header>
        <div className="w-full flex flex-1 max-w-xl flex-col items-center z-10">
          {STEPS[currentPhase]}
        </div>

      </div>
    </ProtectedRoute>
  )
}
