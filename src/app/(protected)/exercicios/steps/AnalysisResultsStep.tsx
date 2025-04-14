'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Info, Warning } from '@phosphor-icons/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function AnalysisResultsStep({
  onBack,
  onFinish,
}: {
  onBack: () => void
  onFinish: () => void
}) {
  return (
    <div className="flex flex-col flex-1 relative items-center p-4 3xl:pb-16 gap-12">
      <div className="flex items-start gap-16">
        <Image
          src={'/images/lobo/apresentando.png'}
          alt="Capitão Caverna"
          className="absolute -top-2 -left-72"
          width={222}
          height={402}
        />
        <div className="flex flex-col relative w-[611px] px-12 py-8 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl mb-4">
            Agora é o momento de se comprometer com a mudança dos seus hábitos.
          </h1>
          <p className="text-zinc-400 mb-10">
            Elimine tudo o que te impede de progredir e implemente novos
            comportamentos que te levem adiante.
          </p>

          <div className="flex flex-col w-full max-w-3xl gap-4">
            <div className="flex w-full gap-4">
              <div className="flex flex-1 items-center justify-between bg-red-950/50 pl-4 pr-8 py-6 rounded-lg border border-red-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg">
                    <Warning className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-red-500 font-medium">IMC ALTO.</span>
                </div>
                <span className="text-2xl text-red-500 font-medium">24.5</span>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="flex flex-1 items-center justify-between bg-yellow-950/20 pl-4 pr-8 py-6 rounded-lg border border-yellow-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg">
                    <Info className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-yellow-500 font-medium">
                    Meta de calorias diárias
                  </span>
                </div>
                <span className="text-2xl text-yellow-500 font-medium">
                  2140
                </span>
              </div>
            </div>
            <span className="text-zinc-400">Posso te dar um conselho?</span>
            <div className="flex w-full gap-4">
              <div className="flex flex-1 items-center justify-between bg-yellow-950/20 pl-4 pr-8 py-6 rounded-lg border border-yellow-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg">
                    <Info className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-yellow-500 font-medium">
                      Não pegue leve! Quanto mais disciplinado e comprometido
                      você for, maior será o impacto dessa jornada na sua vida.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px] top-[25%]"
          />
        </div>
      </div>
      <div className="flex justify-center fixed bg-black bottom-0 w-full border-t left-0 pb-4 pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-transparent"
            onClick={() => {
              onBack()
            }}
          >
            Voltar
          </Button>
          <AutoSubmitButton onClick={onFinish}>
            Organizar exercícios
          </AutoSubmitButton>
        </div>
      </div>
    </div>
  )
}
