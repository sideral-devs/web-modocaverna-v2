'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Info, Warning } from '@phosphor-icons/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useShapeFormStore } from '@/store/shape-form'

import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useShape } from '@/hooks/queries/use-shape'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

type IMCStatus = {
  label: string
  color: string
  message: string
  icon: React.ReactNode
}

export function AnalysisResultsStep({
  onBack,
  onFinish,
}: {
  onBack: () => void
  onFinish: () => void
}) {
  const router = useRouter()
  const { data, reset, setData } = useShapeFormStore()
  const queryClient = useQueryClient()
  const alturaEmMetros = data.altura / 100
  const imc = Number((data.peso / (alturaEmMetros * alturaEmMetros)).toFixed(2))

  const {
    shapeRegistrations,
    // hasRegistration,

    isLoading: isLoadingShape,
  } = useShape()

  const firstShapeRegistration = shapeRegistrations?.[0]

  const getIMCStatus = (imc: number): IMCStatus => {
    if (isNaN(imc)) {
      return {
        label: 'IMC NÃO DISPONÍVEL',
        color: 'red',
        message: 'Não foi possível calcular o IMC.',
        icon: <Warning className="w-4 h-4 text-red-500" />,
      }
    }

    if (imc < 18.5) {
      return {
        label: 'IMC BAIXO',
        color: 'yellow',
        message:
          'Seu IMC indica que você está abaixo do peso ideal. Vamos trabalhar para ganhar massa muscular de forma saudável.',
        icon: <Warning className="w-4 h-4 text-yellow-500" />,
      }
    } else if (imc < 25) {
      return {
        label: 'IMC IDEAL',
        color: 'green',
        message:
          'Seu IMC está dentro da faixa considerada saudável. Vamos manter esse equilíbrio e focar em ganhar massa muscular.',
        icon: <Info className="w-4 h-4 text-green-500" />,
      }
    } else if (imc < 30) {
      return {
        label: 'IMC ELEVADO',
        color: 'orange',
        message:
          'Seu IMC indica sobrepeso. Vamos trabalhar para reduzir o percentual de gordura e ganhar massa muscular.',
        icon: <Warning className="w-4 h-4 text-orange-500" />,
      }
    } else {
      return {
        label: 'IMC ALTO',
        color: 'red',
        message:
          'Seu IMC indica obesidade. Vamos focar em reduzir o percentual de gordura de forma saudável e sustentável.',
        icon: <Warning className="w-4 h-4 text-red-500" />,
      }
    }
  }

  const imcStatus = getIMCStatus(imc)

  async function handleFinish() {
    let isSkipped = 0
    try {
      if (isNaN(imc)) {
        isSkipped = 1
      }

      // Prepare the final data
      const finalData = {
        ...data,
        imc,
        satisfeito_fisico: data.nivel_satisfacao === 'Não satisfeito' ? 0 : 1,
        classificacao:
          imc < 18.5
            ? 'Abaixo do peso'
            : imc < 25
              ? 'Peso normal'
              : imc < 30
                ? 'Sobrepeso'
                : 'Não informado',
        is_skipped: isSkipped,
        objetivo: data.objetivo || 'Indefinido',
        nivel_satisfacao: data.nivel_satisfacao || 'Indefinido',
      }

      // Set IMC to 0 if NaN
      if (isNaN(imc)) {
        finalData.imc = 0.0
      }

      const isUpdated = firstShapeRegistration?.imc === 0

      console.log(finalData)

      // Submit to API
      if (isUpdated) {
        await api.put(
          `/registro-de-shape/update/${firstShapeRegistration?.shape_id}`,
          finalData,
        )
        toast.success('Shape e objetivo atualizados com sucesso!')
      } else {
        await api.post('/registro-de-shape/store', finalData)
        toast.success('Shape registrado com sucesso!')
      }

      // Refetch data and wait for it to complete
      await queryClient.refetchQueries({ queryKey: ['shape-registrations'] })

      // Reset form
      reset()

      // Navigate using replace to avoid back button issues
      router.replace('/exercicios')
    } catch (error) {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col w-[632px] flex-1 relative items-center p-4 3xl:pb-16 gap-12">
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
              <div
                className={`flex flex-1 items-center justify-between bg-${imcStatus.color}-950/50 pl-4 pr-8 py-6 rounded-lg border border-${imcStatus.color}-900/50`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg">{imcStatus.icon}</div>
                  <span className={`text-${imcStatus.color}-500 font-medium`}>
                    {imcStatus.label}
                  </span>
                </div>
                <span
                  className={`text-2xl text-${imcStatus.color}-500 font-medium`}
                >
                  {!isNaN(imc) ? imc.toFixed(2) : 'Não disponível'}
                </span>
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
                  {Math.round(data.peso * 30)}
                </span>
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="flex flex-1 items-center justify-between bg-zinc-950/20 pl-4 pr-8 py-6 rounded-lg border border-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg">
                    <Info className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500 font-medium">
                      {imcStatus.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
              setData({ fotos: [] })
              onBack()
            }}
          >
            Voltar
          </Button>
          <AutoSubmitButton onClick={handleFinish}>
            Organizar exercícios
          </AutoSubmitButton>
        </div>
      </div>
    </div>
  )
}
