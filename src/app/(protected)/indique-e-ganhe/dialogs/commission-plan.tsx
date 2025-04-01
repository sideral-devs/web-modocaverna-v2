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

export function CommissionPlanDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white max-w-[40vw] max-h-[60vh] overflow-auto">
        <DialogHeader className="pr-10 bg-zinc-800" color="inherit">
          <DialogTitle>Plano de Comissão</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full gap-3 px-6 py-4">
          <Image
            src="/images/indique-e-ganhe/comissionamento.png"
            alt="Plano de Comissão"
            width={740}
            height={260}
            className="w-full h-auto max-w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
