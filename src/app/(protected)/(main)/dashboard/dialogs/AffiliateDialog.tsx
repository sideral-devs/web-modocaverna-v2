import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

export function AffiliateDialogTrigger({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <AffiliateDialog />
    </Dialog>
  )
}

function AffiliateDialog() {
  return (
    <DialogContent className="max-w-md">
      <div className="flex flex-col items-center p-8 gap-8">
        <DialogTitle className="text-lg font-bold text-center">
          💰 Sabia que pessoas comuns como você faturam R$10 mil só indicando o
          app?
        </DialogTitle>
        <p className="text-center opacity-80">
          E o melhor? Nós ensinamos tudo para que você comece a ganhar também
        </p>
        <Link href={'/indique-e-ganhe'}>
          <Button className="w-fit uppercase rounded-full pulsating-shadow">
            Quero indicar e ganhar
          </Button>
        </Link>
      </div>
    </DialogContent>
  )
}
