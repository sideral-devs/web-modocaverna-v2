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
import { ReactNode } from 'react'

export function ShareMaterialDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  // const { data: user } = useUser()
  // const isDesafioPlan = user?.plan === 'DESAFIO'
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[400px] 3xl:max-h-max overflow-y-auto scrollbar-minimal h-auto pe-0 rounded-lg">
        <DialogHeader className=" bg-zinc-800" color="inherit">
          <DialogTitle>Materiais de divulgação</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full bg-zinc-900 gap-2 px-4 py-2 ">
          <Card className="flex flex-col w-full h-auto justify-center items-center py-4 border border-red-600 ">
            <p className="text-white pb-4 text-lg">
              Drive com materiais de apoio
            </p>
            <a
              className=""
              href="https://redirect.lifs.app/cadastro-ticto"
              target="_blank"
            >
              <Button size={'sm'} className="w-52 text-sm">
                Clique aqui para acessar
              </Button>
            </a>
          </Card>

          {/* <span className="text-normal text-primary pt-2 flex">
            Fluxo de mensagens do ManyChat
          </span> */}
          <Card className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-start gra-4  justify-start">
              <p className="text-white text-bold pb-2 w-full flex justify-center text-2xl uppercase text-center">
                Fluxo de automação ManyChat
              </p>{' '}
              {/* <div className="flex flex-row jusfity-between text-base  text-white w-fit">
                <p className="text-zinc-400">Clonar fluxo de automação:</p>
                <a
                  className="pl-2 text-primary"
                  href="https://redirect.lifs.app/manychat"
                  target="_blank"
                >
                  CLIQUE AQUI
                </a>
              </div> */}
            </div>
            <a
              className="pt-2"
              href="https://redirect.lifs.app/manychat"
              target="_blank"
            >
              <Button size={'sm'} className="w-52 text-sm">
                Clique para clonar
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
