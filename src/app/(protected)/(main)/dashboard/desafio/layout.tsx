'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardTour } from '@/components/tours/dashboard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/hooks/queries/use-user'
import Link from 'next/link'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'
import { ChatDialog } from '../dialogs/ChatDialog'
import { CentralHubHeader } from './header'

export default function Layout({ children }: PropsWithChildren) {
  const params = useSearchParams()
  const pathname = usePathname()
  const startTour = params.get('startTour')
  const tourRedirect = params.get('tourRedirect')
  const [tab, setTab] = useState('members-area')
  const [chatModalOpen, setChatModalOpen] = useState(false)

  const [activeTour, setActiveTour] = useState(false)
  const { data: user } = useUser()

  useEffect(() => {
    setTab(pathname.split('/')[3])
  }, [pathname])

  useEffect(() => {
    const opened = localStorage.getItem('chatModalOpened')

    if (
      !opened &&
      user &&
      Number(user.tutorial_complete) &&
      Number(user.login_streak) > 1
    ) {
      setChatModalOpen(true)
      localStorage.setItem('chatModalOpened', 'true')
    }
  }, [user])

  if (user && !Number(user.tutorial_complete) && !startTour) {
    return redirect('/onboarding')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-screen items-center py-6 gap-12 relative">
        <CentralHubHeader setTab={setTab} hideTour />
        <DashboardTour
          active={activeTour}
          setIsActive={setActiveTour}
          redirect={tourRedirect === 'true'}
        />
        <div className="flex w-full flex-1 max-w-7xl min-h-0 p-4 pb-24">
          <Tabs
            defaultValue={tab}
            value={tab}
            onValueChange={setTab}
            className="flex flex-col flex-1 w-full h-full gap-5"
          >
            <TabsList className="overflow-x-auto min-h-8 data-[tutorial-id=hubs] scrollbar-minimal">
              <Link href={'/dashboard/desafio/members-area'}>
                <TabsTrigger value="members-area">Comece por aqui</TabsTrigger>
              </Link>
              <Link href={'/dashboard/desafio/desafio-caverna'}>
                <TabsTrigger value="desafio-caverna">
                  Desafio caverna
                </TabsTrigger>
              </Link>
              <Link href={'/dashboard/desafio/indique-e-ganhe'}>
                <TabsTrigger value="indique-e-ganhe">
                  Indique e ganhe
                </TabsTrigger>
              </Link>
            </TabsList>
            {children}
          </Tabs>
        </div>
        <div
          className="w-16 h-16 absolute right-5 bottom-4"
          data-tutorial-id="chat"
        />
        <ChatDialog open={chatModalOpen} setIsOpen={setChatModalOpen} />
      </div>
    </ProtectedRoute>
  )
}
