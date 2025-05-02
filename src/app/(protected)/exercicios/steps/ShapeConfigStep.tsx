'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { useUser } from '@/hooks/queries/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useShapeFormStore } from '@/store/shape-form'

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
  idade: string
  altura: string
  peso: string
}

export function ShapeConfigStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()
  const { setData } = useShapeFormStore()
  const form = useForm<Measurements>({
    defaultValues: {
      bicepsD: '',
      bicepsE: '',
      peitoral: '',
      cintura: '',
      gluteos: '',
      quadricepsD: '',
      quadricepsE: '',
      quadril: '',
      panturrilhaD: '',
      panturrilhaE: '',
      altura: '',
      peso: '',
    },
  })

  const { handleSubmit, setValue, watch } = form
  const measurements = watch()

  function handleInputChange(field: keyof Measurements, value: string) {
    if (value.length > 3) return
    setValue(field, value)
  }

  const onSubmit = (data: Measurements) => {
    // Save the data to the store before moving to the next step
    setData({
      altura: Number(data.altura),
      peso: Number(data.peso),
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
          Olá <span className="text-white">{user?.name}</span>, vamos registrar
          seu shape atual?
        </h2>
        <p className="text-zinc-400 font-normal">
          Digite abaixo seus dados para gerarmos seu treino
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
                    type="number"
                    value={measurements.bicepsD}
                    onChange={(e) =>
                      handleInputChange('bicepsD', e.target.value.slice(0, 3))
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Bíceps (E)</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.bicepsE}
                    onChange={(e) =>
                      handleInputChange('bicepsE', e.target.value.slice(0, 3))
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Peitoral</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.peitoral}
                    onChange={(e) =>
                      handleInputChange('peitoral', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Cintura</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.cintura}
                    onChange={(e) =>
                      handleInputChange('cintura', e.target.value)
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
                    type="number"
                    value={measurements.gluteos}
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
                    type="number"
                    value={measurements.quadricepsD}
                    onChange={(e) =>
                      handleInputChange('quadricepsD', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Quadríceps (E)</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.quadricepsE}
                    onChange={(e) =>
                      handleInputChange('quadricepsE', e.target.value)
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
                    type="number"
                    value={measurements.quadril}
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
                    type="number"
                    value={measurements.panturrilhaD}
                    onChange={(e) =>
                      handleInputChange('panturrilhaD', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Panturrilha (E)</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.panturrilhaE}
                    onChange={(e) =>
                      handleInputChange('panturrilhaE', e.target.value)
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
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Altura</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.altura}
                    onChange={(e) =>
                      handleInputChange('altura', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Peso</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.peso}
                    onChange={(e) => handleInputChange('peso', e.target.value)}
                    className="bg-zinc-800"
                    suffix="kg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center fixed bottom-0 w-full border-t left-0 pb-10 pt-10">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  onNext()
                }}
              >
                Pular
              </Button>
              <AutoSubmitButton
                disabled={
                  !measurements.bicepsD ||
                  !measurements.bicepsE ||
                  !measurements.peitoral ||
                  !measurements.cintura ||
                  !measurements.gluteos ||
                  !measurements.quadricepsD ||
                  !measurements.quadricepsE ||
                  !measurements.quadril ||
                  !measurements.panturrilhaD ||
                  !measurements.panturrilhaE ||
                  !measurements.altura ||
                  !measurements.peso
                }
                onClick={handleSubmit(onSubmit)}
              >
                Continuar
              </AutoSubmitButton>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
