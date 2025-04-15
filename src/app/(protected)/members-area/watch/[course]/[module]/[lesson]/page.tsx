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
import { useUser } from '@/hooks/queries/use-user'

export default function Page({
  params,
}: {
  params: Promise<{ course: string; module: string; lesson: string }>
}) {
  const { course, module: moduloId, lesson: lessonId } = use(params)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: user } = useUser()
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
            <div className="flex flex-row w-full justify-between">
              <div
                className=" h-[165px] w-[385px] rounded-lg flex flex-col items-end p-2 pr-6"
                style={{
                  backgroundImage:
                    "url('/images/members-area/banners/cave_store.png')",
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
              >
                <div className="flex flex-col w-1/2 pt-2 ">
                  <h1 className="text-l font-extrabold text-primary">
                    Vista-se como um Lobo Cavernoso!
                  </h1>
                  <p className="text-xs text-black font-semibold py-1">
                    Acesse a loja e garanta um super desconto com o cupom
                    “APLICATIVO”
                  </p>
                </div>
                <div>
                  {/* <a href="https://redirect.lifs.app/loja-mc" target="_blank"> */}
                  <Button
                    className="w-[170px] mt-2 h-[36px] hover:cursor-pointer  hover:bg-red-700 items-center justify-center"
                    color={'primary'}
                    disabled
                  >
                    EM BREVE
                  </Button>
                  {/* </a> */}
                </div>
              </div>
              {![5, 6, 7, 8, 9, 21, 22, 24, 25, 26].includes(
                Number(moduloId),
              ) && (
                <div
                  className="w-[385px] h-[165px] rounded-lg flex flex-col items-end p-2 pr-6"
                  style={{
                    backgroundImage:
                      "url('/images/members-area/banners/indique.png')",
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="flex flex-col w-48 relative left-4  ">
                    <h1 className="text-base font-extrabold text-yellow-400">
                      Faça parte do nosso programa de afiliados.
                    </h1>
                    {user?.plan === `"TRIAL"` ? (
                      <p className="text-xs text-white font-semibold py-2">
                        Adquira agora o Modo Caverna e comece a ganhar
                        comissões.
                      </p>
                    ) : (
                      <p className="text-xs text-white font-semibold py-2">
                        Ganhe comissões generosas indicando o Modo Caverna.
                      </p>
                    )}
                  </div>
                  <div>
                    {user?.plan === `"TRIAL"` ? (
                      <Link href="/settings/plans">
                        <Button
                          className="w-[170px] max-h-[36px] mt-3  hover:cursor-pointer hover:bg-red-700 items-center justify-center"
                          color={'primary'}
                        >
                          ADQUIRIR
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/indique-e-ganhe">
                        <Button
                          className="w-[170px] max-h-[36px] mt-3  hover:cursor-pointer hover:bg-red-700 items-center justify-center"
                          color={'primary'}
                        >
                          COMECE AGORA
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
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
        onClick={() =>
          toast.warning('Conclua a aula clicando em "Concluir aula".')
        }
      >
        {watched && <CheckIcon />}
      </div>
    </Link>
  )
}
// eslint-disable-next-line
function LessonMaterial({ aulaId }: { aulaId: string }) {
  return <></>
}
