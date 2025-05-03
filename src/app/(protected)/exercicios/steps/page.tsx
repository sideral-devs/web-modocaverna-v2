'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import { useOnboardingStore } from '@/store/onboarding'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PhaseCounter } from '../../../(public)/trial/sign-up/PhaseCounter'
import { CloseButton } from '../../settings/CloseButton'
import { AnalysisResultsStep } from './AnalysisResultsStep'
import { ShapeConfigStep } from './ShapeConfigStep'
import { ShapeGoalsStep } from './ShapeGoalsStep'
import { useShape } from '@/hooks/queries/use-shape'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    shapeRegistrations,
    // hasRegistration,

    isLoading: isLoadingShape,
  } = useShape()

  const firstShapeRegistration = shapeRegistrations?.[0]
  const { data: user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(
    Number(searchParams.get('step')) || 1,
  )
  const { cellphone } = useOnboardingStore()

  const passosTotal = 3

  const STEPS = {
    1: <ShapeConfigStep onNext={nextPhase} />,
    2: <ShapeGoalsStep onNext={nextPhase} onBack={backPhase} />,
    3: <AnalysisResultsStep onBack={backPhase} onFinish={handleFinish} />,
  }

  function nextPhase() {
    const nextStep = currentPhase + 1
    setCurrentPhase(nextStep)
    router.push(`/exercicios/steps?step=${nextStep}`)
  }

  function backPhase() {
    const previousStep = currentPhase - 1
    setCurrentPhase(previousStep)
    router.push(`/exercicios/steps?step=${previousStep}`)
  }

  async function handleFinish() {
    // Navigation is handled in AnalysisResultsStep
  }

  console.log(firstShapeRegistration, 'the first shape registration is: ')

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen items-center gap-6 bg-zinc-900">
        <header className="flex w-full pt-4 items-center justify-between p-6">
          <span className="text-sm text-muted-foreground">
            Passo {currentPhase} de {passosTotal}
          </span>
          <div className="flex flex-col w-full max-w-2xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <PhaseCounter current={currentPhase} total={passosTotal} />
          </div>

          <CloseButton onClick={() => router.back()} escapeTo="/exercicios" />
        </header>
        {STEPS[currentPhase as keyof typeof STEPS]}
      </div>
    </ProtectedRoute>
  )
}
