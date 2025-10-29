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
import { WelcomeStep } from './WelcomeStep'
import StartQuizStep from './StartQuizStep'
import QuizStep from './QuizStep'
import JourneyStartWeb from './JourneyStartStep'
import CaptainCaveWelcome from './CaptainCaveWelcomeStep'

export default function Page() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: user } = useUser()
  const [currentPhase, setCurrentPhase] = useState(0)
  const isDesafioPlan = user?.plan === 'DESAFIO'
  const isLastStep = currentPhase === (isDesafioPlan ? 3 : 4)
  const hideMetaText = isLastStep


  const STEPS = isDesafioPlan
    ? [
      <WelcomeStep key={1} onNext={nextPhase} />,
      <StartQuizStep key={2} onNext={nextPhase} />,
      <QuizStep key={3} onNext={nextPhase} />,
      <JourneyStartWeb key={4} onActivate={handleFinish} />,
    ]
    : [
      <WelcomeStep key={1} onNext={nextPhase} />,
      <CaptainCaveWelcome key={2} onNext={nextPhase} />,
      <StartQuizStep key={3} onNext={nextPhase} />,
      <QuizStep key={4} onNext={nextPhase} />,
      <JourneyStartWeb key={5} onActivate={handleFinish} />,
    ]

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  async function handleFinish() {
    try {
      await api.put('/users/update?save=true', {
        tutorial_complete: true,
      })

      queryClient.clear()
      router.replace('/dashboard?startTour=true&tourRedirect=true')
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  if (user && !!Number(user.tutorial_complete)) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>

      <div className="relative min-h-screen flex flex-col">
        <div className="w-full flex justify-center">
          {!hideMetaText && (
            <header className="flex flex-col gap-4 w-full max-w-2xl px-4 pt-4 z-10">

              <div className='flex items-center justify-between'>

                <span className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
                  Onboarding
                </span>

                <Image
                  src={'/images/logo-icon.svg'}
                  alt="Logo"
                  width={40}
                  height={40}
                />

                <span className="text-[10px] md:text-xs lg:text-sm text-right text-muted-foreground">
                  Passo {currentPhase + 1} de {STEPS.length - 1}
                </span>

              </div>

              <PhaseCounter current={currentPhase + 1} total={STEPS.length - 1} />

            </header>
          )}
        </div>

        <div className="flex justify-center w-full px-4 flex-1">
          <div className="flex justify-center w-full max-w-2xl flex-1">
            {STEPS[currentPhase]}
          </div>
        </div>

      </div>


    </ProtectedRoute>
  )
}
