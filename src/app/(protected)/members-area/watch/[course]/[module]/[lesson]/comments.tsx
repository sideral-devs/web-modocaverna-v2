'use client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { env } from '@/lib/env'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
  const [imageError, setImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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
  console.log(comment.filhos)
  return (
    <div className="flex flex-col w-full gap-8 ">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          {comment.foto && !imageError ? (
            <div className="rounded-full">
              <Image
                src={`${env.NEXT_PUBLIC_PROD_URL}${comment.foto}`}
                width={50}
                height={50}
                className="rounded-full"
                objectFit="cover"
                objectPosition="center"
                alt="Foto do usuário"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex w-12 h-12 items-center justify-center bg-primary px-3 rounded-full cursor-pointer">
              <span className="text-2xl">{comment.nome[0]}</span>
            </div>
          )}
          <span className="font-semibold pl-2 text-white">{comment.nome}</span>
        </div>
        <span className="text-white">{comment.data}</span>
      </div>
      <div className="w-full pl-6 relative bottom-8">
        {/* <div className={cn('flex  p-2 bg-black w-[600px] h-[200px] overflow-y-scroll scrollbar-minimal rounded-lg')}>
          <p className="font-semibold  pl-8 text-sm text-white break-words break-all overflow-hidden">
            {comment.texto}
          </p>
        </div> */}
        <article
          className={cn(
            'flex p-2 bg-black max-w-2xl max-h-[100px]',
            'overflow-y-auto overflow-x-hidden',
            'scrollbar-minimal rounded-lg',
          )}
          role="comment"
        >
          <p className="font-semibold pl-8 text-sm text-white whitespace-pre-wrap hyphens-auto">
            {comment.texto}
          </p>
        </article>
        {comment.filhos && comment.filhos.length === 0 && (
          <span
            onClick={() => setShowInput(!showInput)}
            className="text-red-600 pl-10 relative top-2 cursor-pointer"
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
              className="mt-2 bg-primary text-white"
              disabled={replyMutation.isPending}
            >
              Enviar
            </Button>
          </div>
        )}
        {comment.filhos && comment.filhos.length > 0 && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="default"
              className="text-red-600 hover:text-red-400 flex items-center gap-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {comment.filhos.length}
              {comment.filhos.length === 1 ? ' resposta' : ' respostas'}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {isExpanded && (
              <div className="pl-8 mt-2 space-y-4">
                {comment.filhos?.map((reply, idx) => (
                  <div key={idx} className="relative top-2 pl-8 mt-2">
                    <div className="flex w-full items-center justify-between">
                      {user.plan === 'ADMIN' ? (
                        <>
                          <div className="flex items-center gap-2 py-4 break-words">
                            <Image
                              src={'/images/members-area/cap-cave.png'}
                              alt={'Admin Caverna'}
                              width={40}
                              height={40}
                            />
                            <div className="flex flex-col bg-primary w-40 items-center justify-center rounded-full h-8">
                              <span className="font-semibold text-white">
                                Capitão Caverna
                              </span>
                            </div>
                          </div>
                          <span className="text-white">{reply.data}</span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 py-4 break-words">
                            {reply?.foto !== null ? (
                              <div className="rounded-full">
                                <Image
                                  src={`${env.NEXT_PUBLIC_PROD_URL}${reply.foto}`}
                                  width={50}
                                  height={50}
                                  className="rounded-full"
                                  objectFit="cover"
                                  objectPosition="center"
                                  alt={reply.nome}
                                />
                              </div>
                            ) : (
                              <div className="flex w-12 h-12 items-center justify-center bg-primary px-3 rounded-full cursor-pointer">
                                <span className="text-2xl">
                                  {reply.nome[0]}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col w-40 items-center justify-center rounded-full h-8">
                              <span className="font-semibold text-white">
                                {reply.nome}
                              </span>
                            </div>
                          </div>
                          <span className="text-white">{reply.data}</span>
                        </>
                      )}
                    </div>
                    <article
                      className={cn(
                        'flex p-2  max-w-2xl max-h-[100px]',
                        'overflow-y-auto overflow-x-hidden',
                        'scrollbar-minimal rounded-lg',
                      )}
                      role="comment"
                    >
                      <p className="font-semibold pl-6 text-sm text-white break-words">
                        {reply.texto}
                      </p>
                    </article>
                    <span
                      onClick={() => setShowInput(!showInput)}
                      className="text-red-600 cursor-pointer mt-2 pl-8"
                    >
                      Responder
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
