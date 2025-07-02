'use client'
import { NoteEditor } from '@/components/tip-tap/note-editor'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { toast } from 'sonner'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const queryClient = useQueryClient()
  const { id } = use(params)
  const router = useRouter()

  const { data: note, isFetched: noteFetched } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const response = await api.get('/notas/show/' + id)
      return response.data as Note
    },
  })

  const { data: content, isFetched: contentFetched } = useQuery({
    queryKey: ['note-content', id],
    queryFn: async () => {
      const response = await api.get('/notas/file/' + id)
      return response.data as string | null
    },
  })

  const { mutateAsync: deleteNoteFn, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notas/destroy/${id}`)
    },
  })

  async function handleDelete() {
    try {
      await deleteNoteFn(id)
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      router.replace('/anotacoes')
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  if (noteFetched && !note) {
    return (
      <div className="flex flex-col w-full flex-1 items-center p-4 gap-16">
        <p>Nota não encontrada!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full flex-1 items-center p-4 gap-16">
      {note && (
        <header className="flex w-full justify-end">
          <Dialog>
            <DialogTrigger className="flex h-10 items-center px-4 gap-1 bg-[#1D1D1E] border rounded-lg">
              <Trash2Icon size={14} />
              <span className="text-xs">Apagar</span>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col w-[80%] p-7 gap-6">
                <Trash size={32} className="text-primary" />
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg">Tem certeza que deseja apagar?</h2>
                  <p className="text-sm text-zinc-400">
                    Sua nota irá para a lixeira e você poderá recuperá-la em até
                    30 dias
                  </p>
                </div>
              </div>
              <DialogFooter className="p-4 border-t">
                <DialogClose asChild>
                  <Button variant="ghost">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleDelete} loading={isDeleting}>
                  Apagar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
      )}
      {note && contentFetched ? (
        <div className="flex flex-col w-full max-w-3xl h-full">
          <NoteEditor
            startingContent={content || ''}
            documentId={id}
            editable={true}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full max-3xl h-full pt-24 gap-6">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-4/5 h-6" />
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-3/4 h-6" />
        </div>
      )}
    </div>
  )
}
