'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { useUser } from '@/hooks/queries/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useShapeFormStore } from '@/store/shape-form'
import { useRouter } from 'next/navigation'
import { useShape } from '@/hooks/queries/use-shape'
import { toast } from 'sonner'
import { useState } from 'react'
import { Smiley, SmileySad } from '@phosphor-icons/react'
import Image from 'next/image'

type Measurements = {
  altura: string
  peso: string
  peso_meta: string
  ombro: number
  peito: number
  biceps_direito: number
  biceps_esquerdo: number
  triceps_direito: number
  triceps_esquerdo: number
  gluteos: number
  quadril: number
  quadriceps_direito: number
  quadriceps_esquerdo: number
  panturrilha_direita: number
  panturrilha_esquerda: number
  imc: number
}

type Step = 'measurements' | 'analysis'

export function UpdateMeasurementsStep() {
  const router = useRouter()
  const { data: user } = useUser()
  const { setData } = useShapeFormStore()
  const { shapeRegistrations, updateShapeRegistration } = useShape()
  const lastRegistration = shapeRegistrations?.[shapeRegistrations.length - 1]
  const [currentStep, setCurrentStep] = useState<Step>('measurements')
  const [satisfactionLevel, setSatisfactionLevel] = useState<
    'Satisfeito' | 'Não satisfeito'
  >(
    (lastRegistration?.nivel_satisfacao as 'Satisfeito' | 'Não satisfeito') ||
      'Não satisfeito',
  )

  const form = useForm<Measurements>({
    defaultValues: {
      biceps_direito: Number(
        lastRegistration?.membros_superiores.biceps_direito?.toString() || '0',
      ),
      biceps_esquerdo: Number(
        lastRegistration?.membros_superiores.biceps_esquerdo?.toString() || '0',
      ),
      peito: Number(
        lastRegistration?.membros_superiores.peito?.toString() || '0',
      ),
      ombro: Number(
        lastRegistration?.membros_superiores.ombro?.toString() || '0',
      ),
      triceps_direito: Number(
        lastRegistration?.membros_superiores.triceps_direito?.toString() || '0',
      ),
      triceps_esquerdo: Number(
        lastRegistration?.membros_superiores.triceps_esquerdo?.toString() ||
          '0',
      ),
      gluteos: Number(
        lastRegistration?.membros_inferiores.gluteos?.toString() || '0',
      ),
      quadriceps_direito: Number(
        lastRegistration?.membros_inferiores.quadriceps_direito?.toString() ||
          '0',
      ),
      quadriceps_esquerdo: Number(
        lastRegistration?.membros_inferiores.quadriceps_esquerdo?.toString() ||
          '0',
      ),
      quadril: Number(
        lastRegistration?.membros_inferiores.quadril?.toString() || '0',
      ),
      panturrilha_direita: Number(
        lastRegistration?.membros_inferiores.panturrilha_direita?.toString() ||
          '0',
      ),
      panturrilha_esquerda: Number(
        lastRegistration?.membros_inferiores.panturrilha_esquerda?.toString() ||
          '0',
      ),
      altura: lastRegistration?.altura?.toString() || '',
      peso: lastRegistration?.peso?.toString() || '',
      imc: Number(lastRegistration?.imc?.toString() || '0'),
      peso_meta: lastRegistration?.peso_meta?.toString() || '',
    },
  })

  const { handleSubmit, setValue, watch } = form
  const measurements = watch()

  const handleInputChange = (field: keyof Measurements, value: string) => {
    // Only allow empty string or numbers (up to 3 digits)
    const sanitized = value.replace(/\D/g, '').slice(0, 3)
    setValue(field, sanitized)
  }

  const handleAgeChange = (value: string) => {
    // Handle age separately since it's not part of the Measurements type
    // Implement the logic to update age in the form
  }

  const calculateDifference = (
    current: number,
    previous: number | null | undefined,
  ) => {
    if (!previous) return { value: 0, increased: false }
    const diff = current - previous
    return { value: Math.abs(diff), increased: diff > 0 }
  }

  const renderAnalysisStep = () => {
    if (!lastRegistration) return null

    const previousRegistration = lastRegistration

    return (
      <div className="flex flex-col min-h-screen w-full gap-8 max-w-4xl">
        <div className="flex mb-10 flex-col gap-2">
          <h2 className="text-2xl font-medium">Análise das Medidas</h2>
          <p className="text-zinc-400 font-normal">
            Compare suas medidas e atualize seu nível de satisfação
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Superior measurements comparison */}
          <div className="flex flex-col gap-4">
            <div className="flex mb-4 items-center justify-between">
              <h3 className="text-yellow-500 w-full">
                Circunferência superior
              </h3>
              <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: 'Bíceps (D)',
                  current: measurements.biceps_direito,
                  previous:
                    previousRegistration?.membros_superiores.biceps_direito,
                },
                {
                  label: 'Bíceps (E)',
                  current: measurements.biceps_esquerdo,
                  previous:
                    previousRegistration?.membros_superiores.biceps_esquerdo,
                },
                {
                  label: 'Peitoral',
                  current: measurements.peito,
                  previous: previousRegistration?.membros_superiores.peito,
                },
                {
                  label: 'Ombro',
                  current: measurements.ombro,
                  previous: previousRegistration?.membros_superiores.ombro,
                },
              ].map((item) => {
                const diff = calculateDifference(item.current, item.previous)
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg"
                  >
                    <span className="text-zinc-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{item.current} cm</span>
                      {diff.value > 0 && (
                        <span
                          className={
                            diff.increased ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {diff.increased ? '+' : '-'}
                          {diff.value} cm
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Inferior measurements comparison */}
          <div className="flex flex-col gap-4">
            <div className="flex mb-4 items-center justify-between">
              <h3 className="text-yellow-500 w-full">
                Circunferência inferior
              </h3>
              <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: 'Glúteos',
                  current: measurements.gluteos,
                  previous: previousRegistration?.membros_inferiores.gluteos,
                },
                {
                  label: 'Quadril',
                  current: measurements.quadril,
                  previous: previousRegistration?.membros_inferiores.quadril,
                },
                {
                  label: 'Quadríceps (D)',
                  current: measurements.quadriceps_direito,
                  previous:
                    previousRegistration?.membros_inferiores.quadriceps_direito,
                },
                {
                  label: 'Quadríceps (E)',
                  current: measurements.quadriceps_esquerdo,
                  previous:
                    previousRegistration?.membros_inferiores
                      .quadriceps_esquerdo,
                },
                {
                  label: 'Panturrilha (D)',
                  current: measurements.panturrilha_direita,
                  previous:
                    previousRegistration?.membros_inferiores
                      .panturrilha_direita,
                },
                {
                  label: 'Panturrilha (E)',
                  current: measurements.panturrilha_esquerda,
                  previous:
                    previousRegistration?.membros_inferiores
                      .panturrilha_esquerda,
                },
              ].map((item) => {
                const diff = calculateDifference(item.current, item.previous)
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg"
                  >
                    <span className="text-zinc-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{item.current} cm</span>
                      {diff.value > 0 && (
                        <span
                          className={
                            diff.increased ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {diff.increased ? '+' : '-'}
                          {diff.value} cm
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Satisfaction level */}
          <div className="flex flex-col gap-4">
            <div className="flex mb-4 items-center justify-between">
              <h3 className="text-yellow-500 w-full">Nível de Satisfação</h3>
              <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setSatisfactionLevel('Satisfeito')}
                className={`flex-1 gap-2 ${
                  satisfactionLevel === 'Satisfeito'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <Smiley weight="bold" size={24} />
                Satisfeito
              </Button>
              <Button
                onClick={() => setSatisfactionLevel('Não satisfeito')}
                className={`flex-1 gap-2 ${
                  satisfactionLevel === 'Não satisfeito'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <SmileySad weight="bold" size={24} />
                Não satisfeito
              </Button>
            </div>
          </div>
          {/* Peso comparison */}
          <div className="flex flex-col gap-4">
            <div className="flex mb-4 items-center justify-between">
              <h3 className="text-yellow-500 w-full">Peso atual</h3>
              <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{measurements.peso} kg</span>
              <span className="text-zinc-400">
                {lastRegistration?.peso &&
                measurements.peso !== lastRegistration.peso.toString()
                  ? `(${
                      Number(measurements.peso) -
                        Number(lastRegistration.peso) <
                      0
                        ? '-'
                        : '+'
                    }${Math.abs(Number(measurements.peso) - Number(lastRegistration.peso))} kg)`
                  : ''}
              </span>
            </div>
          </div>
          {/* Altura comparison */}
          <div className="flex flex-col gap-4">
            <div className="flex mb-4 items-center justify-between">
              <h3 className="text-yellow-500 w-full">Altura</h3>
              <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{measurements.altura} cm</span>
              <span className="text-zinc-400">
                {lastRegistration?.altura &&
                measurements.altura !== lastRegistration.altura.toString()
                  ? `(${
                      Number(measurements.altura) -
                        Number(lastRegistration.altura) <
                      0
                        ? '-'
                        : '+'
                    }${Math.abs(Number(measurements.altura) - Number(lastRegistration.altura))} cm)`
                  : ''}
              </span>
            </div>
          </div>
          {/* Objetivo comparison */}
          <div className="flex flex-col gap-4">
            <div className="flex mb-4 items-center justify-between">
              <h3 className="text-yellow-500 w-full">Objetivo</h3>
              <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{measurements.peso_meta} kg</span>
              <span className="text-zinc-400">
                {shapeRegistrations[0]?.peso_meta &&
                measurements.peso_meta !==
                  shapeRegistrations[0].peso_meta.toString()
                  ? `(${
                      Number(measurements.peso_meta) -
                        Number(shapeRegistrations[0].peso_meta) <
                      0
                        ? '-'
                        : '+'
                    }${Math.abs(
                      Number(measurements.peso_meta) -
                        Number(shapeRegistrations[0].peso_meta),
                    )} kg)`
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: Measurements) => {
    if (!lastRegistration) {
      toast.error('Não foi possível atualizar as medidas')
      return
    }

    if (currentStep === 'measurements') {
      setCurrentStep('analysis')
      return
    }

    try {
      console.log({
        id: lastRegistration.shape_id,
        data: {
          membros_superiores: {
            ombro: Number(data.ombro),
            peito: Number(data.peito),
            biceps_direito: Number(data.biceps_direito),
            biceps_esquerdo: Number(data.biceps_esquerdo),
            triceps_direito: Number(data.triceps_direito),
            triceps_esquerdo: Number(data.triceps_esquerdo),
          },
          membros_inferiores: {
            gluteos: Number(data.gluteos),
            quadril: Number(data.quadril),
            quadriceps_direito: Number(data.quadriceps_direito),
            quadriceps_esquerdo: Number(data.quadriceps_esquerdo),
            panturrilha_direita: Number(data.panturrilha_direita),
            panturrilha_esquerda: Number(data.panturrilha_esquerda),
          },
          altura: Number(data.altura),
          peso: Number(data.peso),
          imc: Number(data.imc),
          objetivo: shapeRegistrations[0].objetivo,
          peso_meta: Number(data.peso_meta) || shapeRegistrations[0].peso_meta,
          classificacao: shapeRegistrations[0].classificacao,
          nivel_satisfacao: satisfactionLevel,
        },
      })
      await updateShapeRegistration({
        id: lastRegistration.shape_id,
        data: {
          membros_superiores: {
            ombro: Number(data.ombro),
            peito: Number(data.peito),
            biceps_direito: Number(data.biceps_direito),
            biceps_esquerdo: Number(data.biceps_esquerdo),
            triceps_direito: Number(data.triceps_direito),
            triceps_esquerdo: Number(data.triceps_esquerdo),
          },
          membros_inferiores: {
            gluteos: Number(data.gluteos),
            quadril: Number(data.quadril),
            quadriceps_direito: Number(data.quadriceps_direito),
            quadriceps_esquerdo: Number(data.quadriceps_esquerdo),
            panturrilha_direita: Number(data.panturrilha_direita),
            panturrilha_esquerda: Number(data.panturrilha_esquerda),
          },
          altura: Number(data.altura),
          peso: Number(data.peso),
          imc: Number(data.imc),
          objetivo: shapeRegistrations[0].objetivo,
          peso_meta: Number(data.peso_meta) || shapeRegistrations[0].peso_meta,
          classificacao: shapeRegistrations[0].classificacao,
          nivel_satisfacao: satisfactionLevel,
        },
      })

      toast.success('Medidas atualizadas com sucesso!')
      router.push('/exercicios')
    } catch (error) {
      toast.error('Erro ao atualizar medidas')
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-4 w-full">
      <FormProvider {...form}>
        {currentStep === 'measurements' ? (
          <div className="flex flex-col w-full max-w-3xl gap-6 bg-zinc-900">
            <div className="flex mb-10 flex-col gap-2">
              <h2 className="text-2xl font-medium">
                Olá{' '}
                <span className="text-white">
                  {user?.name?.split(' ')[0] || user?.name}
                </span>
                , vamos atualizar suas medidas?
              </h2>
              <p className="text-zinc-400 font-normal">
                Digite abaixo seus dados atualizados
              </p>
            </div>
            <div className="flex flex-col gap-8">
              {/* Circunferência superior */}
              <div className="flex flex-col gap-4">
                <div className="flex mb-4 items-center justify-between">
                  <h3 className="text-yellow-500 w-full">
                    Circunferência superior
                  </h3>
                  <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Bíceps (D)</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.biceps_direito.toString()}
                      onChange={(e) =>
                        handleInputChange('biceps_direito', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Bíceps (E)</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.biceps_esquerdo.toString()}
                      onChange={(e) =>
                        handleInputChange('biceps_esquerdo', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Peitoral</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.peito.toString()}
                      onChange={(e) =>
                        handleInputChange('peito', e.target.value)
                      }
                      className="bg-zinc-800"
                      placeholder="Medida do peito"
                      suffix="cm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Ombro</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.ombro.toString()}
                      onChange={(e) =>
                        handleInputChange('ombro', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                </div>
              </div>

              {/* Circunferência inferior */}
              <div className="flex flex-col gap-4">
                <div className="flex mb-4 items-center justify-between">
                  <h3 className="text-yellow-500 w-full">
                    Circunferência inferior
                  </h3>
                  <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
                </div>
                <div className="flex items-center mb-2 justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Glúteos</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.gluteos.toString()}
                      onChange={(e) =>
                        handleInputChange('gluteos', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Quadríceps (D)</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.quadriceps_direito.toString()}
                      onChange={(e) =>
                        handleInputChange('quadriceps_direito', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Quadríceps (E)</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.quadriceps_esquerdo.toString()}
                      onChange={(e) =>
                        handleInputChange('quadriceps_esquerdo', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Quadril</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.quadril.toString()}
                      onChange={(e) =>
                        handleInputChange('quadril', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Panturrilha (D)</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.panturrilha_direita.toString()}
                      onChange={(e) =>
                        handleInputChange('panturrilha_direita', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Panturrilha (E)</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.panturrilha_esquerda.toString()}
                      onChange={(e) =>
                        handleInputChange(
                          'panturrilha_esquerda',
                          e.target.value,
                        )
                      }
                      className="bg-zinc-800"
                      suffix="cm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex mb-4 items-center">
                  <h3 className="text-yellow-500 w-full">Dados</h3>
                  <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm">Altura</label>
                      <InputWithSuffix
                        type="text"
                        value={measurements.altura}
                        onChange={(e) =>
                          handleInputChange('altura', e.target.value)
                        }
                        className="bg-zinc-800"
                        suffix="cm"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm">Peso atual</label>
                      <InputWithSuffix
                        type="text"
                        value={measurements.peso}
                        onChange={(e) =>
                          handleInputChange('peso', e.target.value)
                        }
                        className="bg-zinc-800"
                        suffix="kg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm">Objetivo</label>
                    <InputWithSuffix
                      type="text"
                      value={measurements.peso_meta}
                      onChange={(e) =>
                        handleInputChange('peso_meta', e.target.value)
                      }
                      className="bg-zinc-800"
                      suffix="kg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderAnalysisStep()
        )}

        <div className="flex justify-center fixed bottom-0 w-full border-0 left-0 pb-10 pt-10">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => {
                if (currentStep === 'analysis') {
                  setCurrentStep('measurements')
                } else {
                  router.push('/exercicios')
                }
              }}
            >
              {currentStep === 'analysis' ? 'Voltar' : 'Cancelar'}
            </Button>
            <AutoSubmitButton
              disabled={
                currentStep === 'measurements'
                  ? !measurements.biceps_direito ||
                    !measurements.biceps_esquerdo ||
                    !measurements.peito ||
                    !measurements.gluteos ||
                    !measurements.quadriceps_direito ||
                    !measurements.quadriceps_esquerdo ||
                    !measurements.quadril ||
                    !measurements.panturrilha_direita ||
                    !measurements.panturrilha_esquerda
                  : false
              }
              onClick={handleSubmit(onSubmit)}
            >
              {currentStep === 'measurements'
                ? 'Continuar'
                : 'Atualizar medidas'}
            </AutoSubmitButton>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
