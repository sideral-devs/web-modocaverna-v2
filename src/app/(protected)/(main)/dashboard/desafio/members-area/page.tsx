'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PlayIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { CourseSwiperData } from '@/components/course-swiper'
import { ExpiredPlanPopup } from '@/components/modals/ExpiredPlanPopup'
import { MembersAreaTour } from '@/components/tours/members-area'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { env } from '@/lib/env'

export default function Page() {
  const [courses, setCourses] = useState<CourseSwiperData[] | null>(null)
  const [expiredPlanOpen, setExpiredPlanOpen] = useState(true)
  const [activeTour, setActiveTour] = useState(false)
  const { data: user } = useUser()
  const searchParams = useSearchParams()
  const startTour = searchParams.get('startTour')
  const tourRedirect = searchParams.get('tourRedirect')

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/conteudos/find')
      return response.data as Conteudo[]
    },
  })

  useEffect(() => {
    if (data) {
      const mapped = data.map((item) => ({
        title: item.titulo,
        description: item.descricao || '',
        src: `${env.NEXT_PUBLIC_PROD_URL}${item.banner}`,
        hours: (() => {
          if (!item.modulos) return 0

          const totalMinutes = item.modulos.reduce((acc, modulo) => {
            if (!modulo.aulas) return acc
            return (
              acc +
              modulo.aulas.reduce(
                (acc2, lesson) => acc2 + Number(lesson.duracao || 0),
                0,
              )
            )
          }, 0)

          return Math.ceil(totalMinutes / 60)
        })(),
        lessons: item.modulos
          ? item.modulos.reduce(
              (acc, modulo) => acc + (modulo.aulas?.length || 0),
              0,
            )
          : 0,
        href: `/members-area/watch/${item.conteudo_id}`,
        category: item.categoria,
        disabled: !item.disponivel,
      }))

      setCourses(mapped)
    }
  }, [data])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const doneTour = window.localStorage.getItem('doneMembersAreaTour')
    if (startTour === 'true' || doneTour !== 'true') {
      const timer = setTimeout(() => {
        setActiveTour(true)
        window.localStorage.setItem('doneMembersAreaTour', 'true')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [startTour])

  if (user?.status_plan === 'EXPIRADO') {
    return (
      <ExpiredPlanPopup open={expiredPlanOpen} setOpen={setExpiredPlanOpen} />
    )
  }
  if (isLoading) {
    return <Skeleton className="w-full h-[573px] 2xl:h-[calc(100vw/32*9)]" />
  }

  return (
    <div
      className="flex flex-col w-full max-w-8xl pb-16 gap-14 "
      data-tutorial-id="members-catalog"
    >
      <MembersAreaTour
        active={activeTour}
        setIsActive={setActiveTour}
        redirect={tourRedirect === 'true'}
      />
      {courses && courses.length > 0 ? (
        <div className="w-full max-w-full py-4 ">
          <div
            className="grid grid-cols-1 xl:grid-cols-2 w-full max-w-full h-85 xl:aspect-[14/5] rounded-2xl overflow-hidden"
            data-tutorial-id="members-hero"
          >
            <div className="flex flex-col items-center justify-center p-4 gap-12 bg-zinc-800">
              <div className="flex flex-col items-center gap-8">
                <span className="text-sm text-center text-zinc-300">
                  {courses[0].lessons} aulas • {courses[0].hours} horas
                </span>
                <h1 className="font-semibold text-[3rem] lg:text-[3.5rem] text-center">
                  Modo Caverna
                </h1>
                <div className="w-9 h-[2px] bg-white" />
                <p className="max-w-60 text-sm text-center text-zinc-300">
                  Tome o controle e mude o rumo de sua vida agora mesmo!
                </p>
              </div>
              <Link
                href={`/dashboard/desafio/${courses[0].href}`}
                data-tutorial-id="members-watch-button"
              >
                <Button>
                  <PlayIcon fill="#fff" />
                  Assistir agora
                </Button>
              </Link>
            </div>
            <div className="w-full h-full relative">
              <Image
                src={'/images/members-area/modocaverna.jpg'}
                alt="Modo Caverna"
                className="object-cover object-right"
                sizes="50vw"
                fill
              />
            </div>
          </div>
        </div>
      ) : (
        <Skeleton className="w-full h-[573px] 2xl:h-[calc(100vw/32*9)" />
      )}
      {/* <section className="flex flex-col w-full px-4 gap-6 2xl:gap-8">
        <h2 className="text-xl 2xl:text-[1.75rem] font-semibold">
          Desenvolvimento pessoal
        </h2>
        <PersonalDevelopment
          courses={courses
            ?.filter((item) => item.category === 'desenvolvimentoPessoal')
            .slice(1)}
        />
      </section> */}
    </div>
  )
}
