'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { PhaseCounter } from '../../../(public)/trial/sign-up/PhaseCounter'
import { ActivateCaveModeStep } from './ActivateCaveModeStep'
import { CellphoneStep } from './CellphoneStep'
import { ConfidentialityStep } from './ConfidentialityStep'
import { ConfirmStep } from './ConfirmStep'
import { DownloadAppStep } from './DownloadAppStep'
import { InfoStep } from './InfoStep'
import { PlansSystem } from './PlansSystem'

export default function Page() {
  const router = useRouter()
  const { data: user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(1)
  const isDesafioPlan = user?.plan === 'DESAFIO'

  const passosTotal = isDesafioPlan ? 7 : 6

  const STEPS = isDesafioPlan
    ? ({
        1: <InfoStep onNext={nextPhase} />,
        2: <CellphoneStep onNext={nextPhase} />,
        3: <ConfidentialityStep onNext={nextPhase} />,
        4: <DownloadAppStep onNext={nextPhase} />,
        5: <ActivateCaveModeStep onNext={nextPhase} />,
        6: <PlansSystem onNext={nextPhase} />,
        7: <ConfirmStep onNext={handleFinish} isLoading={isLoading} />,
      } as { [key: number]: ReactNode })
    : ({
        1: <InfoStep onNext={nextPhase} />,
        2: <CellphoneStep onNext={nextPhase} />,
        3: <ConfidentialityStep onNext={nextPhase} />,
        4: <DownloadAppStep onNext={nextPhase} />,
        5: <ActivateCaveModeStep onNext={nextPhase} />,
        6: <ConfirmStep onNext={handleFinish} isLoading={isLoading} />,
      } as { [key: number]: ReactNode })

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  async function handleFinish() {
    router.replace('/dashboard/tour')
    setIsLoading(false)
  }

  if (user && !!Number(user.tutorial_complete)) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen items-center gap-6 bg-zinc-900">
        <header className="flex w-full max-w-8xl items-center justify-between p-6">
          <span className="text-sm text-muted-foreground">Onboarding</span>
          <div className="flex flex-col w-full max-w-xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <PhaseCounter current={currentPhase} total={passosTotal} />
          </div>
          <span className="text-sm text-muted-foreground">
            Passo {currentPhase} de {passosTotal}
          </span>
        </header>
        {STEPS[currentPhase]}
      </div>
    </ProtectedRoute>
  )
}
