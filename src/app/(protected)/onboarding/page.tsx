'use client'
import { ProtectedRoute } from '@/components/protected-route'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { useUser } from '@/hooks/queries/use-user'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Page() {
  const { data: user } = useUser()

  if (user && !!Number(user.tutorial_complete)) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex w-full min-h-screen">
        <header className="flex absolute w-full max-w-8xl left-1/2 right-1/2 -translate-x-1/2 items-center justify-center p-6">
          <p className="absolute left-6 text-sm text-muted-foreground">
            Onboarding
          </p>
          <div className="flex flex-col w-full max-w-xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <div className="flex w-full h-[1px] bg-zinc-700"></div>
          </div>
        </header>
        <div className="flex relative flex-1 justify-center items-center p-4">
          <div className="flex flex-col items-center gap-16">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-3xl">Seja bem-vindo(a) à Caverna</h1>
              <p className="text-zinc-400 max-w-sm text-center">
                Você está preparado(a) para a jornada mais desafiadora e
                transformadora da sua vida?
              </p>
            </div>
            <Link href={'/onboarding/steps'}>
              <AutoSubmitButton>Estou pronto(a)!</AutoSubmitButton>
            </Link>
          </div>
        </div>
        <Image
          src={'/images/bg.webp'}
          alt="bg"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'top center',
            zIndex: -1,
            opacity: 0.5,
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
