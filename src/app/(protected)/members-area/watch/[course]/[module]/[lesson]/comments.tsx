'use client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'

export function Comments({ lessonId }: { lessonId: string }) {
  const { data: user } = useUser()
  const { data } = useQuery({
    queryKey: ['comments', lessonId],
    queryFn: async () => {
      const res = await api.get('/comentarios/find/' + lessonId)
      return res.data as ComentarioDTO
    },
  })

  return (
    <section id="comments" className="flex flex-col gap-6">
      {data && user
        ? data.comentarios.map((comment, index) => (
            <Comment
              user={user}
              comment={comment}
              key={comment.comentario_id + '-' + index}
              lessonId={lessonId}
            />
          ))
        : Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="w-full h-20" />
          ))}
    </section>
  )
}

function Comment({
  comment,
  user,
  lessonId,
}: {
  comment: Comentario
  user: User
  lessonId: string
}) {
  const queryClient = useQueryClient()
  const [reply, setReply] = useState('')
  const [showInput, setShowInput] = useState(false)

  const replyMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/comentarios/reply/${comment.comentario_id}`, {
        lessonId,
        texto: reply,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lessonId] })
      setReply('')
      setShowInput(false)
    },
  })

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-zinc-400">{comment.nome}</span>
        </div>
        <span className="text-zinc-500">{comment.data}</span>
      </div>
      <div className="w-full pl-4">
        <div className={cn('flex w-full p-4 bg-zinc-800 rounded-lg')}>
          <p className="font-semibold text-zinc-400 break-words break-all overflow-hidden">
            {comment.texto}
          </p>
        </div>
        {user?.plan === 'ADMIN' && (
          <span
            onClick={() => setShowInput(!showInput)}
            className="text-blue-300 cursor-pointer"
          >
            Responder
          </span>
        )}
        {showInput && (
          <div className="mt-2 pl-8">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md"
              placeholder="Digite sua resposta..."
            />
            <Button
              onClick={() => replyMutation.mutate()}
              className="mt-2 bg-blue-500 text-white"
              disabled={replyMutation.isPending}
            >
              Enviar
            </Button>
          </div>
        )}
        {comment.filhos?.map((reply, idx) => (
          <div key={idx} className="pl-8 mt-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 py-4 break-words">
                <Image
                  src={'/images/members-area/cap-cave.png'}
                  alt={'Admin Caverna'}
                  width={40}
                  height={40}
                />
                <span className="font-semibold text-red-500">
                  Capitão Caverna
                </span>
              </div>
              <span className="text-zinc-500">{reply.data}</span>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg">
              <p className="text-zinc-300 break-words break-all overflow-hidden">
                {reply.texto}
              </p>
            </div>
            {user?.plan === 'ADMIN' && (
              <span
                onClick={() => setShowInput(!showInput)}
                className="text-blue-300 cursor-pointer"
              >
                Responder
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
