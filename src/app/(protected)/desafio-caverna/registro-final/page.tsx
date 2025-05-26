'use client'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { PhaseCounter } from '../../../(public)/trial/sign-up/PhaseCounter'
import { FinalStepOne } from './final-step-one'
import { FinalStepTwo } from './final-step-two'

export default function Page() {
  const [currentPhase, setCurrentPhase] = useState(1)

  const { data: challenge, isFetched } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
  })

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  function prevPhase() {
    setCurrentPhase((curr) => curr - 1)
  }


  if (!challenge && isFetched) {
    return redirect('/desafio-caverna')
  }

  // Verificar se está em progresso e o último dia foi respondido
  if (challenge) {
    if (challenge.status_desafio === 'pausado') {
      return redirect('/desafio-caverna/dashboard')
    }

    // if (!lastDay?.status || lastDay.status === 'nulo') {
    //   return redirect('/desafio-caverna/dashboard')
    // }

    if (challenge.status_desafio === 'concluido') {
      return redirect('/desafio-caverna/concluido')
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center gap-6 bg-zinc-900">
      <header className="flex w-full max-w-8xl items-center justify-center pt-7 relative">
        <span className="absolute left-6 top-8 hidden xl:flex text-xs px-3 py-2 bg-primary rounded-full uppercase">
          Registro final
        </span>
        <div className="flex flex-col w-full max-w-3xl 2xl:max-w-4xl items-center px-4 gap-6">
          <Image
            src={'/images/logo-icon.svg'}
            alt="Logo"
            width={32}
            height={27}
          />
          <PhaseCounter current={currentPhase} total={2} />
        </div>
        <span className="absolute right-6 top-8 hidden xl:block text-sm text-muted-foreground">
          Passo {currentPhase} de 2
        </span>
      </header>
      {challenge ? (
        currentPhase === 1 ? (
          <FinalStepOne onNext={nextPhase} challenge={challenge} />
        ) : (
          <FinalStepTwo onBack={prevPhase} challenge={challenge} />
        )
      ) : null}
    </div>
  )
}
