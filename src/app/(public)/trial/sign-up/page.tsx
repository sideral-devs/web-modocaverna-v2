'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { NameStep } from './NameStep'
import { PasswordStep } from './PasswordStep'
import { PhaseCounter } from './PhaseCounter'
import { RegisterStep } from './RegisterStep'

export default function Page() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const router = useRouter()

  const STEPS = {
    1: <NameStep onNext={nextPhase} />,
    2: <RegisterStep onNext={nextPhase} onPrev={prevPhase} />,
    3: <PasswordStep onNext={onFinish} onPrev={prevPhase} />,
  } as { [key: number]: ReactNode }

  function nextPhase() {
    setCurrentPhase((curr) => curr + 1)
  }

  function prevPhase() {
    setCurrentPhase((curr) => curr - 1)
  }

  function onFinish() {
    router.push('/trial/sign-up/all-done')
  }

  return (
    <div className="flex flex-col w-full h-full min-h-screen overflow-hidden items-center p-4">
      <header className="flex w-full max-w-8xl py-4 px-8">
        <h1 className="font-medium">Criar conta</h1>
      </header>
      <div className="flex flex-col w-full flex-1 max-w-[590px] items-center p-4 pb-16 gap-7">
        <Image
          src={'/images/logo-icon.svg'}
          alt="Logo"
          width={32}
          height={27}
        />
        <PhaseCounter current={currentPhase} total={3} />
        {STEPS[currentPhase]}
        {currentPhase === 1 && (
          <span className="mt-auto text-sm font-medium items-baseline">
            Já possui uma conta?{' '}
            <Link href={'/login'} className="text-primary text-sm font-medium">
              Entrar
            </Link>
          </span>
        )}
      </div>
    </div>
  )
}
