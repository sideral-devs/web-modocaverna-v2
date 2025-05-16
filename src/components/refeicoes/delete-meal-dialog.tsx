'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Meal } from '@/lib/api/meals'

interface DeleteMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: Meal | null
  onConfirm: () => void
}

export function DeleteMealDialog({
  open,
  onOpenChange,
  meal,
  onConfirm,
}: DeleteMealDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-700">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir refeição</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-4">
          <p className="text-zinc-400">
            Tem certeza que deseja excluir a refeição{' '}
            <span className="text-red-500 font-bold">
              &ldquo;{meal?.nome_refeicao}&rdquo;
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
        </div>
        <AlertDialogFooter className="flex gap-2 justify-end p-4 pt-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
