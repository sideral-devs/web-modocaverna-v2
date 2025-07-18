'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChallengeDialogTrigger } from './challenge-dialog'

export default function Page() {
  const { data: challenge } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
  })

  if (
    challenge &&
    challenge.status_desafio === 'iniciado' &&
    challenge.hojeInfo &&
    ((challenge.modalidade === 'cavernoso_40' && challenge.dia_atual === 40) ||
      (challenge.modalidade === 'express' && challenge.dia_atual === 30) ||
      (challenge.modalidade === 'cavernoso' && challenge.dia_atual === 60))
  ) {
    return redirect('/dashboard/desafio/desafio-caverna/registro-final')
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
      <div className="flex w-full h-full">
        <div className="flex relative flex-1 justify-center items-center p-4">
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
              <Link href={'/dashboard/desafio/desafio-caverna/steps'}>
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
