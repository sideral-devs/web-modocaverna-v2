'use client'

import { Check, ToggleLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'

export function PlanDesafio() {
  const { data: user } = useUser()

  const isTrial = user?.plan === 'TRIAL' || user?.plan === 'DESAFIO'

  const trialDaysLeft = dayjs(user?.data_de_renovacao).diff(dayjs(), 'days')
  console.log(user?.data_de_compra)
  return (
    <div className="flex flex-col w-full">
      <div className="flex mb-4 flex-col h-auto bg-zinc-900 rounded-2xl border">
        <div className="flex flex-col gap-2 p-6 pb-0 mb-4">
          <ToggleLeft size={20} className="text-zinc-400" />
          <h3 className="text-[#F9CB15]">Sua assinatura atual</h3>
          <h2 className="text-2xl font-semibold mb-2">Plano Desafio Caverna</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-800/50 w-fit px-3 py-1 rounded-md border">
              <span className="text-xs font-medium truncate text-zinc-400">
                {`Assinante desde ${dayjs(user?.data_de_compra).locale('pt-br').format('D MMMM, YYYY')}`}
              </span>
            </div>
            <span className="text-[#F9CB15] font-medium truncate">
              Acesso semestral
            </span>
          </div>
        </div>

        <div className="flex flex-col bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
          <h3 className="text-zinc-400 mb-4">Ferramentas contempladas:</h3>
          <ul className="flex flex-col text-sm gap-4">
            <li className="flex items-center gap-3">
              <Check size={20} className="text-[#F9CB15]" />
              <span className="text-zinc-300">Curso Modo Caverna</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-[#F9CB15]" />
              <span className="text-zinc-300">Desafio Caverna</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-[#F9CB15]" />
              <span className="text-zinc-300">Indique e ganhe</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={20} className="text-[#F9CB15]" />
              <span className="text-zinc-300">Suporte via chat</span>
            </li>
          </ul>
        </div>
      </div>

      {/* TODO: Use when the user is on the free trial */}
      {isTrial && (
        <div className="flex flex-col rounded-xl w-full bg-red-900/20 border border-red-500">
          <div className="flex flex-col gap-2">
            <div className="flex p-6 pb-2 flex-col gap-2">
              <Avatar className="w-8 h-8 mb-2 rounded-none">
                <AvatarImage
                  src={'/images/logo-icon.svg'}
                  className="object-contain"
                />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex gap-2 pr-4 justify-between items-center">
                  <div>
                    <h2 className="text-xl max-w-[200px] font-semibold mb-2">
                      Avaliação gratuita acaba em
                    </h2>
                  </div>
                  <h3 className="text-red-500 font-bold text-4xl">
                    {`${trialDaysLeft}  ${trialDaysLeft > 1 ? 'dias' : 'dia'}`}
                  </h3>
                </div>
              </div>
            </div>
            <div className="w-full border-t border-red-500 p-6">
              <h4 className="text-white mb-2 font-bold text-sm">
                Está curtindo a experiência?
              </h4>
              <h4 className="text-white/50 font-medium text-sm">
                Ative a sua assinatura Cavernosa para continuar aproveitando
                todas as funcionalidades.
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
