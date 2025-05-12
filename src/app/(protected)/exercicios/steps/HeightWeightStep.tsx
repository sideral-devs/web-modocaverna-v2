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

function isValidHeight(altura: string): boolean {
  const height = Number(altura)
  return height >= 100 && height <= 250 // reasonable height range in cm
}

function isValidWeight(peso: string): boolean {
  const weight = Number(peso)
  return weight >= 30 && weight <= 300 // reasonable weight range in kg
}

function getHeightError(altura: string): string {
  if (!altura) return ''
  const height = Number(altura)
  if (height < 100) return 'Altura deve ser maior que 100cm'
  if (height > 250) return 'Altura deve ser menor que 250cm'
  return ''
}

function getWeightError(peso: string): string {
  if (!peso) return ''
  const weight = Number(peso)
  if (weight < 30) return 'Peso deve ser maior que 30kg'
  if (weight > 300) return 'Peso deve ser menor que 300kg'
  return ''
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

  const heightError = getHeightError(measurements.altura)
  const weightError = getWeightError(measurements.peso)
  const isFormValid =
    isValidHeight(measurements.altura) && isValidWeight(measurements.peso)

  function handleInputChange(field: keyof HeightWeight, value: string) {
    // Only allow empty string or numbers
    if (value === '' || /^\d{0,3}$/.test(value)) {
      setValue(field, value)
    }
  }

  const onSubmit = (data: HeightWeight) => {
    if (!isFormValid) return
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        'altura',
                        e.target.value === '-'
                          ? ''
                          : Math.max(0, parseInt(e.target.value) || 0)
                              .toString()
                              .slice(0, 3),
                      )
                    }
                    className={`bg-zinc-800 ${heightError ? 'border-red-500' : ''}`}
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Peso</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.peso}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        'peso',
                        e.target.value === '-'
                          ? ''
                          : Math.max(0, parseInt(e.target.value) || 0)
                              .toString()
                              .slice(0, 3),
                      )
                    }
                    className={`bg-zinc-800 ${weightError ? 'border-red-500' : ''}`}
                    suffix="kg"
                  />
                </div>
              </div>
              {(heightError || weightError) && (
                <div className="flex flex-col gap-1 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  {heightError && (
                    <span className="text-sm text-red-500">{heightError}</span>
                  )}
                  {weightError && (
                    <span className="text-sm text-red-500">{weightError}</span>
                  )}
                </div>
              )}
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

          <div className="flex justify-between fixed bottom-0 w-full border-t left-0 pb-4 pt-4">
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
              <AutoSubmitButton
                onClick={handleSubmit(onSubmit)}
                disabled={!isFormValid}
              >
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
