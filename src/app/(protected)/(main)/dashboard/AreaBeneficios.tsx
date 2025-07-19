import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { RankingWidgetClean } from '@/components/ranking/ranking-widget-clean'
import Link from 'next/link'

export function AreaBeneficios({ value }: { value: string }) {
  return (
    <TabsContent value={value} className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[676px] gap-2">
        <div className="w-full h-full md:min-h-80">
          <RankingWidgetClean />
        </div>

        <Card
          className="flex flex-col w-full h-full md:min-h-80 p-6 gap-6 relative overflow-hidden border border-t-zinc-500"
          // style={{
          //   backgroundImage: "url('/images/card-frames/frame_esquerda.png')",
          //   backgroundPosition: 'center',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundSize: 'FIT',
          // }}
        >
          <CardHeader>
            <div className="flex w-fit px-3 py-2 border border-white rounded-full z-50">
              <span className="text-[10px] text-white font-semibold">
                INDIQUE & GANHE
              </span>
            </div>
          </CardHeader>
          <div
            className="absolute right-1 bottom-5 w-full h-full"
            style={{
              backgroundImage: "url('/images/card-frames/indiqueganhe.png')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'FIT',
            }}
          ></div>
          {/* <Image
            src={'/images/card-frames/frame_esquerda.png'}
            alt="Treinos"
            width={800}
            height={676}
          /> */}

          <div className=" absolute bottom-20 flex pe-12 flex-col w-full gap-4">
            <h2 className="text-2xl font-semibold  z-10">Indique & Ganhe</h2>
            <p className="text-zinc-400  text-sm z-10">
              Aprenda, com aulas práticas, materiais e lives exclusivas, a
              aplicar nossas estratégias validadas. Descubra como indicar o Modo
              Caverna com inteligência, gerar impacto e ser recompensado por
              cada nova indicação.
            </p>
          </div>
          <div className="flex flex-col absolute  bottom-[6px] right-[6px]  p-4 z-10">
            <Link className="ml-auto" href="/indique-e-ganhe">
              <Button size="sm">Acessar</Button>
            </Link>
          </div>
        </Card>
      </div>
    </TabsContent>
  )
}
