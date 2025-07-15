'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardTour } from '@/components/tours/dashboard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/hooks/queries/use-user'
import { redirect, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { AreaBeneficios } from './AreaBeneficios'
import { CentralCaverna } from './CentralCaverna'
import PageDialogs from './dialogs/PageDialog'
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

  const [tab, setTab] = useState(to || 'central-caverna')
  const [activeTour, setActiveTour] = useState(false)
  const { data: user } = useUser()

  useEffect(() => {
    // const doneDashboardTour = localStorage.getItem('doneDashboardTour')
    if (startTour === 'true') {
      setActiveTour(true)
      localStorage.setItem('doneDashboardTour', 'true')
    }
  }, [startTour])

  if (user && !Number(user.tutorial_complete) && !startTour) {
    return redirect('/onboarding')
  }

  return (
    <ProtectedRoute>
      <PageDialogs />
      <div className="flex flex-col w-full h-screen items-center py-6 gap-12">
        <CentralHubHeader setTab={setTab} />
        <DashboardTour active={activeTour} setIsActive={setActiveTour} />
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
              <TabsTrigger value="ordem-no-caos">Ordem no Caos</TabsTrigger>
              <TabsTrigger value="forja-do-templo">Forja do Templo</TabsTrigger>
              <TabsTrigger value="cursos-e-conhecimentos">
                Cursos & Networking
              </TabsTrigger>
              <TabsTrigger value="area-de-beneficios">
                Área de Benefícios
              </TabsTrigger>
            </TabsList>
            <CentralCaverna value="central-caverna" />
            <OrdemNoCaos value="ordem-no-caos" />
            <TempleForge value="forja-do-templo" />
            <Networking value="cursos-e-conhecimentos" />
            <AreaBeneficios value="area-de-beneficios" />
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
