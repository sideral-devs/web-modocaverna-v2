'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { useUser } from '@/hooks/queries/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useShapeFormStore } from '@/store/shape-form'

type HeightWeight = {
  altura: string
  peso: string
}

function calculateIMC(altura: number, peso: number): number {
  if (!altura || !peso) return 0
  const alturaEmMetros = altura / 100
  return Number((peso / (alturaEmMetros * alturaEmMetros)).toFixed(1))
}

type IMCRange = {
  min: number
  max: number
  label: string
  color: string
}

const IMC_RANGES: IMCRange[] = [
  { min: 0, max: 18.5, label: 'Abaixo do peso', color: 'text-blue-400' },
  { min: 18.5, max: 25, label: 'Peso normal', color: 'text-green-400' },
  { min: 25, max: 30, label: 'Sobrepeso', color: 'text-yellow-400' },
  { min: 30, max: 35, label: 'Obesidade grau I', color: 'text-orange-400' },
  { min: 35, max: 40, label: 'Obesidade grau II', color: 'text-red-400' },
  {
    min: 40,
    max: Infinity,
    label: 'Obesidade grau III',
    color: 'text-red-600',
  },
]

function getIMCClassification(imc: number): IMCRange {
  if (imc === 0) return { min: 0, max: 0, label: '', color: '' }
  return (
    IMC_RANGES.find((range) => imc >= range.min && imc < range.max) ||
    IMC_RANGES[IMC_RANGES.length - 1]
  )
}

export function HeightWeightStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()
  const { setData, data: storeData } = useShapeFormStore()
  const form = useForm<HeightWeight>({
    defaultValues: {
      altura: storeData.altura?.toString() || '',
      peso: storeData.peso?.toString() || '',
    },
  })

  const { handleSubmit, setValue, watch } = form
  const measurements = watch()

  const imc = calculateIMC(
    Number(measurements.altura),
    Number(measurements.peso),
  )
  const imcClassification = getIMCClassification(imc)

  function handleInputChange(field: keyof HeightWeight, value: string) {
    // Only allow empty string or numbers
    if (value === '' || /^\d{0,3}$/.test(value)) {
      setValue(field, value)
    }
  }

  const onSubmit = (data: HeightWeight) => {
    // Save the data to the store before moving to the next step
    setData({
      altura: Number(data.altura),
      peso: Number(data.peso),
      imc: calculateIMC(Number(data.altura), Number(data.peso)),
    })
    onNext()
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-4">
      <div className="flex mb-2 flex-col gap-2">
        <h2 className="text-2xl font-medium">
          Olá{' '}
          <span className="text-white">
            {user?.name?.split(' ')[0] || user?.name}
          </span>
          , vamos começar com suas medidas básicas?
        </h2>
        <div className="flex mb-4 items-center">
          <h3 className="text-yellow-500 w-full">Dados Básicos</h3>
          <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
        </div>
      </div>
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-6 bg-zinc-900">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-zinc-400 font-normal">
                Informe sua altura e peso para calcularmos seu IMC
              </p>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Altura</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.altura}
                    onChange={(e) =>
                      handleInputChange(
                        'altura',
                        e.target.value === '-'
                          ? ''
                          : Math.max(0, parseInt(e.target.value) || 0)
                              .toString()
                              .slice(0, 3),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Peso</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.peso}
                    onChange={(e) =>
                      handleInputChange(
                        'peso',
                        e.target.value === '-'
                          ? ''
                          : Math.max(0, parseInt(e.target.value) || 0)
                              .toString()
                              .slice(0, 3),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="kg"
                  />
                </div>
              </div>
              {imc > 0 && (
                <div className="flex flex-col gap-2 mt-4 p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Seu IMC</span>
                    <span
                      className={`text-lg font-medium ${imcClassification.color}`}
                    >
                      {imc}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Classificação</span>
                    <span
                      className={`text-sm font-medium ${imcClassification.color}`}
                    >
                      {imcClassification.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-be tween fixed bottom-0 w-full border-t left-0 pb-4 pt-4">
            <div className="w-1/3">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  onNext()
                }}
              >
                Pular
              </Button>
            </div>
            <div className="w-1/3 flex justify-center">
              <AutoSubmitButton onClick={handleSubmit(onSubmit)}>
                Continuar
              </AutoSubmitButton>
            </div>
            <div className="w-1/3"></div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
