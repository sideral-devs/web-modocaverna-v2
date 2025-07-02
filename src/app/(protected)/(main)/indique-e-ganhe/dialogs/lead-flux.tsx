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

export function LeadFluxDialogTrigger({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Fluxo do Lead</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full gap-3 px-6 py-4 overflow-x-auto scrollbar-minimal">
          <div className="w-full h-[500px] overflow-x-auto">
            <Image
              src="/images/indique-e-ganhe/fluxo-do-lead.jpg"
              alt="Plano de Comissão"
              width={16000}
              height={3000}
              className="h-full w-auto max-w-none"
              objectFit="contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
