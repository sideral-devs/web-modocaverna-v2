'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { ReactNode } from 'react'

export function PublicMapDialogTrigger({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-800 border-zinc-700 overflow-y-auto gap-0 w-[400px] max-h-[75vh] overflow-auto scrollbar-minimal">
        <DialogHeader className=" bg-zinc-800 w-full" color="inherit">
          <DialogTitle>Funis, Fluxos e Scripts</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full bg-zinc-900 gap-2 px-4 py-2 overflow-y-auto">
          {/* Criativos para tráfego pago */}
          <div className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a] rounded-lg">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-lg text-center">
                Criativos para tráfego pago
              </p>
              <a
                href="https://redirect.lifs.app/criativos-mc"
                target="_blank"
              >
                <button className="w-40 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors underline">
                  Acessar Drive
                </button>
              </a>
            </div>
          </div>

          {/* Provas Sociais */}
          <div className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a] rounded-lg">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-lg text-center">
                Provas Sociais
              </p>
              <a
                href="https://redirect.lifs.app/provassoc-mc"
                target="_blank"
              >
                <button className="w-40 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors underline">
                  Acessar Drive
                </button>
              </a>
            </div>
          </div>

          {/* Identidade Visual */}
          <div className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a] rounded-lg">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-lg text-center">
                Identidade Visual
              </p>
              <a
                href="https://redirect.lifs.app/idvisual-mc"
                target="_blank"
              >
                <button className="w-40 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors underline">
                  Acessar Drive
                </button>
              </a>
            </div>
          </div>

          {/* Midia Kit */}
          <div className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a] rounded-lg">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-lg text-center">
                Midia Kit
              </p>
              <a
                href="https://redirect.lifs.app/midiakit-mc"
                target="_blank"
              >
                <button className="w-40 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors underline">
                  Acessar Drive
                </button>
              </a>
            </div>
          </div>

          {/* Mapa do Público Alvo */}
          <div className="flex flex-col w-full h-full py-4 gap-2 justify-center items-center bg-[#2a2a2a] rounded-lg">
            <div className="flex w-full flex-col px-3 items-center justify-center">
              <p className="text-white text-bold pb-4 w-full flex justify-center text-lg text-center">
                Mapa do Público Alvo
              </p>
              <a
                href="https://redirect.lifs.app/mapapublicoalvo"
                target="_blank"
              >
                <button className="w-40 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors underline">
                  Acessar Drive
                </button>
              </a>
            </div>
          </div>

          <div className="bg-yellow-500 flex justify-between bg-opacity-20 rounded-lg mt-2">
            <div className="flex flex-row items-center justify-center p-4 pe-2 gap-2">
              <p>⚠️</p>
              <span className="text-primary text-center text-white text-sm">
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
