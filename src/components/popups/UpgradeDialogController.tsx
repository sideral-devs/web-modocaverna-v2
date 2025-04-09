// components/popups/UpgradeDialogController.tsx
'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/ui/alert-dialog'
import { usePopupDesafio } from '@/store/usePopupDesafio'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function UpgradeDialogController() {
  const isVisible = usePopupDesafio((state) => state.isVisible)
  const hide = usePopupDesafio((state) => state.hide)
  console.log('dentor do modal', isVisible)
  // Apenas renderiza o modal se for visível
  if (!isVisible) return null

  return (
    <AlertDialog open={isVisible} onOpenChange={(open) => !open && hide()}>
      <AlertDialogContent className="max-w-[408px] gap-10 border-t-4 border-t-primary sm:rounded-2xl">
        <Image
          src={'/images/home/mockup-modo-caverna.png'}
          width={350}
          height={195}
          className="w-full h-auto"
          alt="Imagens modo caverna"
        />
        <h1 className="text-xl font-semibold">Upgrade Modo Caverna</h1>
        <ul className="flex flex-col gap-6">
          <li className="flex items-center gap-4">
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm">Acesso a todas as funcionalidades</span>
          </li>
          <li className="flex items-center gap-4">
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm">Acesso a todos os Cursos</span>
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
            <Button>Desbloquear Funcionalidades</Button>
          </Link>
          <AlertDialogCancel>Voltar à navegação</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
