'use client'

import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function MembersAreaHeader() {
  const pathName = usePathname()
  const router = useRouter()

  const { data: businessCourses } = useQuery({
    queryKey: ['courses', 'marketingDigital'],
    queryFn: async () => {
      const response = await api.get('/conteudos/findCategory/marketingDigital')
      return response.data as Conteudo[]
    },
  })

  const pathId = pathName?.split('/watch/')[1]
  const lessonId = pathId?.split('/')[0]

  const isBusinessCourse = businessCourses?.some(
    (course) => course.conteudo_id === Number(lessonId),
  )

  return (
    <Header>
      {pathName.includes('/watch') ? (
        isBusinessCourse ? (
          <Button
            variant="outline"
            className="w-12 h-12 rounded-xl border text-primary"
            onClick={() => router.push('/members-area')}
          >
            <ChevronLeft />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-12 h-12 rounded-xl border text-primary"
            onClick={() => router.push('/indique-e-ganhe')}
          >
            <ChevronLeft />
          </Button>
        )
      ) : (
        <HeaderTitle title="CONTEÚDOS" />
      )}
      <Link href="/dashboard?tab=central-caverna">
        <Image src="/images/logo.svg" alt="Logo" width={132} height={35} />
      </Link>
      {isBusinessCourse ? (
        <HeaderClose to="cursos-e-conhecimentos" />
      ) : (
        <HeaderClose pushTo="/indique-e-ganhe" />
      )}
    </Header>
  )
}
