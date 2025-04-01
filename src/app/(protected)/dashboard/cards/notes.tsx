'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

dayjs.extend(customParseFormat)

export default function NotesCard() {
  const [notesMessages, setNotesMessage] = useState('')
  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }

  const messagesAnotacoes = [
    'Ainda não há anotações. Que tal começar agora? ',
    'Sua área de anotações está vazia. Registre suas ideias.',
    'Nenhuma anotação registrada. Comece a organizar suas ideias.',
    'Nada registrado por enquanto. Que tal adicionar uma nota?',
    'Sua área de anotações está vazia. Registre a primeira agora.',
    'Ainda não há anotações registradas. Vamos começar a organizar suas ideias?',
  ]
  useEffect(() => {
    setNotesMessage(getMessageForTime(messagesAnotacoes))
    setInterval(() => {
      setNotesMessage(getMessageForTime(messagesAnotacoes))
    }, 1200000)
  }, [])
  const { data: notes, isLoading } = useQuery({
    queryKey: ['folders-mapped'],
    queryFn: async () => {
      const response = await api.get('/pastas/find')
      const folders = response.data as Folder[]

      return folders.flatMap((folder) =>
        folder.notas.map((note) => ({
          ...note,
          nome_pasta: folder.nome,
        })),
      )
    },
  })

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] p-4 gap-6">
      <CardHeader>
        <Link href="/anotacoes">
          <div className="flex w-fit px-3 py-2 border border-white rounded-full">
            <span className="text-[10px] text-white font-semibold">
              ANOTAÇÕES
            </span>
          </div>
        </Link>
      </CardHeader>
      <div className="flex flex-col w-full flex-1 px-6 overflow-y-scroll no-scrollbar">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex w-full p-4 gap-3 border-b border-b-zinc-700"
            >
              <Skeleton className="bg-zinc-900 w-7 h-8 rounded" />
              <div className="flex flex-col gap-2">
                <Skeleton className="bg-zinc-900 w-32 h-3" />
                <Skeleton className="bg-zinc-900 w-48 h-2" />
              </div>
            </div>
          ))
        ) : notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="flex w-full p-4 gap-3 border-b border-b-zinc-700"
            >
              <Link href={`/anotacoes/d/${note.id}`}>
                <Image
                  src={'/images/home/cards/paper.svg'}
                  width={26}
                  height={33}
                  className="rounded"
                  alt="Ir até página"
                  draggable={false}
                />
              </Link>
              <div className="flex flex-col gap-2">
                <Link href={`/anotacoes/d/${note.id}`}>
                  <p className="text-xs">
                    {note.nome || note.descricao || 'Sem título'}
                  </p>
                </Link>
                <span className="text-[10px] text-zinc-500">
                  {(() => {
                    const now = dayjs()
                    const updatedAt = dayjs(
                      note.updated_at,
                      'HH:mm:ss DD/MM/YYYY',
                    ).subtract(3, 'hours')
                    const diffInMinutes = now.diff(updatedAt, 'minute')

                    if (diffInMinutes < 60)
                      return `${diffInMinutes} minutos atrás`

                    const diffInHours = now.diff(updatedAt, 'hour')
                    if (diffInHours < 24) return `${diffInHours} horas atrás`

                    const diffInDays = now.diff(updatedAt, 'day')
                    return `${diffInDays} dias atrás`
                  })()}
                  · {note.nome_pasta}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-row items-center justify-center flex-1 gap-4 w-full">
            <Image
              src="/images/empty-states/empty_dream_board.png"
              alt="Nenhum objetivo encontrado"
              width={100}
              height={110}
              className="opacity-50"
            />
            <div className="flex flex-col gap-4 w-[40dvh]">
              <p className="text-center text-[13px] text-zinc-500">
                {notesMessages}
              </p>
            </div>
          </div>
        )}
      </div>
      <Link className="ml-auto" href="/anotacoes">
        <Button className="block" size="sm">
          Abrir Anotações
        </Button>
      </Link>
    </Card>
  )
}
