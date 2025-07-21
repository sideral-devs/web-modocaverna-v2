'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { ReactNode } from 'react'

export function PublicMapDialogTrigger({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" bg-white overflow-y-auto gap-0  max-w-[55vw] max-h-[75vh] overflow-auto scrollbar-minimal">
        <DialogHeader className=" bg-zinc-800 w-full" color="inherit">
          <DialogTitle>Mapa do Público-Alvo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col  overflow-y-auto">
          <Image
            src="/images/indique-e-ganhe/mapa-publico-alvo.jpeg"
            alt="Plano de Comissão"
            width={1131}
            height={398}
            className="w-full h-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
