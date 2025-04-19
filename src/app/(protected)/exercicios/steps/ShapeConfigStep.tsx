'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { useUser } from '@/hooks/queries/use-user'
import { useShapeFormStore } from '@/store/shape-form'
import { FormProvider, useForm } from 'react-hook-form'

type Measurements = {
  ombro: string
  peito: string
  biceps_direito: string
  biceps_esquerdo: string
  triceps_direito: string
  triceps_esquerdo: string
  gluteos: string
  quadril: string
  quadriceps_direito: string
  quadriceps_esquerdo: string
  panturrilha_direita: string
  panturrilha_esquerda: string
  altura: string
  peso: string
}

export function ShapeConfigStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()
  const { setData } = useShapeFormStore()

  const form = useForm<Measurements>({
    defaultValues: {
      ombro: '',
      peito: '',
      biceps_direito: '',
      biceps_esquerdo: '',
      triceps_direito: '',
      triceps_esquerdo: '',
      gluteos: '',
      quadril: '',
      quadriceps_direito: '',
      quadriceps_esquerdo: '',
      panturrilha_direita: '',
      panturrilha_esquerda: '',
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
    const numericData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, parseFloat(value) || 0]),
    )

    setData({
      membros_superiores: {
        ombro: numericData.ombro,
        peito: numericData.peito,
        biceps_direito: numericData.biceps_direito,
        biceps_esquerdo: numericData.biceps_esquerdo,
        triceps_direito: numericData.triceps_direito,
        triceps_esquerdo: numericData.triceps_esquerdo,
      },
      membros_inferiores: {
        gluteos: numericData.gluteos,
        quadril: numericData.quadril,
        quadriceps_direito: numericData.quadriceps_direito,
        quadriceps_esquerdo: numericData.quadriceps_esquerdo,
        panturrilha_direita: numericData.panturrilha_direita,
        panturrilha_esquerda: numericData.panturrilha_esquerda,
      },
      altura: numericData.altura,
      peso: numericData.peso,
    })

    onNext()
  }

  return (
    <div className="flex flex-col w-[632px] flex-1 items-center gap-4 min-h-screen">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Ombro</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.ombro}
                    onChange={(e) => handleInputChange('ombro', e.target.value)}
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Peitoral</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.peito}
                    onChange={(e) => handleInputChange('peito', e.target.value)}
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Bíceps Direito</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.biceps_direito}
                    onChange={(e) =>
                      handleInputChange('biceps_direito', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Bíceps Esquerdo</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.biceps_esquerdo}
                    onChange={(e) =>
                      handleInputChange('biceps_esquerdo', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Tríceps Direito</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.triceps_direito}
                    onChange={(e) =>
                      handleInputChange('triceps_direito', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Tríceps Esquerdo</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.triceps_esquerdo}
                    onChange={(e) =>
                      handleInputChange('triceps_esquerdo', e.target.value)
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
              <div className="grid grid-cols-3 gap-4">
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
                  <label className="text-sm">Quadríceps Direito</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.quadriceps_direito}
                    onChange={(e) =>
                      handleInputChange('quadriceps_direito', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Quadríceps Esquerdo</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.quadriceps_esquerdo}
                    onChange={(e) =>
                      handleInputChange('quadriceps_esquerdo', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Panturrilha Direita</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.panturrilha_direita}
                    onChange={(e) =>
                      handleInputChange('panturrilha_direita', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Panturrilha Esquerda</label>
                  <InputWithSuffix
                    type="number"
                    value={measurements.panturrilha_esquerda}
                    onChange={(e) =>
                      handleInputChange('panturrilha_esquerda', e.target.value)
                    }
                    className="bg-zinc-800"
                    suffix="cm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex mb-4 items-center justify-between">
                <h3 className="text-yellow-500 w-full">Dados</h3>
                <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
              </div>
              <div className="flex items-center justify-between gap-4">
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

          <div className="flex justify-center fixed bottom-0 w-full border-t left-0 py-4 pt-6">
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
              <AutoSubmitButton onClick={handleSubmit(onSubmit)}>
                Continuar
              </AutoSubmitButton>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
