'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { VideoPlayer } from '@/components/video-player'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { toast } from 'sonner'
import { LikeButton } from './LikeButton'
import { CommentField } from './comment-field'
import { Comments } from './comments'

export default function Page({
  params,
}: {
  params: Promise<{ course: string; module: string; lesson: string }>
}) {
  const { course, module: moduloId, lesson: lessonId } = use(params)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data } = useQuery({
    queryKey: ['course', course],
    queryFn: async () => {
      const res = await api.get('/conteudos/show/' + course)
      return res.data as Conteudo
    },
  })

  const { data: lesson } = useQuery({
    queryKey: ['lesson', course, moduloId, lessonId],
    queryFn: async () => {
      const res = await api.get('/aulas/show/' + lessonId)
      return res.data as Aula
    },
  })

  const { mutateAsync: finishLessonFn, isPending } = useMutation({
    mutationFn: async () => {
      await api.post('/aula-feedbacks/store', {
        aula_id: lessonId,
        concluido: 'sim',
      })
      queryClient.refetchQueries({
        queryKey: ['lesson', course, moduloId, lessonId],
      })
      queryClient.refetchQueries({
        queryKey: ['course', course],
      })
    },
  })

  async function handleFinishLesson() {
    try {
      await finishLessonFn()
      toast.success('Aula concluída com sucesso!')
    } catch {
      toast.error('Não foi possível concluir a aula!')
    }
  }

  function nextLesson() {
    if (!data) return

    const modulo = data.modulos.find((m) => m.modulo_id === Number(moduloId))
    if (!modulo) return

    const nextLessonIndex =
      modulo.aulas.findIndex((l) => l.aula_id === Number(lessonId)) + 1
    if (nextLessonIndex >= modulo.aulas.length) return

    const nextLesson = modulo.aulas[nextLessonIndex]
    router.push(
      `/members-area/watch/${course}/${moduloId}/${nextLesson.aula_id}`,
    )
  }

  function previousLesson() {
    if (!data) return

    const modulo = data.modulos.find((m) => m.modulo_id === Number(moduloId))
    if (!modulo) return

    const previousLessonIndex =
      modulo.aulas.findIndex((l) => l.aula_id === Number(lessonId)) - 1
    if (previousLessonIndex < 0) return

    const previousLesson = modulo.aulas[previousLessonIndex]
    router.push(
      `/members-area/watch/${course}/${moduloId}/${previousLesson.aula_id}`,
    )
  }

  function canGoPrevious() {
    if (!data) return false

    const modulo = data.modulos.find((m) => m.modulo_id === Number(moduloId))
    if (!modulo) return false

    const previousLessonIndex =
      modulo.aulas.findIndex((l) => l.aula_id === Number(lessonId)) - 1
    return previousLessonIndex >= 0
  }

  function canGoNext() {
    if (!data) return false

    const modulo = data.modulos.find((m) => m.modulo_id === Number(moduloId))
    if (!modulo) return false

    const nextLessonIndex =
      modulo.aulas.findIndex((l) => l.aula_id === Number(lessonId)) + 1
    return nextLessonIndex < modulo.aulas.length
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 w-full max-w-8xl px-10 py-16 gap-12">
      <div className="flex flex-col md:col-span-3 gap-20">
        {data && lesson ? (
          <section id="video" className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <VideoPlayer id={lesson.video} />
              <div className="flex flex-col py-2">
                <h1 className="text-2xl font-semibold">{lesson.titulo}</h1>
              </div>
              <div className="flex w-full items-center justify-between">
                <LikeButton
                  lessonId={lessonId}
                  likes={Number(lesson.like || 0) || 0}
                  userLiked={lesson.aula_feedback?.status === 'like'}
                />
                <div className="flex items-center rounded-full gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-primary rounded-full"
                    onClick={previousLesson}
                    disabled={!canGoPrevious()}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    size="sm"
                    className="h-10 bg-emerald-800 rounded-full"
                    disabled={lesson.aula_feedback?.concluido === 'sim'}
                    onClick={handleFinishLesson}
                    loading={isPending}
                  >
                    Concluir aula
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-primary rounded-full"
                    onClick={nextLesson}
                    disabled={!canGoNext()}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-secondary rounded-lg gap-2">
              <p
                className="text-white py-4 px-4 text-normal"
                dangerouslySetInnerHTML={{ __html: lesson.descricao }}
              />
              <LessonMaterial aulaId={lessonId} />
            </div>
            <CommentField lessonId={lessonId} />
          </section>
        ) : (
          <section id="video" className="flex flex-col gap-10">
            <Skeleton className="w-full aspect-video" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-full h-5" />
            </div>
            <Skeleton className="w-full h-[267px] rounded-lg" />
          </section>
        )}
        <Comments lessonId={lessonId} />
      </div>
      <div className="flex flex-col md:col-span-2 gap-4">
        {data ? (
          <div className="flex w-full gap-4">
            <div className="w-[133px] h-[233px] border rounded-xl overflow-hidden relative">
              {data.titulo === 'MODO CAVERNA' ? (
                <Image
                  src={'/images/members-area/cards/miniatura-mc.webp'}
                  alt={course}
                  className="object-cover object-center"
                  fill
                />
              ) : (
                <Image
                  src={`${env.NEXT_PUBLIC_PROD_URL}${data.banner}`}
                  alt={course}
                  className="object-cover object-center"
                  fill
                />
              )}
            </div>
            <div className="flex flex-col flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-zinc-500 text-sm">
                  {data.modulos.reduce(
                    (acc, modulo) => acc + modulo.aulas.length,
                    0,
                  )}{' '}
                  aulas ·{' '}
                  {(() => {
                    const totalMinutes = data.modulos.reduce((acc, modulo) => {
                      return modulo.aulas.reduce(
                        (acc2, lesson) => acc2 + Number(lesson.duracao),
                        0,
                      )
                    }, 0)

                    const hours = Math.floor(totalMinutes / 60)
                    const minutes = totalMinutes % 60

                    return `${hours}h ${minutes}min`
                  })()}
                </span>
                <h1 className="text-xl">{data.titulo}</h1>
                <span className="text-zinc-500 text-sm mt-2">
                  {data.descricao || ''}
                </span>
              </div>
              <span className="text-zinc-500 text-sm">
                {Math.floor(
                  (data.modulos.reduce((acc, modulo) => {
                    return (
                      acc +
                      modulo.aulas.reduce((acc2, aula) => {
                        return aula.aula_feedback?.concluido === 'sim'
                          ? acc2 + 1
                          : acc2
                      }, 0)
                    )
                  }, 0) /
                    data.modulos.reduce((acc, modulo) => {
                      return acc + modulo.aulas.length
                    }, 0)) *
                    100,
                )}
                % completo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex w-full gap-4">
            <Skeleton className="w-32 h-56" />
            <div className="flex flex-col flex-1 justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-60 h-6" />
                <Skeleton className="w-full h-5" />
              </div>
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        )}
        {data && lesson && (
          <Accordion
            type="single"
            collapsible
            className="flex flex-col w-full gap-4"
            defaultValue={moduloId}
          >
            {data.modulos.map((item) => (
              <AccordionItem
                key={item.modulo_id}
                className="border p-0 rounded-xl"
                value={String(item.modulo_id)}
              >
                <AccordionTrigger className="text-lg font-semibold p-5">
                  {item.titulo}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col p-3 border-t">
                  {item.aulas.map((aula) => (
                    <ClassLink
                      title={aula.titulo}
                      active={aula.aula_id === lesson.aula_id}
                      key={aula.aula_id}
                      watched={aula.aula_feedback?.concluido === 'sim'}
                      href={`/members-area/watch/${course}/${aula.modulo_id}/${aula.aula_id}`}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}

function ClassLink({
  title,
  active,
  href,
  watched,
}: {
  title: string
  active?: boolean
  href: string
  watched?: boolean | undefined
}) {
  return (
    <Link
      className={cn(
        'flex w-full items-center justify-between pl-8 pr-6 py-10 gap-6 rounded-lg',
        active && 'border border-red-800',
      )}
      href={href}
    >
      <span className={cn('flex-1', active || 'text-zinc-500')}>{title}</span>
      <div
        className={cn(
          'hidden lg:flex w-5 h-5 items-center justify-center border-2 rounded-md border-zinc-500',
          active ? 'border-primary' : '',
          watched ? 'border-primary bg-primary' : '',
        )}
      >
        {watched && <CheckIcon />}
      </div>
    </Link>
  )
}

function LessonMaterial({ aulaId }: { aulaId: string }) {
  return (
    <>
      {aulaId === '88' && (
        <div className="flex flex-row gap-4 py-10 ">
          <div className="flex flex-row gap-4">
            <a target="_blank" href="https://acesse.modocaverna.com/regras-af/">
              <Image
                src="/images/cursos-indique-e-ganhe/3_regras_afiliacao_new.jpg"
                alt="Regras de Afiliacao"
                className="rounded-lg"
                width={80}
                height={80}
              />
            </a>
            <a
              target="_blank"
              href="https://dash.ticto.com.br/signup?referrer=PIT33323D35_"
            >
              <Image
                src="/images/cursos-indique-e-ganhe/1_cadastro_ticto_new.jpg"
                alt="Cadastro Ticto"
                width={200}
                height={200}
              />
            </a>

            <a
              target="_blank"
              href="https://api.whatsapp.com/send?phone=557382446098"
            >
              <Image
                src="/images/cursos-indique-e-ganhe/5_gerente_afiliado_new.jpg"
                alt="Gerente Afiliado"
                width={200}
                height={200}
              />
            </a>
            <a
              target="_blank"
              href="https://chat.whatsapp.com/JwJ5EAqZ5iu1kuIzc57ABb"
            >
              <Image
                src="/images/cursos-indique-e-ganhe/6_grupo_whatsapp_new.jpg"
                alt="Grupo WhatsApp"
                width={200}
                height={200}
              />
            </a>
          </div>
        </div>
      )}
      {aulaId === '69' && (
        <div className="flex flex-row gap-4 py-10 ">
          <div className="flex flex-row gap-4">
            <a
              target="_blank"
              href="https://dash.ticto.com.br/invitation/affiliation/P1B997F97"
            >
              <Image
                src="/images/cursos-indique-e-ganhe/7_solicite_afiliacao.jpg"
                alt="Regras de Afiliacao"
                width={200}
                height={200}
              />
            </a>
            <a
              target="_blank"
              href="https://dash.ticto.com.br/invitation/affiliation/PBD94F0EA"
            >
              <Image
                src="/images/cursos-indique-e-ganhe/8_solicite_afiliacao.jpg"
                alt="Cadastro Ticto"
                width={200}
                height={200}
              />
            </a>

            <a target="_blank" href="https://redirect.lifs.app/pv-desafiomc-af">
              <Image
                src="/images/cursos-indique-e-ganhe/5_pagina_de_vendas.jpg"
                alt="Gerente Afiliado"
                width={200}
                height={200}
              />
            </a>
            <a style={{ cursor: 'none' }}>
              <Image
                src="/images/cursos-indique-e-ganhe/9_pagina_de_vendas_em_breve.jpg"
                alt="Grupo WhatsApp"
                width={200}
                height={200}
              />
            </a>
          </div>
        </div>
      )}
      {/* {aulaId === '1' && (
        <div className="flex flex-row gap-4 px-4 py-10 ">
          <a
            target="_blank"
            href="https://loja.iurimeira.com/produto/modocaverna-envelope"
          >
            <Image
              src="/images/banners/banner_envelope.webp"
              alt="Banner Envelope"
              width={200}
              height={200}
              style={{
                position: 'relative',
                left: '0px',
                borderRadius: '10px',
              }}
            />
          </a>
        </div>
      )} */}

      {aulaId === '3' && (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/Checklist_Pre_Caverna.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full h-full px-4 py-[14.55px] bg-[#0F0F0F] rounded-md border border-[#2E2E2E] flex items-center gap-4">
              {/* <div className="w-[30px] h-[40px] flex items-center justify-center">
                <Image
                  src="/icons/archive_formats/pdf.svg"
                  alt="Ícone PDF"
                  width={150}
                  height={150}
                />
              </div> */}
              <div className="flex-1 pl-2 flex flex-col items-start">
                <span className="text-red-500 text-lg">
                  Checklist Pré Caverna
                </span>
              </div>
            </button>
          </a>
        </div>
      )}
      {aulaId === '10' && (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/esse_sou_eu_em.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full h-full px-4 py-[14.55px] bg-[#0F0F0F] rounded-md border border-[#2E2E2E] flex items-center gap-2">
              {/* <div className="w-[30px] h-[40px] flex items-center justify-center">
                <Image
                  src="/icons/archive_formats/pdf.svg"
                  alt="Ícone PDF"
                  layout="fill"
                  objectFit="cover"
                />
              </div> */}
              <div className="flex-1 pl-2 flex flex-col items-start">
                <span className="text-red-500 text-lg">Esse sou eu em...</span>
              </div>
            </button>
          </a>
        </div>
      )}
      {aulaId === '11' && (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/DEFRENTECOMOSEUPIORINIMIGO.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full h-full px-4 py-[14.55px] bg-[#0F0F0F] rounded-md border border-[#2E2E2E] flex items-center gap-2">
              {/* <div className="w-[30px] h-[40px] flex items-center justify-center">
                <Image
                  src="/icons/archive_formats/pdf.svg"
                  alt="Ícone PDF"
                  layout="fill"
                  objectFit="cover"
                />
              </div> */}
              <div className="flex-1 pl-2 flex flex-col items-start">
                <span className="text-red-500 text-lg">
                  De frente com o seu pior inimigo
                </span>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '13' && (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique nos botões abaixo para fazer o download dos materiais da
            aula.
          </p>
          <div className="flex w-full flex-row justify-evenly gap-4">
            <a
              href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/Registro_de_sonhos.pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full h-full px-4 py-[14.55px] bg-[#0F0F0F] rounded-md border border-[#2E2E2E] flex items-center gap-2">
                {/* <div className="w-[30px] h-[40px] flex items-center justify-center">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
                <div className="flex-1 pl-2 flex flex-col items-start">
                  <span className="text-red-500 text-lg">
                    Registro de sonhos
                  </span>
                </div>
              </button>
            </a>

            <a
              href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/DOC04_VÍDEO_DE_REGISTRO.pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full h-full px-4 py-[14.55px] bg-[#0F0F0F] rounded-md border border-[#2E2E2E] flex items-center gap-2">
                <div className="w-[30px] h-[40px] flex items-center justify-center">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-1 pl-2 flex flex-col items-start">
                  <span className="text-red-500 text-lg">
                    Vídeo de registro
                  </span>
                </div>
              </button>
            </a>
          </div>
        </div>
      )}
      {aulaId === '14' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/DEFINASEUSOBJETIVOSEMETAS.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* <div
                  style={{
                    width: '30px',
                    height: '40px',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  paddingLeft: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>
                  Defina seus objetivos e metas
                </div>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '16' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/FLUXOGRAMADEATIVOS.jpg`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* <div
                  style={{
                    width: '30px',
                    height: '40px',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  paddingLeft: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>
                  Fluxograma de ativos
                </div>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '19' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/Checklist_Detox.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* <div
                  style={{
                    width: '30px',
                    height: '40px',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  paddingLeft: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>
                  Detox de redes sociais
                </div>
              </div>
            </button>
          </a>
        </div>
      )}
      {aulaId === '21' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/Fluxograma-Aula-07.png`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* <div
                  style={{
                    position: 'relative',
                    width: '30px',
                    height: '40px',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: 1,
                  paddingLeft: '10px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>Fluxograma</div>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '24' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/Ebook_Guia_Pratico_para_definicao_de_um_plano_de_acao.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* <div
                  style={{
                    position: 'relative',
                    width: '30px',
                    height: '40px',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: 1,
                  paddingLeft: '10px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>Ebook</div>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '28' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/REGRAS_DO_CLUBE_DA_LUTA.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* <div
                  style={{
                    position: 'relative',
                    width: '30px',
                    height: '40px',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: 1,
                  paddingLeft: '10px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>Regras</div>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '30' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'start',
          }}
          className="container-links"
        >
          <p style={{ textAlign: 'left' }}>
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/MAPA_DO_PROGRESSO.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                width: '100%',
                height: '100%',
                paddingTop: '14.55px',
                paddingBottom: '14.55px',
                paddingLeft: '17px',
                paddingRight: '12.12px',
                background: '#0F0F0F',
                borderRadius: '6.06px',
                border: '1px #2E2E2E solid',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* <div
                  style={{
                    position: 'relative',
                    width: '30px',
                    height: '40px',
                  }}
                >
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div
                style={{
                  flex: 1,
                  paddingLeft: '10px',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div style={{ fontSize: '16px', color: 'red' }}>Mapa</div>
              </div>
            </button>
          </a>
        </div>
      )}

      {aulaId === '31' ? (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/MAPA_DO_PUBLICO_ALVO.pdf`}
            target="_blank"
          >
            <button className="w-full h-full py-[14.55px] px-[17px] bg-[#0F0F0F] rounded-[6.06px] border border-[#2E2E2E] flex items-center gap-2">
              <div className="w-[30px] h-[40px] flex flex-col justify-center items-center">
                {/* <div className="w-[30px] h-[40px] relative">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div className="flex-1 pl-[10px] flex flex-col justify-start items-start">
                <div className="text-red-500 text-[16px]">Mapa</div>
              </div>
            </button>
          </a>
        </div>
      ) : null}

      {aulaId === '33' ? (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/PIRAMIDE_DO_PUBLICO_ALVO.pdf`}
            target="_blank"
          >
            <button className="w-full h-full py-[14.55px] px-[17px] bg-[#0F0F0F] rounded-[6.06px] border border-[#2E2E2E] flex items-center gap-2">
              <div className="w-[30px] h-[40px] flex flex-col justify-center items-center">
                {/* <div className="w-[30px] h-[40px] relative">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div className="flex-1 pl-[10px] flex flex-col justify-start items-start">
                <div className="text-red-500 text-[16px]">Pirâmide</div>
              </div>
            </button>
          </a>
        </div>
      ) : null}

      {aulaId === '40' ? (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/OBJECOES.pdf`}
            target="_blank"
          >
            <button className="w-full h-full py-[14.55px] px-[17px] bg-[#0F0F0F] rounded-[6.06px] border border-[#2E2E2E] flex items-center gap-2">
              <div className="w-[30px] h-[40px] flex flex-col justify-center items-center">
                {/* <div className="w-[30px] h-[40px] relative">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div className="flex-1 pl-[10px] flex flex-col justify-start items-start">
                <div className="text-red-500 text-[16px]">Objecoes</div>
              </div>
            </button>
          </a>
        </div>
      ) : null}

      {aulaId === '56' ? (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/EBOOK_10_MIL.pdf`}
            target="_blank"
          >
            <button className="w-full h-full py-[14.55px] px-[17px] bg-[#0F0F0F] rounded-[6.06px] border border-[#2E2E2E] flex items-center gap-2">
              <div className="w-[30px] h-[40px] flex flex-col justify-center items-center">
                {/* <div className="w-[30px] h-[40px] relative">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div className="flex-1 pl-[10px] flex flex-col justify-start items-start">
                <div className="text-red-500 text-[16px]">Ebook</div>
              </div>
            </button>
          </a>
        </div>
      ) : null}

      {aulaId === '83' ? (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/INTRODUCAO_VENDAS_PELO_WHATSAPP.pdf`}
            target="_blank"
          >
            <button className="w-full h-full py-[14.55px] px-[17px] bg-[#0F0F0F] rounded-[6.06px] border border-[#2E2E2E] flex items-center gap-2">
              <div className="w-[30px] h-[40px] flex flex-col justify-center items-center">
                {/* <div className="w-[30px] h-[40px] relative">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div className="flex-1 pl-[10px] flex flex-col justify-start items-start">
                <div className="text-red-500 text-[16px]">Material</div>
              </div>
            </button>
          </a>
        </div>
      ) : null}

      {aulaId === '74' ? (
        <div className="flex flex-col items-start justify-start container-links">
          <p className="text-left">
            Clique no botão abaixo para fazer o download do material da aula.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_PROD_URL}/storage/materiais_aulas/perfilref.pdf`}
            target="_blank"
          >
            <button className="w-full h-full py-[14.55px] px-[17px] bg-[#0F0F0F] rounded-[6.06px] border border-[#2E2E2E] flex items-center gap-2">
              <div className="w-[30px] h-[40px] flex flex-col justify-center items-center">
                {/* <div className="w-[30px] h-[40px] relative">
                  <Image
                    src="/icons/archive_formats/pdf.svg"
                    alt="Ícone PDF"
                    layout="fill"
                    objectFit="cover"
                  />
                </div> */}
              </div>
              <div className="flex-1 pl-[10px] flex flex-col justify-start items-start">
                <div className="text-red-500 text-[16px]">Material</div>
              </div>
            </button>
          </a>
        </div>
      ) : null}
    </>
  )
}
