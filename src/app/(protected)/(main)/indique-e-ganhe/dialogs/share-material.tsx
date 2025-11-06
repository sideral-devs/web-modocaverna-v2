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
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export function PublicMapDialogTrigger({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-800 border-zinc-700 overflow-y-auto gap-0 w-[400px] max-h-[75vh] overflow-auto scrollbar-minimal">
        <DialogHeader className=" bg-zinc-800 w-full" color="inherit">
          <DialogTitle>Funis, Fluxos e Scripts</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full bg-zinc-900 gap-2 px-4 py-2 ">
          {/* Página Vendas */}
          <Card className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-xl uppercase text-center">
                Página Vendas
              </p>
              <div className="flex flex-row gap-2 w-full justify-center">
                <a
                  href="https://redirect.lifs.app/tutorial-json"
                  target="_blank"
                >
                  <Button size={'sm'} variant="secondary" className="w-32 text-sm">
                    Como utilizar
                  </Button>
                </a>
                <a
                  href="https://redirect.lifs.app/pag-desafio-af"
                  target="_blank"
                >
                  <Button size={'sm'} className="w-32 text-sm bg-red-600 hover:bg-red-700">
                    Baixar Página
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Fluxo de Many Chat */}
          <Card className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-xl uppercase text-center">
                Fluxo de Many Chat
              </p>
              <div className="flex flex-row gap-2 w-full justify-center">
                <a
                  href="https://redirect.lifs.app/tut-manychat"
                  target="_blank"
                >
                  <Button size={'sm'} variant="secondary" className="w-32 text-sm">
                    Como utilizar
                  </Button>
                </a>
                <a
                  href="https://redirect.lifs.app/manychat"
                  target="_blank"
                >
                  <Button size={'sm'} className="w-32 text-sm bg-red-600 hover:bg-red-700">
                    Baixar Fluxo
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Funil de Quiz */}
          <Card className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-xl uppercase text-center">
                Funil de Quiz
              </p>
              <Link href="https://app.modocaverna.com/members-area/watch/10/37/114">
                <Button size={'sm'} className="w-32 text-sm bg-red-600 hover:bg-red-700">
                  Acessar
                </Button>
              </Link>
            </div>
          </Card>



          {/* Scripts Vendas X1 */}
          <Card className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-xl uppercase text-center">
                Scripts Vendas X1
              </p>
              <Link href="https://redirect.lifs.app/script-x1">
                <Button size={'sm'} className="w-32 text-sm bg-red-600 hover:bg-red-700">
                  Acessar
                </Button>
              </Link>
            </div>
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
