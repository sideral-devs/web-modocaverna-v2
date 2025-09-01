'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardTour } from '@/components/tours/dashboard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'
import { redirect, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { CentralCaverna } from './CentralCaverna'
import { ChatDialog } from './dialogs/ChatDialog'
import { FirstAppearModal } from './FirstAppearModal'
import { CentralHubHeader } from './header'
import { Networking } from './Networking'
import { OrdemNoCaos } from './OrdemNoCaos'
import { TempleForge } from './TempleForge'

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  )
}

function Content() {
  const params = useSearchParams()
  const to = params.get('to')
  const startTour = params.get('startTour')
  const tourRedirect = params.get('tourRedirect')

  const [tab, setTab] = useState(to || 'central-caverna')
  const [activeTour, setActiveTour] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const { data: user } = useUser()

  function getTabTour() {
    switch (tab) {
      case 'ordem-no-caos':
        return localStorage.getItem('doneOrderInChaosTour')
      case 'forja-do-templo':
        return localStorage.getItem('doneTempleForgeTour')
      case 'cursos-e-conhecimentos':
        return localStorage.getItem('doneCoursesTour')

      default:
        return localStorage.getItem('doneDashboardTour')
    }
  }

  function setTabTourDone() {
    switch (tab) {
      case 'ordem-no-caos':
        return localStorage.setItem('doneOrderInChaosTour', 'true')
      case 'forja-do-templo':
        return localStorage.setItem('doneTempleForgeTour', 'true')
      case 'cursos-e-conhecimentos':
        return localStorage.setItem('doneCoursesTour', 'true')

      default:
        return localStorage.setItem('doneDashboardTour', 'true')
    }
  }

  useEffect(() => {
    const doneTour = getTabTour()
    if (startTour === 'true' || doneTour !== 'true') {
      setTimeout(() => {
        setActiveTour(true)
        setTabTourDone()
      }, 500)
    }
  }, [startTour, tab])

  useEffect(() => {
    const opened = localStorage.getItem('chatModalOpened')

    if (
      !opened &&
      user &&
      Number(user.tutorial_complete) &&
      Number(user.login_streak) > 1 &&
      !startTour
    ) {
      setChatModalOpen(true)
      localStorage.setItem('chatModalOpened', 'true')
    }
  }, [user, startTour])

  if (user && !Number(user.tutorial_complete) && !startTour) {
    return redirect('/onboarding')
  }

  if (
    user &&
    user.plan === 'DESAFIO' &&
    (!user.desafio_started_trial ||
      (user.desafio_started_trial &&
        dayjs().isAfter(dayjs(user.desafio_started_trial_at).add(7, 'days'))))
  ) {
    return redirect('/dashboard/desafio')
  }

  return (
    <ProtectedRoute>
      <FirstAppearModal disabled={true} />
      <div className="flex flex-col w-full h-screen items-center py-6 gap-12 relative">
        <CentralHubHeader setTab={setTab} />
        <DashboardTour
          active={activeTour}
          setIsActive={setActiveTour}
          redirect={tourRedirect === 'true'}
          tab={tab}
        />
        <div className="flex w-full flex-1 max-w-7xl min-h-0 p-4 pb-24">
          <Tabs
            defaultValue={to || tab}
            value={tab}
            onValueChange={setTab}
            className="flex flex-col flex-1 w-full h-full gap-5"
          >
            <TabsList
              className="overflow-x-auto min-h-8 data-[tutorial-id=hubs] scrollbar-minimal"
              data-tutorial-id="hubs"
            >
              <TabsTrigger
                value="central-caverna"
                data-tutorial-id="central-caverna"
              >
                Central Caverna
              </TabsTrigger>
              <TabsTrigger
                value="ordem-no-caos"
                data-tutorial-id="ordem-no-caos"
              >
                Ordem no Caos
              </TabsTrigger>
              <TabsTrigger
                value="forja-do-templo"
                data-tutorial-id="forja-do-templo"
              >
                Forja do Templo
              </TabsTrigger>
              <TabsTrigger
                value="cursos-e-conhecimentos"
                data-tutorial-id="cursos-networking"
              >
                Cursos & Networking
              </TabsTrigger>

            </TabsList>
            <CentralCaverna value="central-caverna" />
            <OrdemNoCaos value="ordem-no-caos" />
            <TempleForge value="forja-do-templo" />
            <Networking value="cursos-e-conhecimentos" />

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
