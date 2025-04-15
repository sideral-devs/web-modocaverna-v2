'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function KnowledgeCard() {
  const [selected, setSelected] = useState('books')

  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get('/videos/find')
      return response.data as Video[]
    },
  })

  const { data: cursos } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/cursos/find')
      return response.data as Course[]
    },
  })

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await api.get('/livros/find')
      return response.data as Book[]
    },
  })
  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] p-4 gap-6">
      <CardHeader className="h-[34px] justify-between items-center">
        <div className="flex w-fit px-3 py-2 border border-white rounded-full">
          <span className="text-[10px] text-white font-semibold">
            FONTES DE CONHECIMENTO
          </span>
        </div>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-fit flex py-1 px-6  border rounded-full text-xs">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className="text-xs text-white font-semibold"
              value="books"
            >
              Livros
            </SelectItem>
            <SelectItem
              className="text-xs text-white font-semibold"
              value="cursos"
            >
              Cursos
            </SelectItem>
            <SelectItem
              className="text-xs text-white font-semibold"
              value="videos"
            >
              Vídeos
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <div className="grid grid-cols-3 md:grid-cols-3 w-full flex-1 gap-4">
        {selected === 'books' && books ? (
          books.length > 0 ? (
            books
              .slice(0, 3)
              .map((book) => <KnowledgeContent data={book} key={book.id} />)
          ) : (
            <EmptyState type="book" />
          )
        ) : selected === 'videos' && videos ? (
          videos.length > 0 ? (
            videos
              .slice(0, 3)
              .map((video) => <KnowledgeContent data={video} key={video.id} />)
          ) : (
            <EmptyState type="video" />
          )
        ) : selected === 'cursos' && cursos ? (
          cursos.length > 0 ? (
            cursos
              .slice(0, 3)
              .map((curso) => <KnowledgeContent data={curso} key={curso.id} />)
          ) : (
            <EmptyState type="curso" />
          )
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full aspect-[17/25] md:aspect-auto md:h-full bg-zinc-900"
            />
          ))
        )}
      </div>

      <Link className="ml-auto" href="/conhecimento">
        <Button size="sm">Organizar</Button>
      </Link>
    </Card>
  )
}

function KnowledgeContent({
  data = {},
}: { data?: { capa?: string | null } } = {}) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="flex flex-col justify-between w-full relative aspect-[17/25] md:aspect-auto md:h-full rounded-lg">
      {data.capa && !imageError ? (
        <Image
          src={
            data.capa.startsWith('https')
              ? data.capa
              : env.NEXT_PUBLIC_PROD_URL + data.capa
          }
          alt="Capa do conteúdo"
          className="object-cover object-center rounded-lg"
          fill
          onError={() => setImageError(true)}
        />
      ) : (
        <Image
          src="/images/empty-book1.png"
          alt="Imagem de placeholder"
          className="object-cover object-center rounded-lg"
          fill
        />
      )}
    </div>
  )
}

function EmptyState({ type }: { type: string }) {
  const messagesLivros = [
    'Ainda não há livros. Que tal começar agora?',
    'Sua biblioteca está vazia. Vamos adicionar o primeiro livro.',
    'Nenhum livro registrado. Inicie sua organização de leitura.',
    'Sua coleção está vazia. Comece a adicionar livros.',
    'Nada por aqui. Que tal adicionar um livro para começar?',
    'Você ainda não adicionou nenhum livro. Que tal começar agora?',
  ]

  const messagesCursos = [
    'Ainda não há cursos registrados. Que tal adicionar o primeiro curso?',
    'Sua área de cursos está vazia. Adicione um curso para iniciar.',
    'Nenhum curso registrado. Comece com o primeiro curso.',
    'Nada registrado por aqui. Adicione um curso e comece a explorar.',
    'Você ainda não adicionou nenhum curso. Que tal começar agora?',
  ]
  const messagesVideos = [
    'Ainda não há vídeos registrados. Adicione o primeiro para começar.',
    'Sua área de vídeos está vazia. Que tal começar com o primeiro?',
    'Nenhum vídeo registrado ainda. Comece com o primeiro vídeo.',
    'Nada registrado por aqui. Adicione um vídeo e comece a explorar.',
    'Você ainda não adicionou nenhum vídeo. Vamos começar?',
  ]

  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }

  const [livrosMessage, setLivrosMessage] = useState('')
  const [cursosMessage, setCursosMessage] = useState('')
  const [videosMessage, setVideosMessage] = useState('')

  useEffect(() => {
    // Set initial messages based on the time of day
    setLivrosMessage(getMessageForTime(messagesLivros))
    setCursosMessage(getMessageForTime(messagesCursos))
    setVideosMessage(getMessageForTime(messagesVideos))

    // Update messages every 20 minutes
    setInterval(() => {
      setLivrosMessage(getMessageForTime(messagesLivros))
      setCursosMessage(getMessageForTime(messagesCursos))
      setVideosMessage(getMessageForTime(messagesVideos))
    }, 1200000) // 20 minutes
    // Clean up the interval on component unmount
  }, [])
  const emptyImages: Record<string, string> = {
    book: '/images/empty-states/empty_books.png',
    video: '/images/empty-states/empty_videos.png',
    curso: '/images/empty-states/empty_courses.png',
  }
  const emptyMessages: Record<string, string> = {
    book: livrosMessage,
    video: cursosMessage,
    curso: videosMessage,
  }
  return (
    <div className="flex flex-row items-center justify-start flex-1 pl-10 gap-4 w-[60dvh] md:w-[36dvh] md:pl-0">
      <Image
        src={emptyImages[type]}
        alt={emptyMessages[type]}
        width={100}
        height={110}
        className="opacity-50"
      />
      <div className="flex flex-col gap-4 w-[40dvh]">
        <p className="text-center text-[13px] text-zinc-500">
          {emptyMessages[type] || 'Nenhum conteúdo disponível'}
        </p>
      </div>
    </div>
  )
}
