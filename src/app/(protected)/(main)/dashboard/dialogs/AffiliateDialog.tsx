import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

export function AffiliateDialogTrigger({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <AffiliateDialog />
    </Dialog>
  )
}

function AffiliateDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-lg text-center">
          💰 Sabia que usuários como você já faturam R$10 mil só indicando o
          app? E sabe o melhor?
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center p-6 gap-10">
        <p className="text-center">
          Nós ensinamos tudo para que você comece a ganhar também.
        </p>
        <Link href={'/indique-e-ganhe'}>
          <Button className="w-fit uppercase" size="lg">
            Quero ganhar
          </Button>
        </Link>
      </div>
    </DialogContent>
  )
}
