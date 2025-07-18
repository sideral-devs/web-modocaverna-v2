'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ReactNode, useState } from 'react'

import { PhaseCounter } from '@/app/(public)/trial/sign-up/PhaseCounter'
import { FifthStep } from './fifth'
import { FirstStep } from './first'
import { FourthStep } from './fourth'
import { SecondStep } from './second'
import { SeventhStep } from './seventh'
import { SixthStep } from './sixth'
import { ThirdStep } from './third'

export default function Page() {
  const [currentPhase, setCurrentPhase] = useState(1)

  const { data: challenge } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
  })

  const STEPS = {
    1: <FirstStep onNext={nextPhase} />,
    2: <SecondStep onNext={nextPhase} onBack={prevPhase} />,
    3: <ThirdStep onNext={nextPhase} onBack={prevPhase} />,
    4: <FourthStep onNext={nextPhase} onBack={prevPhase} />,
    5: <FifthStep onNext={nextPhase} onBack={prevPhase} />,
    6: <SixthStep onNext={nextPhase} onBack={prevPhase} />,
    7: <SeventhStep onBack={prevPhase} />,
  } as { [key: number]: ReactNode }

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  function prevPhase() {
    setCurrentPhase((curr) => curr - 1)
  }

  if (
    challenge &&
    challenge.status_desafio !== 'abandonado' &&
    challenge.status_desafio !== 'finalizado'
  ) {
    return redirect('/dashboard/desafio/desafio-caverna/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-full items-center gap-6">
        <header className="flex w-full items-center justify-center py-4 relative">
          <span className="absolute left-6 top-6 hidden lg:block text-sm text-muted-foreground">
            {titles[currentPhase - 1]}
          </span>
          <div className="flex flex-col w-full max-w-xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <PhaseCounter current={currentPhase} total={7} />
          </div>
          <div>
            <span className="absolute right-6 top-6 hidden lg:block text-sm text-muted-foreground">
              Passo {currentPhase} de 7
            </span>
          </div>
        </header>
        {STEPS[currentPhase]}
      </div>
    </ProtectedRoute>
  )
}

const titles = [
  'Primeiro passo',
  'Registro inicial - Parte 1',
  'Registro inicial - Parte 2',
  'Segundo passo',
  'Eliminação de maus hábitos',
  'Criação de novos hábitos',
  'Avisos de capitão',
]
