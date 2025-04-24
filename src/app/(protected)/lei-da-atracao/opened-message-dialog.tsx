'use client'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { AlertTriangleIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { NewLockedMessageEditor } from './new-locked-message-editor'

dayjs.extend(customParseFormat)

export function OpenedMessageDialog({ message }: { message: LockedMessage }) {
  const queryClient = useQueryClient()

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      await api.post(`/locked-messages/open-message/${message.id}`)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['locked-messages'] })
    },
  })

  const { data: content } = useQuery({
    queryKey: ['opened-message', message.id],
    queryFn: async () => {
      const res = await api.get(`/locked-messages/file/${message.id}`)
      return res.data as { conteudo: string }
    },
    enabled: isSuccess || message.status_carta_aberta,
    retry: 2,
    retryDelay: 1500,
  })

  useEffect(() => {
    if (message && message.status_carta_aberta === false) {
      mutate()
    }
  }, [message])

  if (isError) {
    return (
      <DialogContent className="max-h-[85%] max-w-4xl bg-zinc-800 overflow-y-auto scrollbar-minimal">
        <div className="flex flex-col w-full min-h-[700px] flex-1 max-w-2xl items-center p-4 gap-16 mx-auto">
          <AlertTriangleIcon className="text-yellow-400" size={48} />
          <DialogTitle className="w-fit px-3 py-2 border rounded-full text-xs">
            Você ainda não pode abrir essa carta
          </DialogTitle>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-h-[85%] max-w-4xl bg-zinc-800 overflow-y-auto scrollbar-minimal">
      <div className="flex w-full h-fit items-center p-6 gap-2 border-b">
        <DialogTitle className="w-fit px-3 py-2 border rounded-full text-xs">
          Data de abertura
        </DialogTitle>
        <span className="w-fit px-3 py-2 rounded-full text-xs bg-cyan-800 text-cyan-400">
          {dayjs(message.data_abertura).format('DD [de] MMM[,] YYYY')}
        </span>
      </div>
      <div className="flex flex-col w-full min-h-[700px] flex-1 max-w-2xl items-center p-4 gap-16 mx-auto">
        <div className="flex flex-col max-w-md items-center gap-2">
          <h2 className="text-xl font-semibold text-center">
            O seu dia chegou
          </h2>
          <p className="text-xs text-center text-zinc-400">
            É hora de mergulhar na leitura da sua carta do futuro e descobrir as
            surpresas que o destino reservou para você.
          </p>
        </div>
        {message.upload_filepath && (
          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
            <Image
              src={env.NEXT_PUBLIC_PROD_URL + message.upload_filepath}
              alt="Imagem salva"
              className="object-contain"
              fill
            />
          </div>
        )}
        {content ? (
          <NewLockedMessageEditor
            editable={false}
            startingContent={content.conteudo || ''}
          />
        ) : (
          <div className="flex flex-col w-full gap-3">
            <Skeleton className="w-full h-4 bg-zinc-700" />
            <Skeleton className="w-[80%] h-4 bg-zinc-700" />
            <Skeleton className="w-[80%] h-4 bg-zinc-700" />
            <Skeleton className="w-[80%] h-4 bg-zinc-700" />
          </div>
        )}
      </div>
    </DialogContent>
  )
}
