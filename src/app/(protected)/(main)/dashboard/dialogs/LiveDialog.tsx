import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { AlertTriangleIcon } from 'lucide-react'
import Link from 'next/link'

export function LiveDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col p-8 gap-8">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-center">
            <AlertTriangleIcon className="text-card fill-primary" size={32} />
            Oportunidade Exclusiva!
          </DialogTitle>
          <div className="flex flex-col gap-6">
            <p className="opacity-90">
              Já pensou em faturar R$5k, R$10k ou mais por mès apenas indicando
              o Modo Caverna?
            </p>
            <p className="opacity-90">
              <strong className="opacity-100">Quinta-feira</strong> teremos uma{' '}
              <strong className="opacity-100">live fechada</strong> com os
              afiliados ativos, revelando a estratégia completa que já tá dando
              resultado real.
            </p>
            <strong>Quer fazer parte?</strong>
          </div>
          <Link href={'https://redirect.lifs.app/grupo-af'} target="_blank">
            <Button className="w-full uppercase rounded-full pulsating-shadow">
              Entrar no grupo de afiliados
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
