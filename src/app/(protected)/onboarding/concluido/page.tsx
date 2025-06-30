'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen h-screen lg:h-auto items-center gap-3 lg:gap-6 bg-zinc-900 overflow-x-hidden">
        <div className="flex flex-col relative flex-1 w-full justify-between items-center p-4 py-16 gap-24">
          <div className="flex flex-col items-center w-full max-w-[611px] gap-12">
            <h1 className="text-3xl font-bold">
              Sua jornada começou. Agora é hora de agir
            </h1>
            <div className="flex flex-col w-full gap-4">
              <Card className="flex flex-col relative w-full p-6 gap-4 border border-zinc-700 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-400 uppercase">
                  Seu perfil
                </h2>
                <div>
                  <p className="opacity-80">
                    <strong>Perfil Caverna:</strong> O VISIONÁRIO
                  </p>
                  <p className="opacity-80">
                    <strong>Meta principal definida:</strong> O VISIONÁRIO
                  </p>
                </div>
              </Card>
              <Card className="flex flex-col relative w-full p-6 gap-4 border border-zinc-700 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-400 uppercase">
                  O que você precisa fazer agora
                </h2>
                <div className="flex flex-col w-full gap-2">
                  <div className="w-full flex items-center h-[80px] px-6  gap-6 bg-[#32323280]/50 rounded-lg">
                    <span className="text-red-500">1</span>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Assistir às aulas dos Módulos 1 e 2 na área &quot;Cursos &
                      Conteúdos&quot;
                    </p>
                  </div>
                  <div className="w-full flex items-center h-[80px] p-6 py-4 gap-6 bg-[#32323280]/50 rounded-lg">
                    <span className="text-red-500">2</span>
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Criar seu primeiro desafio caverna
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex justify-center">
              <Link href={'/members-area'}>
                <Button size="lg" className="text-uppercase">
                  🎓 Ir para a área de conteúdos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
