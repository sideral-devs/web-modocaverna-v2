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
import { CellphoneStep } from './CellphoneStep'
import { ChallengeStep } from './ChallengeStep'
import { CheckPointStep } from './CheckpointStep'
import { ConfidentialityStep } from './ConfidentialityStep'
import { ConfirmStep } from './ConfirmStep'
import { DownloadAppStep } from './DownloadAppStep'
import { FortyDaysStep } from './FortyDaysStep'
import { InfoStep } from './InfoStep'
import { PlansSystem } from './PlansSystem'
import { TourStep } from './TourStep'

export default function Page() {
  const router = useRouter()
  const { data: user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const isDesafioPlan = user?.plan === 'DESAFIO'

  const { cellphone } = useOnboardingStore()

  const STEPS = isDesafioPlan
    ? [
        <InfoStep key={1} onNext={nextPhase} />,
        <CellphoneStep key={2} onNext={nextPhase} />,
        <ConfidentialityStep key={3} onNext={nextPhase} />,
        <DownloadAppStep key={4} onNext={nextPhase} />,
        <ActivateCaveModeStep key={5} onNext={nextPhase} />,
        <PlansSystem key={6} onNext={nextPhase} />,
        <ConfirmStep key={7} onNext={handleFinish} isLoading={isLoading} />,
      ]
    : [
        <InfoStep key={1} onNext={nextPhase} />,
        <CellphoneStep key={2} onNext={nextPhase} />,
        <ConfidentialityStep key={3} onNext={nextPhase} />,
        <DownloadAppStep key={4} onNext={nextPhase} />,
        <ActivateCaveModeStep key={5} onNext={nextPhase} />,
        <ChallengeStep key={6} onNext={nextPhase} />,
        <CheckPointStep key={7} onNext={nextPhase} />,
        <FortyDaysStep key={8} onNext={nextPhase} />,
        <TourStep key={9} onNext={handleFinish} />,
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
      <div className="flex flex-col w-full min-h-screen h-screen lg:h-auto items-center gap-3 lg:gap-6 bg-zinc-900 overflow-x-hidden">
        <header className="flex w-full max-w-8xl items-center justify-between p-6">
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
        {STEPS[currentPhase]}
      </div>
    </ProtectedRoute>
  )
}
