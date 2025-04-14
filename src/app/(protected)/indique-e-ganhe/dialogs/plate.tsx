'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export function PlateDialogTrigger({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85%] max-w-2xl bg-zinc-900 overflow-y-auto scrollbar-minimal">
        <DialogHeader>
          <DialogTitle>Placas de Reconhecimento</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full items-center px-8 py-8 gap-8 overflow-y-auto">
          <div className="flex w-full items-center gap-4">
            <Image
              src="/images/indique-e-ganhe/placas/placa-10k.png"
              alt="Plano de Comissão"
              width={189}
              height={291}
              className="w-full h-auto"
            />
            <Image
              src="/images/indique-e-ganhe/placas/placa-50k.png"
              alt="Plano de Comissão"
              width={189}
              height={291}
              className="w-full h-auto"
            />
            <Image
              src="/images/indique-e-ganhe/placas/plca-100k.png"
              alt="Plano de Comissão"
              width={189}
              height={291}
              className="w-full h-auto"
            />
          </div>
          <p className="max-w-lg">
            Estamos ansiosos para reconhecer as suas primeiras conquistas como
            afiliado do Modo Caverna. Ao atingir os valores acima, entre em
            contato com o Gerente para receber a sua placa em casa!
          </p>
          <Link
            href={
              'https://api.whatsapp.com/send?phone=5573982446098&text=Ol%C3%A1%2C+sou+afiliado+do+Modo+Caverna+e+gostaria+de+solicitar+minha+placa+de+reconhecimento.&_fb_noscript=1'
            }
            target="_blank"
          >
            <Button>Solicitar Placa</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
