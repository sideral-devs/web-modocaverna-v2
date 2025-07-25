'use client'

import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ course: string }>
}) {
  const { course } = use(params)
  const { data: user } = useUser()
  const { data, isLoading } = useQuery({
    queryKey: ['course', course],
    queryFn: async () => {
      const res = await api.get('/conteudos/show/' + course)
      return res.data as Conteudo
    },
    select: (orig) => ({
      ...orig,
      modulos: [...orig.modulos]
        .map((modulo) => {
          if (modulo.modulo_id === 30) {
            return {
              ...modulo,
              aulas: [...modulo.aulas].sort((a, b) =>
                a.aula_id === 105 ? -1 : b.aula_id === 105 ? 1 : 0,
              ),
            }
          }
          return modulo
        })
        .sort((a, b) => (a.modulo_id === 36 ? -1 : b.modulo_id === 38 ? 1 : 0)),
    }),
  })

  if (
    user?.plan === 'DESAFIO' &&
    !user?.isInTrialDesafio &&
    !data &&
    !isLoading
  ) {
    return (
      <UpgradeModalTrigger>
        <div className="flex w-full h-full flex-1 items-center justify-center"></div>
      </UpgradeModalTrigger>
    )
  }

  if (!data && isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 w-full max-w-8xl px-10 py-16 gap-12">
        <div className="flex flex-col lg:col-span-3 gap-20">
          <section id="video" className="flex flex-col gap-10">
            <Skeleton className="w-full aspect-video" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-full h-5" />
            </div>
            <Skeleton className="w-full h-[267px] rounded-lg" />
          </section>
        </div>
        <div className="flex flex-col lg:col-span-2 gap-4">
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
        </div>
      </div>
    )
  }

  if (!data?.modulos.length || !data?.modulos[0].aulas.length) {
    return (
      <div className="flex w-full h-full flex-1 items-center justify-center">
        <h1 className="text-zinc-400">
          Ainda não temos aulas para esse curso...
        </h1>
      </div>
    )
  }

  return redirect(
    `/dashboard/desafio/members-area/watch/${data.conteudo_id}/${data.modulos[0].modulo_id}/${data.modulos[0].aulas[0].aula_id}`,
  )
}
