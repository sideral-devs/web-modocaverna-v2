'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { CheckIcon, Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Page() {
  const { data: challenge, isFetched } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
  })

  if (!challenge && isFetched) {
    return redirect('/desafio-caverna')
  }

  if (challenge) {
    const arrayDias = challenge.array_dias
    const lastDay = arrayDias[arrayDias.length - 1]

    if (challenge.status_desafio === 'pausado') {
      return redirect('/dashboard/desafio/desafio-caverna/dashboard')
    }

    if (!lastDay?.status || lastDay.status === 'nulo') {
      return redirect('/dashboard/desafio/desafio-caverna/dashboard')
    }
  }

  if (!challenge) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center p-8">
        <Loader2Icon className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full items-center p-8 gap-16 scrollbar-minimal">
      <Image src={'/images/logo-icon.svg'} alt="Logo" width={26} height={22} />
      <div className="flex flex-col flex-1 h-full items-center gap-12">
        <h1 className="text-2xl font-semibold text-center max-w-[400px]">
          Parabéns, você completou o Desafio Caverna!
        </h1>
        <div className="flex w-full gap-8 md:block md:w-auto relative">
          <Image
            src={'/images/lobo/legal.png'}
            alt="Capitão Caverna"
            width={228}
            height={375}
          />
          <div className="flex flex-col h-fit relative md:absolute md:top-10 md:right-0 xl:-right-8 md:translate-x-[100%] w-72 lg:w-[319px] p-6 bg-zinc-800 border border-zinc-700 rounded-lg">
            <p>
              É isso aí! <br /> Te vejo no próximo desafio!
            </p>

            <Image
              src={'/images/triangle-balloon-2.svg'}
              width={54}
              height={14}
              alt="balloon"
              className="absolute -left-[54px] bottom-6"
            />
          </div>
        </div>
        <div className="w-full max-w-[400px] flex items-center px-8 py-7 gap-8 bg-card rounded-lg">
          <CheckIcon
            className="min-w-6 min-h-6 text-emerald-400"
            strokeWidth={4}
          />
          <p className="flex flex-1 text-muted-foreground">
            Essa conquista já foi registrada no seu perfil caverna
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-auto">Concluir</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col w-full items-center p-7 gap-6">
              <Image
                src={'/images/logo-icon.svg'}
                alt="Logo"
                width={26}
                height={22}
              />
              <DialogTitle className="text-base font-medium text-center">
                Deseja iniciar um novo Desafio Caverna?
              </DialogTitle>
            </div>
            <DialogFooter className="p-4 border-t">
              <Link href={'/dashboard'}>
                <Button variant="ghost">Deixar para depois</Button>
              </Link>
              <Link href={'/desafio-caverna'}>
                <Button>Iniciar agora</Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
