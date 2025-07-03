'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { useOnboardingStore } from '@/store/onboarding'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { PhaseCounter } from '../../../(public)/trial/sign-up/PhaseCounter'
import { ActivateCaveModeStep } from './ActivateCaveModeStep'
import { ChallengeStep } from './ChallengeStep'
import { ConfirmStep } from './ConfirmStep'
import { ConnectStep } from './ConnectStep'
import { FortyDaysStep } from './FortyDaysStep'
import { PlansSystem } from './PlansSystem'
import { QuizStep } from './QuizStep'
import { StartQuizStep } from './StartQuizStep'
import { WelcomeStep } from './WelcomeStep'

export default function Page() {
  const router = useRouter()
  const { data: user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(3)
  const isDesafioPlan = user?.plan === 'DESAFIO'

  const { cellphone } = useOnboardingStore()

  const STEPS = isDesafioPlan
    ? [
        <WelcomeStep key={1} onNext={nextPhase} />,
        <ConnectStep key={2} onNext={nextPhase} />,
        <StartQuizStep key={3} onNext={nextPhase} />,
        <QuizStep key={4} onNext={nextPhase} />,
        <ActivateCaveModeStep key={5} onNext={nextPhase} />,
        <PlansSystem key={6} onNext={nextPhase} />,
        <ConfirmStep key={7} onNext={handleFinish} isLoading={isLoading} />,
      ]
    : [
        <WelcomeStep key={1} onNext={nextPhase} />,
        <ConnectStep key={2} onNext={nextPhase} />,
        <StartQuizStep key={3} onNext={nextPhase} />,
        <QuizStep key={4} onNext={nextPhase} />,
        <ActivateCaveModeStep key={5} onNext={nextPhase} />,
        <ChallengeStep key={6} onNext={nextPhase} />,
        // <CheckPointStep key={7} onNext={nextPhase} />,
        <FortyDaysStep key={7} onNext={handleFinish} />,
      ]

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  async function handleFinish() {
    setIsLoading(true)
    try {
      await api.put('/users/update?save=true', {
        tutorial_complete: true,
        telefone: cellphone,
      })
      router.replace('/dashboard?startTour=true')
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (user && !!Number(user.tutorial_complete)) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-dvh items-center gap-8 bg-zinc-950 overflow-hidden relative">
        <header className="flex w-full max-w-8xl items-center justify-between p-6 z-10">
          <span className="text-xs lg:text-sm text-muted-foreground">
            Onboarding
          </span>
          <div className="flex flex-col w-full max-w-xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <PhaseCounter current={currentPhase + 1} total={STEPS.length} />
          </div>
          <span className="text-xs lg:text-sm text-right text-muted-foreground">
            Passo {currentPhase + 1} de {STEPS.length}
          </span>
        </header>
        <div className="w-full flex flex-1 flex-col items-center z-10">
          <div className="flex flex-col w-full max-w-[700px]">
            {STEPS[currentPhase]}
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-[800px] -left-[800px] size-[1600px] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
          <div className="absolute -top-[800px] -right-[800px] size-[1600px] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
        </div>
      </div>
    </ProtectedRoute>
  )
}
