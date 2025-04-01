'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { PhaseCounter } from '../../../(public)/trial/sign-up/PhaseCounter'
import { FifthStep } from './fifth'
import { FirstStep } from './first'
import { FourthStep } from './fourth'
import { SecondStep } from './second'
import { SeventhStep } from './seventh'
import { SixthStep } from './sixth'
import { ThirdStep } from './third'
import { HeaderClose } from '@/components/header'

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
    7: <SeventhStep />,
  } as { [key: number]: ReactNode }

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  function prevPhase() {
    setCurrentPhase((curr) => curr - 1)
  }

  if (challenge && challenge.status_desafio !== 'abandonado') {
    return redirect('/desafio-caverna/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen items-center gap-6 bg-zinc-900">
        <header className="flex w-full max-w-8xl items-center justify-center p-6 relative">
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
            <span className="absolute right-36 top-6 hidden lg:block text-sm text-muted-foreground">
              Passo {currentPhase} de 7
            </span>
            <div className="absolute right-4 top-6 hidden lg:block text-sm text-muted-foreground">
              <HeaderClose />
            </div>
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
