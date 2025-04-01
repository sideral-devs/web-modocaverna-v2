import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'

export function Networking({ value }: { value: string }) {
  return (
    <TabsContent value={value} className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[676px] gap-1">
        <Card className="flex flex-col w-full h-full min-h-[600px] md:min-h-80 p-6 gap-6 relative overflow-hidden">
          <CardHeader className="justify-between items-center z-50">
            <div className="flex w-fit px-3 py-2 border border-primary z-50 rounded-full">
              <span className="text-[10px] text-primary font-semibold">
                CURSOS & CONTEÚDOS
              </span>
            </div>
          </CardHeader>

          <div className="absolute left-0 top-0 right-0 aspect-[630/516]">
            <div className="absolute w-full h-full bg-gradient-to-b from-transparent from-[50%] to-card z-10" />
            <Image
              src={'/images/home/cards/cursos-cont.png'}
              alt="Cursos & Conteúdos"
              draggable={false}
              fill
              className="object-cover"
            />
          </div>

          {/* ADICIONADO flex-1 AQUI PARA GARANTIR QUE O TEXTO EMPURRE O BOTÃO PARA BAIXO */}
          <div className="flex flex-col flex-1 justify-end gap-4 z-50">
            <h2 className="text-2xl font-semibold">Cursos & Conteúdos</h2>
            <p className="text-zinc-400 text-sm">
              Desbrave os segredos do Modo Caverna. Aqui, você encontra
              conteúdos exclusivos para desbloquear sua melhor versão. Do foco
              absoluto à alta performance, cada curso é um passo essencial para
              quem busca evolução.
            </p>
          </div>

          {/* Botão de ação */}
          <Link className="ml-auto" href="/members-area">
            <Button size="sm">Ver Cursos</Button>
          </Link>
        </Card>

        <Card className="flex flex-col w-full h-full min-h-[600px] md:min-h-80 p-6 gap-6 relative overflow-hidden">
          <div className="justify-between items-center z-50">
            <div className="flex w-fit px-3 py-2 border border-white rounded-full">
              <span className="text-[10px] text-white font-semibold">
                COMUNIDADE ALCATEIA
              </span>
            </div>
            {/* <Ellipsis className="text-zinc-500" /> */}
          </div>
          <div className="absolute left-0 top-0 right-0 aspect-[630/516]">
            <div className="absolute w-full h-full bg-gradient-to-b from-transparent from-[50%] to-card z-10" />
            <Image
              src={'/images/wolves-community/wolf_pack.png'}
              alt="Comunidade modo caverna"
              draggable={false}
              fill
            />
          </div>
          <div className="flex w-full flex-1" />
          <div className="flex flex-col w-full gap-4">
            <h2 className="text-2xl font-semibold z-10">
              Comunidade <span className="text-primary">Alcateia</span>
            </h2>
            <p className="text-zinc-400 text-sm z-10">
              Você não precisa trilhar essa jornada sozinho. Nossa comunidade
              reúne pessoas que,a assim como você, decidiram sair da
              mediocridade. Compartilhe experiências, aprenda com quem já chegou
              lá e construa sua própria história de superação.
            </p>
          </div>
          <Link className="ml-auto" href="/comunidade">
            <Button size="sm">Acessar</Button>
          </Link>
        </Card>
      </div>
    </TabsContent>
  )
}
