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
import { useUser } from '@/hooks/queries/use-user'
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
  console.log(params)
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
    select: (orig) => ({
      ...orig,
      modulos: orig.modulos.map((modulo) => {
        if (modulo.modulo_id === 30) {
          const primeiro = modulo.aulas.filter((a) => a.aula_id === 105)
          const restantes = modulo.aulas.filter((a) => a.aula_id !== 105)
          return { ...modulo, aulas: [...primeiro, ...restantes] }
        }
        return modulo
      }),
    }),
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="flex flex-col w-full aspect-[395/166] relative justify-center items-end p-2 pr-4">
                <div className="flex flex-col max-w-80 xl:max-w-52 z-10 gap-3 xl:gap-0">
                  <h1 className="text-lg xl:text-base font-extrabold text-primary">
                    Vista-se como um Lobo Cavernoso!
                  </h1>
                  <p className="text-xs text-black font-semibold py-1">
                    Acesse a loja e garanta um super desconto com o cupom
                    “APLICATIVO”
                  </p>

                  <Link
                    href="https://redirect.lifs.app/loja-mc"
                    target="_blank"
                    className="z-10"
                  >
                    <Button
                      className="w-40 h-8 hover:cursor-pointer hover:bg-red-700 items-center justify-center text-xs"
                      color="primary"
                    >
                      ACESSAR LOJA
                    </Button>
                  </Link>
                </div>

                <Image
                  src={'/images/members-area/banners/cave_store.png'}
                  alt="Cave Store"
                  fill
                />
              </div>
              {![5, 6, 7, 8, 9, 21, 22, 24, 25, 26].includes(
                Number(moduloId),
              ) && (
                <div className="flex flex-col w-full aspect-[395/166] relative justify-center items-end p-2 pr-4 gap-2">
                  <div className="flex flex-col w-80 xl:w-48 relative z-10  gap-3 xl:gap-0">
                    <h1 className="text-lg xl:text-base font-extrabold text-yellow-400">
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

                    {user?.plan === `"TRIAL"` ? (
                      <Link href="/settings/plans">
                        <Button
                          className="w-40 h-8 hover:cursor-pointer hover:bg-red-700 items-center justify-center z-10 text-xs"
                          color={'primary'}
                        >
                          ADQUIRIR
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/indique-e-ganhe">
                        <Button
                          className="w-40 h-8 hover:cursor-pointer hover:bg-red-700 items-center justify-center z-10 text-xs"
                          color={'primary'}
                        >
                          COMECE AGORA
                        </Button>
                      </Link>
                    )}
                  </div>

                  <Image
                    src={'/images/members-area/banners/indique.png'}
                    alt="Cave Store"
                    fill
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col bg-secondary rounded-lg gap-2">
              <p
                className="text-white py-4 px-4 text-normal"
                dangerouslySetInnerHTML={{ __html: lesson.descricao }}
              />
              <LessonMaterial aulaId={lessonId} aula={lesson} />
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
        onClick={() => {
          if (title === 'Acabou, é o fim?') {
            toast.warning('A aula estará disponível dia: 17/04/2025')
          } else {
            toast.warning('Conclua a aula clicando em "Concluir aula".')
          }
        }}
      >
        {watched && <CheckIcon />}
      </div>
    </Link>
  )
}
// eslint-disable-next-line
function LessonMaterial({ aulaId, aula }: { aulaId: string , aula?: Aula }) {

  // MODELO DE MATERIAL PARA ADICIONAR NO FINAL DA DESCRIÇÃO DA AULA NO BANCO DE DADOS NÃO EXCLUIR
  //   const htmlContent = `
  //   <br>
  //   <br>
  // <div style="margin-bottom: 22px; background-color: rgba(255, 51, 51, 0.06); border-radius: 10px; overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease;">
  //   <div style="padding: 15px 20px;">
  //     <a
  //       href="https://api.modocaverna.com/public/storage/materiais_aulas/Ebook_Guia_Pratico_para_definicao_de_um_plano_de_acao.pdf"
  //       target="_blank"
  //       style="display: flex; align-items: center; background-color: rgba(255, 51, 51, 0.8); color: white; padding: 0; border-radius: 8px; font-weight: 500; text-decoration: none; transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12); max-width: 350px; width: 100%; margin: 0 auto;"
  //       onmouseover="this.style.backgroundColor='rgba(255, 51, 51, 0.95)';this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.18)';this.querySelector('.tooltip').style.visibility='visible';this.querySelector('.tooltip').style.opacity='1';this.querySelector('.tooltip').style.transform='translateY(0)';"
  //       onmouseout="this.style.backgroundColor='rgba(255, 51, 51, 0.8)';this.style.transform='';this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.12)';this.querySelector('.tooltip').style.visibility='hidden';this.querySelector('.tooltip').style.opacity='0';this.querySelector('.tooltip').style.transform='translateY(10px)';"
  //       onmousedown="this.style.transform='translateY(1px)';this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.12)';"
  //       onmouseup="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.18)';"
  //     >
  //       <div style="display: flex; justify-content: center; align-items: center; background-color: transparent; width: 56px; height: 56px; flex-shrink: 0; transition: background-color 0.3s ease;">
  //         <svg
  //           style="width: 24px; height: 24px; stroke: white; stroke-width: 2;"
  //           xmlns="http://www.w3.org/2000/svg"
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           stroke="currentColor"
  //           stroke-linecap="round"
  //           stroke-linejoin="round"
  //         >
  //           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
  //           <polyline points="14 2 14 8 20 8"></polyline>
  //           <line x1="12" y1="18" x2="12" y2="12"></line>
  //           <line x1="9" y1="15" x2="15" y2="15"></line>
  //         </svg>
  //       </div>
  //       <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 10px 16px; width: 100%;">
  //         <span style="font-weight: 600; font-size: 14px; color: #18181b; background-color: rgba(255, 255, 255, 0.95); padding: 5px 10px; border-radius: 4px; letter-spacing: 0.4px; margin-bottom: 6px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); display: inline-block; text-align: center; width: 100%;">
  //         GUIA PRÁTICO PARA DEFINIÇÃO DE METAS.PDF
  //         </span>
  //         <span style="font-size: 12px; color: rgba(255, 255, 255, 0.9); font-weight: 500; letter-spacing: 0.5px; transition: padding 0.3s ease; display: flex; align-items: center; justify-content: center; text-align: center;">
  //           CLIQUE AQUI PARA ACESSAR
  //           <span style="content: '→'; margin-left: 6px; font-size: 14px; opacity: 0.8;"></span>
  //         </span>
  //       </div>
  //       <div style="visibility: hidden; width: auto; min-width: 140px; background-color: #18181b; color: #fff; text-align: center; border-radius: 6px; padding: 8px 12px; position: absolute; z-index: 1; bottom: 125%; left: 50%; transform: translateX(-50%) translateY(10px); opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; font-size: 12px; border: 1px solid rgba(255, 51, 51, 0.5); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); pointer-events: none;">
  //       Baixar PDF: GUIA PRÁTICO PARA DEFINIÇÃO DE METAS.PDF
  //         <span style="content: ''; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: rgba(255, 51, 51, 0.5) transparent transparent transparent;"></span>
  //       </div>
  //     </a>
  //   </div>
  // </div>
  // `
  return <></>
}
