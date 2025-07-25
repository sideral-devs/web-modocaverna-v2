import {
  CourseSwiperData,
  CourseSwiperIndique,
} from '@/components/course-swiper-indique'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function SellStrategy() {
  const [courses, setCourses] = useState<CourseSwiperData[] | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['courses', 'estrategiasDeVendas'],
    queryFn: async () => {
      const response = await api.get(
        '/conteudos/findCategory/estrategiasDeVendas',
      )
      return response.data as Conteudo[]
    },
  })

  useEffect(() => {
    if (!isFetching && data) {
      const mapped = data.map((item) => ({
        title: item.titulo,
        description: item.descricao || '',
        src: `${env.NEXT_PUBLIC_PROD_URL}${item.banner}`,
        hours: (() => {
          const totalMinutes = item.modulos.reduce((acc, modulo) => {
            return modulo.aulas.reduce(
              (acc2, lesson) => acc2 + Number(lesson.duracao),
              0,
            )
          }, 0)

          return Math.ceil(totalMinutes / 60)
        })(),
        lessons: item.modulos.reduce(
          (acc, modulo) => acc + modulo.aulas.length,
          0,
        ),
        href: `/members-area/watch/${item.conteudo_id}`,
      }))

      setCourses(mapped)
    }
  }, [data, isFetching])
  if (isLoading || isFetching || !courses) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((i, index) => (
          <Skeleton
            key={index}
            className="w-60 xl:w-[calc(30vw-80px)] max-w-80 aspect-[2/3]"
          />
        ))}
      </div>
    )
  }

  return <CourseSwiperIndique data={courses} />
}
