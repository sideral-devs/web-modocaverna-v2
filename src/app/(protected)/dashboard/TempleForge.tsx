'use client'
import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import { SmileyAngry } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export function TempleForge({ value }: { value: string }) {
  const today = new Date()
  const dayName = format(today, 'EEEE', { locale: ptBR })
  const formattedTime = '12h30 - 14h10'

  return (
    <TabsContent value={value} className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[676px] gap-2">
        <div className="relative w-full gap-4 flex-1 rounded-xl border-t-2 border-t-zinc-700 bg-zinc-800">
          <div className="w-full p-6 pb-4">
            <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
              <span className="uppercase text-[10px] text-yellow-500 font-semibold">
                Treinos
              </span>
            </div>
          </div>

          <div className="flex border-b items-center justify-between gap-4 p-6">
            {/* Card de Medidas */}
            <div className="flex flex-col w-full pl-4 border-l-4 border-l-yellow-500 border-y-0 border-r-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">Novas Medidas</span>
                  <span className="text-base font-medium">Não atualizadas</span>
                </div>
                <span className="text-xs text-zinc-400">
                  *atualizado 6 Abril, 2025
                </span>
              </div>
            </div>

            {/* Card de Peso */}
            <div className="flex flex-col w-full pl-4 border-l-4 border-l-yellow-500 border-y-0 border-r-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-base text-zinc-400">Peso atual</span>
                  <span className="text-base font-medium">86kg</span>
                </div>
              </div>
            </div>

            {/* Card de Shape */}
            <div className="flex flex-col w-full pl-4 border-l-4 border-l-red-500 border-y-0 border-r-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-lg text-zinc-400">Shape</span>
                  <div className="flex items-center gap-2 text-red-500">
                    <SmileyAngry className="w-6 h-6" />
                    <span className="text-base font-medium">
                      Não satisfeito
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treino do Dia */}
          <div className="md:col-span-3 flex flex-col w-full p-6  border-0">
            <div className="flex flex-col gap-2">
              <span className="text-base text-zinc-500">
                Hoje é <span className="font-medium">{dayName}</span>.
              </span>
              <div className="flex gap-2 justify-between">
                <div className="flex gap-1">
                  <h2 className="text-2xl font-medium">Treino de hoje:</h2>
                  <span className="text-2xl font-medium text-zinc-400">
                    Peito
                  </span>
                </div>
                <span className="text-lg font-normal text-zinc-300">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
          <Link className="absolute right-4 bottom-4" href="/exercicios">
            <Button size="sm">Acessar</Button>
          </Link>
        </div>

        <div className="relative w-full gap-4 flex-1 rounded-xl border-t-2 border-t-zinc-700 bg-zinc-800">
          <div className="w-full p-6 pb-4">
            <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
              <span className="uppercase text-[10px] text-yellow-500 font-semibold">
                Refeições
              </span>
            </div>
          </div>

          {/* Treino do Dia */}
          <div className="md:col-span-3 flex flex-col w-full p-6 pt-2 border-0">
            <div className="flex flex-col gap-2">
              <span className="text-base text-zinc-400">
                Hoje é <span className="font-medium">{dayName}</span>.
              </span>
              <div className="flex gap-2 justify-between">
                <div className="flex gap-1">
                  <h2 className="text-2xl font-medium">
                    Confira suas{' '}
                    <span className="text-zinc-400 mr-1">próximas</span>
                    refeições
                  </h2>
                </div>
              </div>
            </div>
            <Link className="absolute right-4 bottom-4" href="/refeicoes">
              <Button size="sm">Acessar</Button>
            </Link>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
