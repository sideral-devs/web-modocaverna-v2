'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUser } from '@/hooks/queries/use-user'
import { ReactNode } from 'react'
import { toast } from 'sonner'

export function CommissionPlanDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  const { data: user } = useUser()
  const isDesafioPlan = user?.plan === 'DESAFIO'
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[400px] 3xl:max-h-max overflow-y-auto scrollbar-minimal h-auto pe-0 rounded-lg">
        <DialogHeader className=" bg-zinc-800" color="inherit">
          <DialogTitle>Solicite sua afiliação</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full bg-zinc-900 gap-2 px-4 py-2 ">
          <Card className="flex flex-col w-full h-auto justify-center items-center py-4 border border-red-600 ">
            <p className="text-white pb-4 text-lg">
              Cadastro na Plataforma de Vendas
            </p>
            <a
              className=""
              href="https://redirect.lifs.app/cadastro-ticto"
              target="_blank"
            >
              <Button size={'sm'} className="w-52 text-sm">
                Clique aqui
              </Button>
            </a>
          </Card>

          <span className="text-normal text-primary pt-2 flex">
            PRODUTOS DISPONÍVEIS
          </span>
          <Card className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-start gra-4  justify-start">
              <p className="text-white text-bold pb-2 w-full flex justify-center text-2xl uppercase">
                Desafio Caverna
              </p>{' '}
              <div className="flex flex-row jusfity-between   py-1i text-[#ff3333] rounded-lg py-1 my-1 w-fit">
                <p className="text-base opacity-100 text-zinc-400">
                  Comissão inicial:{' '}
                </p>

                <p className="text-extrabold text-base pl-2 mr-2"> 50%</p>
              </div>
              <div className="flex flex-row jusfity-between text-base  text-white w-fit">
                <p className="text-zinc-400">Página de vendas:</p>
                <a
                  className="pl-2 text-primary"
                  href="https://desafio.modocaverna.com/ative"
                  target="_blank"
                >
                  CLIQUE AQUI
                </a>
              </div>
            </div>
            <a
              className="pt-2"
              href="https://desafio.modocaverna.com/ative-af"
              target="_blank"
            >
              <Button size={'sm'} className="w-52 text-sm">
                Solicitar Afiliação
              </Button>
            </a>
          </Card>
          <Card className="flex flex-col gap-2 w-full h-full py-4 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-start justify-center">
              <p className="text-white  text-2xl w-full flex justify-center text text-bold pb-2 uppercase">
                Modo Caverna
              </p>{' '}
              <div className="flex flex-row jusfity-between   py-1i text-[#ff3333] rounded-lg py-1 my-1 w-fit">
                <p className="text-base opacity-100 text-zinc-400">
                  Comissão inicial:{' '}
                </p>

                <p className="text-extrabold text-base pl-2 mr-2"> 50%</p>
              </div>
              <div className="flex flex-col jusfity-between text-base  text-white w-fit">
                <p className="text-zinc-400">
                  Página de vendas:
                  <a
                    className="pl-2 text-primary"
                    // href="https://desafio.modocaverna.com/up-dc/"
                    // target="_blank"
                  >
                    EM BREVE
                  </a>
                </p>
              </div>
            </div>
            {!isDesafioPlan ? (
              <a
                className="pt-2"
                href="https://redirect.lifs.app/cc-afiliacao"
                target="_blank"
              >
                <Button size="sm" className="w-52 text-sm">
                  Solicitar Afiliação
                </Button>
              </a>
            ) : (
              <Button
                size="sm"
                className="w-52 text-sm"
                onClick={() => {
                  toast.warning(
                    'Assine o plano Cavernoso para se afiliar a esse produto',
                  )
                }}
              >
                Solicitar Afiliação
              </Button>
            )}
          </Card>
          <Card className="flex flex-col gap-2 w-full h-full py-4 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-start justify-center">
              <p className="text-white  text-2xl w-full flex justify-center text text-bold  pb-2">
                Loja Seja Caverna
              </p>{' '}
              <div className="flex flex-row justify-between pl-1 text-[#ff3333] rounded-lg py-1 my-1 w-fit">
                <p className="text-base opacity-100 text-zinc-400">
                  Comissão de até
                </p>

                <p className="text-extrabold text-base pl-2 mr-2"> R$ 200,00</p>
              </div>
              <div className="flex flex-col justify-between text-base  text-white w-fit">
                <p className="text-zinc-400">
                  Cadastro na Plataforma:
                  <a
                    className="pl-2 text-primary"
                    href="https://redirect.lifs.app/cad-b4u"
                    target="_blank"
                  >
                    CLIQUE AQUI
                  </a>
                </p>
              </div>
            </div>
            <a
              className="pt-2"
              href="https://redirect.lifs.app/af-loja"
              target="_blank"
            >
              <Button size={'sm'} className="w-52 text-sm">
                Solicitar Afiliação
              </Button>
            </a>
          </Card>
          <div className="bg-yellow-500 flex justify-between  bg-opacity-20 rounded-lg ">
            <div className="flex flex-row items-center justify-center p-4 pe-2 gap-2">
              <p>⚠️</p>
              <span className="text-primary  text-center text-white text-sm ">
                Atenção: Assista às aulas do curso para entender as regras e
                evitar problemas.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
