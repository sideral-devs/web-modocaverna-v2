'use client'
import { ProductivityChart } from '@/components/charts/productivity'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TabsContent } from '@/components/ui/tabs'
import { useUser } from '@/hooks/queries/use-user'
import { AlarmClock } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const EventsCard = dynamic(() => import('./cards/events'), {
  loading: () => (
    <Skeleton className="flex w-full h-full min-h-[300px] md:row-span-2" />
  ),
})
const ChallengeCard = dynamic(() => import('./cards/challenge'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
const RitualsCard = dynamic(() => import('./cards/ritual'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})

export function CentralCaverna({ value }: { value: string }) {
  const { data: user } = useUser()

  if (user && !Number(user.tutorial_complete)) {
    return redirect('/onboarding')
  }

  return (
    <TabsContent
      value={value}
      className="data-[state=active]:flex data-[state=active]:flex-1 data-[state=active]:h-full data-[state=active]:min-h-[600px]"
    >
      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 w-full h-full md:min-h-[676px] gap-2">
          <Card className="flex flex-col w-full h-full relative p-[6px] pl-9 pt-11 gap-5 overflow-hidden">
            <h2 className="text-2xl font-semibold">
              Você está há{' '}
              <span className="text-primary">
                {user.login_streak}{' '}
                {Number(user.login_streak) > 1 ? 'dias' : 'dia'}
              </span>{' '}
              {Number(user.login_streak) > 1 ? 'consecutivos' : 'consecutivo'}
            </h2>
            <p className="text-zinc-500 z-50">
              acessando o <span className="text-zinc-400">Modo Caverna</span>
            </p>
            <Image
              className="absolute bottom-0"
              src={
                Number(user.login_streak) > 1
                  ? '/icons/bonfire_cave.svg'
                  : '/icons/dark_cave.svg'
              }
              width={212}
              height={173}
              alt="Caverna"
            />
          </Card>
          <RitualsCard />
          <EventsCard />
          <ChallengeCard />
          <Card className="flex flex-col w-full  min-h-[330px] p-4 gap-5">
            <CardHeader>
              <div className="flex w-fit items-center px-3  py-[7px] gap-[6px] border border-cyan-400 rounded-full">
                <AlarmClock
                  className="text-card py-0"
                  size={16}
                  fill="#22d3ee"
                />
                <span className="text-[10px] pt-[1px] text-cyan-400 font-semibold">
                  FLOW PRODUTIVIDADE
                </span>
              </div>
            </CardHeader>
            <div className="flex flex-1 min-h-0 items-center justify-center">
              <ProductivityChart className="flex-1 max-w-full max-h-full overflow-hidden" />
            </div>
            <Link href="/flow-produtividade" className="ml-auto">
              <Button className="ml-auto min-h-9" size="sm">
                Ativar Flow
              </Button>
            </Link>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 w-full flex-1 md:max-h-[676px] gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-64" />
          ))}
        </div>
      )}
    </TabsContent>
  )
}
