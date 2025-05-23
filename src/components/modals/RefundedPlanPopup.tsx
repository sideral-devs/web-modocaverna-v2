import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
export function RefundedPlanPopup({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[408px] gap-10 border-t-4 border-t-primary sm:rounded-2xl">
        <Image
          src={'/images/home/mockup-modo-caverna.png'}
          width={350}
          height={195}
          className="w-full h-auto"
          alt="Imagens modo caverna"
        />
        <h1 className="text-xl font-semibold">
          Seu Plano Modo Caverna foi Reembolsado
        </h1>
        <ul className="flex flex-col gap-6">
          <li className="flex items-center gap-4">
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm">Acesso a todas as funcionalidades</span>
          </li>
          <li className="flex items-center gap-4">
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm">Acesso a todas os Cursos</span>
          </li>
          <li className="flex items-center gap-4">
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm">Suporte Priorizado</span>
          </li>
        </ul>
        <div className="flex flex-col w-full gap-2">
          <Link
            className="flex flex-col justify-center w-lg"
            href="/settings/plans"
          >
            <Button>Renovar Agora</Button>
          </Link>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
