'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { useShapeFormStore } from '@/store/shape-form'
import { FormProvider, useForm } from 'react-hook-form'

type Measurements = {
  bicepsD: string
  bicepsE: string
  peitoral: string
  cintura: string
  gluteos: string
  quadricepsD: string
  quadricepsE: string
  quadril: string
  panturrilhaD: string
  panturrilhaE: string
}

interface ShapeConfigStepProps {
  onNext: () => void
  onBack: () => void
}

export function ShapeConfigStep({ onNext, onBack }: ShapeConfigStepProps) {
  const { setData, data: storeData } = useShapeFormStore()
  const form = useForm<Measurements>({
    defaultValues: {
      bicepsD: storeData.membros_superiores.biceps_direito?.toString() || '',
      bicepsE: storeData.membros_superiores.biceps_esquerdo?.toString() || '',
      peitoral: storeData.membros_superiores.peito?.toString() || '',
      cintura: storeData.membros_inferiores.quadril?.toString() || '',
      gluteos: storeData.membros_inferiores.gluteos?.toString() || '',
      quadricepsD:
        storeData.membros_inferiores.quadriceps_direito?.toString() || '',
      quadricepsE:
        storeData.membros_inferiores.quadriceps_esquerdo?.toString() || '',
      quadril: storeData.membros_inferiores.quadril?.toString() || '',
      panturrilhaD:
        storeData.membros_inferiores.panturrilha_direita?.toString() || '',
      panturrilhaE:
        storeData.membros_inferiores.panturrilha_esquerda?.toString() || '',
    },
  })

  const { handleSubmit, setValue, watch } = form
  const measurements = watch()

  function handleInputChange(field: keyof Measurements, value: string) {
    // Only allow empty string or numbers
    if (value === '' || /^\d{0,3}$/.test(value)) {
      setValue(field, value)
    }
  }

  const onSubmit = (data: Measurements) => {
    // Save the data to the store before moving to the next step
    setData({
      membros_superiores: {
        biceps_direito: Number(data.bicepsD) || 0,
        biceps_esquerdo: Number(data.bicepsE) || 0,
        peito: Number(data.peitoral) || 0,
        ombro: 0,
        triceps_direito: 0,
        triceps_esquerdo: 0,
      },
      membros_inferiores: {
        gluteos: Number(data.gluteos) || 0,
        quadril: Number(data.quadril) || 0,
        quadriceps_direito: Number(data.quadricepsD) || 0,
        quadriceps_esquerdo: Number(data.quadricepsE) || 0,
        panturrilha_direita: Number(data.panturrilhaD) || 0,
        panturrilha_esquerda: Number(data.panturrilhaE) || 0,
      },
    })
    onNext()
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-4 ">
      <div className="flex mb-10 flex-col gap-2">
        <h2 className="text-2xl font-medium">
          Agora vamos registrar suas medidas corporais
        </h2>
        <p className="text-zinc-400 font-normal">
          Esse passo é opcional, mas sugiro que você registre suas medidas
        </p>
      </div>
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-6 bg-zinc-900">
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
                    value={measurements.bicepsD}
                    onChange={(e) =>
                      handleInputChange(
                        'bicepsD',
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
                  <label className="text-sm">Bíceps (E)</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.bicepsE}
                    onChange={(e) =>
                      handleInputChange(
                        'bicepsE',
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
                  <label className="text-sm">Peitoral</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.peitoral}
                    onChange={(e) =>
                      handleInputChange(
                        'peitoral',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Cintura</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.cintura}
                    onChange={(e) =>
                      handleInputChange(
                        'cintura',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
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
                    value={measurements.gluteos}
                    onChange={(e) =>
                      handleInputChange(
                        'gluteos',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Quadríceps (D)</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.quadricepsD}
                    onChange={(e) =>
                      handleInputChange(
                        'quadricepsD',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Quadríceps (E)</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.quadricepsE}
                    onChange={(e) =>
                      handleInputChange(
                        'quadricepsE',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
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
                    value={measurements.quadril}
                    onChange={(e) =>
                      handleInputChange(
                        'quadril',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Panturrilha (D)</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.panturrilhaD}
                    onChange={(e) =>
                      handleInputChange(
                        'panturrilhaD',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Panturrilha (E)</label>
                  <InputWithSuffix
                    type="text"
                    value={measurements.panturrilhaE}
                    onChange={(e) =>
                      handleInputChange(
                        'panturrilhaE',
                        e.target.value === '-'
                          ? ''
                          : Math.max(
                              0,
                              parseInt(e.target.value) || 0,
                            ).toString(),
                      )
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
              </div>
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

            <div className="flex w-1/3 justify-center gap-4">
              <Button
                className="bg-transparent"
                onClick={() => {
                  onBack()
                }}
              >
                Voltar
              </Button>

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
