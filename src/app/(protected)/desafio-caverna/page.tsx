'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChallengeDialogTrigger } from './challenge-dialog'
import { HeaderClose } from '@/components/header'

export default function Page() {
  const { data: challenge } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
  })

  if (challenge && challenge.status_desafio !== 'abandonado') {
    return redirect('/desafio-caverna/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex w-full min-h-screen">
        <header className="flex absolute w-full max-w-8xl left-1/2 right-1/2 -translate-x-1/2 items-center justify-center p-6">
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
          <div className="absolute right-64 top-6 text-sm text-muted-foreground cursor-pointer z-50">
            <HeaderClose />
          </div>
          <div className="flex flex-col items-center gap-16">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-3xl">
                Desafio <span className="text-primary">Caverna</span>
              </h1>
              <p className="text-zinc-400 max-w-sm text-center">
                40 dias de foco total em troca de uma vida de liberdade,
                prosperidade e abundância
              </p>
            </div>
            <div className="flex gap-3">
              <ChallengeDialogTrigger>
                <Button variant="outline">Como funciona?</Button>
              </ChallengeDialogTrigger>
              <Link href={'/desafio-caverna/steps'}>
                <Button>Eu aceito o desafio</Button>
              </Link>
            </div>
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
