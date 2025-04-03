import { ProtectedRoute } from '@/components/protected-route'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CentralCaverna } from './CentralCaverna'
import { Networking } from './Networking'
import { OrdemNoCaos } from './OrdemNoCaos'
import { CentralHubHeader } from './header'

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-screen items-center py-6 gap-12">
        <CentralHubHeader />
        <div className="flex w-full flex-1 max-w-7xl min-h-0 p-4 pb-24">
          <Tabs
            defaultValue="central-caverna"
            className="flex flex-col flex-1 w-full h-full gap-5"
          >
            <TabsList className="overflow-x-auto min-h-fit">
              <TabsTrigger value="central-caverna">Central Caverna</TabsTrigger>
              <TabsTrigger value="ordem-no-caos">Ordem no Caos</TabsTrigger>
              <TabsTrigger value="networking-conhecimento">
                Cursos e Networking
              </TabsTrigger>
            </TabsList>
            <CentralCaverna value="central-caverna" />
            <OrdemNoCaos value="ordem-no-caos" />
            <Networking value="networking-conhecimento" />
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
