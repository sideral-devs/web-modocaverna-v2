'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useBoard } from '@/hooks/queries/use-board'
import { toast } from 'sonner'

interface DeleteColumnButtonProps {
  columnId: number
}

export function DeleteColumnButton({ columnId }: DeleteColumnButtonProps) {
  const { deleteTaskColumn } = useBoard()

  function handleDelete() {
    deleteTaskColumn.mutate(columnId, {
      onSuccess: () => {
        toast.success('Coluna apagada com sucesso')
      },
      onError: () => {
        toast.error('Erro ao apagar coluna')
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300">
          Apagar
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-700">
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar Lista</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja apagar esta lista? Essa ação não pode ser desfeita e você perderá todos os itens que você colocou nela
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
