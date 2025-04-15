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
import { ReactNode } from 'react'

export function CommissionPlanDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[400px] overflow-y-hidden h-auto pe-0 rounded-lg">
        <DialogHeader className=" bg-zinc-800" color="inherit">
          <DialogTitle>Solicite sua afiliação</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full bg-zinc-900 gap-2 px-4 py-2">
          <Card className="flex flex-col w-full h-auto justify-center items-center  border border-red-600 ">
            <p className="text-white text-sm py-4">
              Cadastro na Plataforma de Vendas
            </p>
            <a className="p-2" href="https://redirect.lifs.app/cadastro-ticto">
              <Button size={'sm'}>Clique aqui</Button>
            </a>
          </Card>

          <span className="text-normal text-primary pt-2">
            PRODUTOS DISPONÍVEIS
          </span>

          <Card className="flex flex-col w-full h-full  gap-2 justify-center items-center bg-[#2a2a2a]">
            <div className="flex  flex-col items-center gra-4  justify-center">
              <div className="flex flex-col items-center justify-center mt-4 mb-2 w-[40px] h-[28px] bg-black  rounded-lg py-5 px-1 ">
                <Image
                  src="/images/logo-icon.svg"
                  alt="Plano de Comissão"
                  width={25}
                  height={10}
                  color="#fff"
                ></Image>
              </div>
              <div className="flex flex-row jusfity-between   py-1i bg-red-500/15 text-[#ff3333] rounded-lg py-1 w-fit">
                <p className="ml-2 text-xs opacity-100">Comissão inicial: </p>

                <p className="text-extrabold text-xs pl-2 mr-2"> 50%</p>
              </div>
              <p className="text-white text-sm  text-bold p-4 pb-2">
                Desafio Modo Caverna
              </p>{' '}
              <div className="flex flex-row jusfity-between text-xs  text-white w-fit">
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
              className="p-2"
              href="https://redirect.lifs.app/mc-afiliacao"
              target="_blank"
            >
              <Button size={'sm'}>Solicitar Afiliação</Button>
            </a>
          </Card>

          <Card className="flex flex-col gap-4 w-full h-full justify-center items-center bg-[#2a2a2a]">
            <div className="flex  flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center mt-4 mb-2 w-[40px] h-[28px] bg-white  rounded-lg py-5 px-1">
                <Image
                  src="/images/logo-icon.svg"
                  alt="Plano de Comissão"
                  width={25}
                  height={10}
                  color="#fff"
                ></Image>
              </div>
              <div className="flex flex-row jusfity-between  bg-red-500/15 text-[#ff3333] rounded-lg py-1 w-fit">
                <p className="ml-2 text-xs">Comissão inicial: </p>

                <p className="text-extrabold text-xs  pl-2 mr-2"> 50%</p>
              </div>
              <p className="text-white text-sm  text-bold p-4 pb-2">
                Aplicativo Modo Caverna
              </p>{' '}
              <div className="flex flex-col jusfity-between text-xs  text-white w-fit">
                <p className="text-zinc-400">
                  Página de vendas:
                  <a
                    className="pl-2 text-primary"
                    href="https://desafio.modocaverna.com/up-dc/"
                    target="_blank"
                  >
                    CLIQUE AQUI
                  </a>
                </p>
              </div>
            </div>
            <a
              className="p-2"
              href="https://redirect.lifs.app/cc-afiliacao"
              target="_blank"
            >
              <Button size={'sm'}>Solicitar Afiliação</Button>
            </a>
          </Card>
          <div className="bg-red-700  bg-opacity-10 rounded-lg ">
            <div className="flex flex-row items-center justify-center p-4 pe-2 gap-6">
              <p>⚠️</p>
              <span className="text-primary  text-center text-white text-xs">
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
