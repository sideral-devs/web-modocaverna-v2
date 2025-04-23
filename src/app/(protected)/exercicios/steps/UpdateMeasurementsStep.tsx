'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { useUser } from '@/hooks/queries/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useShape } from '@/hooks/queries/use-shape'
import {
  Info,
  Warning,
  SmileyAngry,
  Smiley,
  SmileyWink,
} from '@phosphor-icons/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  classificacao: string
  imc: string
  nivel_satisfacao: string
  objetivo: string
}

type IMCStatus = {
  label: string
  color: string
  message: string
  icon: React.ReactNode
}

const getIMCStatus = (imc: number): IMCStatus => {
  if (imc < 18.5) {
    return {
      label: 'IMC BAIXO',
      color: 'yellow',
      message: 'Abaixo do peso',
      icon: <Warning className="w-4 h-4 text-yellow-500" />,
    }
  } else if (imc < 25) {
    return {
      label: 'IMC IDEAL',
      color: 'green',
      message: 'Peso normal',
      icon: <Info className="w-4 h-4 text-green-500" />,
    }
  } else if (imc < 30) {
    return {
      label: 'IMC ELEVADO',
      color: 'orange',
      message: 'Sobrepeso',
      icon: <Warning className="w-4 h-4 text-orange-500" />,
    }
  } else {
    return {
      label: 'IMC ALTO',
      color: 'red',
      message: 'Obesidade',
      icon: <Warning className="w-4 h-4 text-red-500" />,
    }
  }
}

const MeasurementInput = ({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix: string
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm">{label}</label>
    <InputWithSuffix
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800"
      suffix={suffix}
    />
  </div>
)

const UpperBodyMeasurements = ({
  measurements,
  onInputChange,
}: {
  measurements: Measurements
  onInputChange: (field: keyof Measurements, value: string) => void
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex mb-4 items-center justify-between">
      <h3 className="text-yellow-500 w-full">Circunferência superior</h3>
      <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <MeasurementInput
        label="Ombro"
        value={measurements.ombro}
        onChange={(value) => onInputChange('ombro', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Peitoral"
        value={measurements.peito}
        onChange={(value) => onInputChange('peito', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Bíceps Direito"
        value={measurements.biceps_direito}
        onChange={(value) => onInputChange('biceps_direito', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Bíceps Esquerdo"
        value={measurements.biceps_esquerdo}
        onChange={(value) => onInputChange('biceps_esquerdo', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Tríceps Direito"
        value={measurements.triceps_direito}
        onChange={(value) => onInputChange('triceps_direito', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Tríceps Esquerdo"
        value={measurements.triceps_esquerdo}
        onChange={(value) => onInputChange('triceps_esquerdo', value)}
        suffix="cm"
      />
    </div>
  </div>
)

const LowerBodyMeasurements = ({
  measurements,
  onInputChange,
}: {
  measurements: Measurements
  onInputChange: (field: keyof Measurements, value: string) => void
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex mb-4 items-center justify-between">
      <h3 className="text-yellow-500 w-full">Circunferência inferior</h3>
      <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <MeasurementInput
        label="Glúteos"
        value={measurements.gluteos}
        onChange={(value) => onInputChange('gluteos', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Quadril"
        value={measurements.quadril}
        onChange={(value) => onInputChange('quadril', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Quadríceps Direito"
        value={measurements.quadriceps_direito}
        onChange={(value) => onInputChange('quadriceps_direito', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Quadríceps Esquerdo"
        value={measurements.quadriceps_esquerdo}
        onChange={(value) => onInputChange('quadriceps_esquerdo', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Panturrilha Direita"
        value={measurements.panturrilha_direita}
        onChange={(value) => onInputChange('panturrilha_direita', value)}
        suffix="cm"
      />
      <MeasurementInput
        label="Panturrilha Esquerda"
        value={measurements.panturrilha_esquerda}
        onChange={(value) => onInputChange('panturrilha_esquerda', value)}
        suffix="cm"
      />
    </div>
  </div>
)

const IMCDisplay = ({ imc }: { imc: string }) => {
  const imcStatus = getIMCStatus(parseFloat(imc || '0'))

  return (
    <div className="flex flex-col gap-4">
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
          <span className={`text-2xl text-${imcStatus.color}-500 font-medium`}>
            {imc || '0'}
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
    </div>
  )
}

const SatisfactionSelect = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm">Nível de Satisfação</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-zinc-800 border border-zinc-700 py-6 rounded-lg flex items-center gap-2">
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border border-zinc-700">
        <SelectItem value="Não satisfeito">
          <div className="flex h-10 items-center gap-2">
            <SmileyAngry className="w-6 h-6 text-zinc-500" />
            <span>Não satisfeito</span>
          </div>
        </SelectItem>
        <SelectItem value="Satisfeito">
          <div className="flex items-center gap-2">
            <Smiley className="w-6 h-6 text-zinc-500" />
            <span>Satisfeito</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
)

export function UpdateMeasurementsStep({
  onNext,
}: {
  onNext: (data: any) => void
}) {
  const { data: user } = useUser()
  const {
    shapeRegistrations,
    // hasRegistration,
    isLoading: isLoadingShape,
  } = useShape()
  const lastShapeRegistration =
    shapeRegistrations?.[shapeRegistrations.length - 1]

  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

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
      classificacao: '',
      imc: '',
      nivel_satisfacao: '',
      objetivo: '',
    },
  })

  const { handleSubmit, setValue, watch } = form
  const measurements = watch()

  console.log(lastShapeRegistration)

  // Calculate IMC whenever height or weight changes
  useEffect(() => {
    if (lastShapeRegistration?.altura && measurements.peso) {
      const alturaEmMetros = parseFloat(lastShapeRegistration.altura) / 100
      const peso = parseFloat(measurements.peso)
      const imc = Number((peso / (alturaEmMetros * alturaEmMetros)).toFixed(2))
      setValue('imc', imc.toString())

      // Set classification based on IMC
      if (imc < 18.5) {
        setValue('classificacao', 'Abaixo do peso')
      } else if (imc < 25) {
        setValue('classificacao', 'Peso normal')
      } else if (imc < 30) {
        setValue('classificacao', 'Sobrepeso')
      } else {
        setValue('classificacao', 'Obesidade')
      }
    }
  }, [lastShapeRegistration?.altura, measurements.peso, setValue])

  function handleInputChange(field: keyof Measurements, value: string) {
    if (value.length > 3) return
    setValue(field, value)
  }

  async function handleNext(data: any) {
    try {
      await api.post('/registro-de-shape/store', data)
      toast.success('Medidas atualizadas com sucesso!')
      router.replace('/exercicios')
    } catch (error) {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  const onSubmit = (data: Measurements) => {
    if (data.nivel_satisfacao === '') {
      toast.error('Preencha o nível de satisfação')
      return
    }

    const numericData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, parseFloat(value) || 0]),
    )

    const finalData = {
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
      altura: lastShapeRegistration?.altura,
      peso: numericData.peso,
      classificacao: data.classificacao,
      imc: numericData.imc,
      nivel_satisfacao: data.nivel_satisfacao,
      objetivo: lastShapeRegistration?.objetivo,
      fotos: lastShapeRegistration?.fotos,
    }

    handleNext(finalData)
  }

  function nextStep() {
    setCurrentStep(2)
  }

  function previousStep() {
    setCurrentStep(1)
  }

  const validateStepOne = () => {
    const requiredFields = [
      'peso',
      'ombro',
      'peito',
      'biceps_direito',
      'biceps_esquerdo',
      'triceps_direito',
      'triceps_esquerdo',
      'gluteos',
      'quadril',
      'quadriceps_direito',
      'quadriceps_esquerdo',
      'panturrilha_direita',
      'panturrilha_esquerda',
    ]

    const hasEmptyFields = requiredFields.some(
      (field) => !measurements[field as keyof Measurements],
    )

    if (hasEmptyFields) {
      toast.error('Preencha o peso e as novas medidas')
      return false
    }

    return true
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-4">
      <div className="flex mb-10 flex-col w-full gap-2">
        <h2 className="text-2xl font-medium">Hora de atualizar suas medidas</h2>
        <p className="text-zinc-400 font-normal">
          Digite abaixo seus dados para atualizarmos seu registro
        </p>
      </div>
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-6 bg-zinc-900">
          <div className="flex flex-col gap-8">
            {currentStep === 1 ? (
              <>
                <UpperBodyMeasurements
                  measurements={measurements}
                  onInputChange={handleInputChange}
                />
                <LowerBodyMeasurements
                  measurements={measurements}
                  onInputChange={handleInputChange}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-yellow-500 w-full">Dados</h3>
                    <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <MeasurementInput
                      label="Peso"
                      value={measurements.peso}
                      onChange={(value) => handleInputChange('peso', value)}
                      suffix="kg"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex mb-4 items-center justify-between">
                  <h3 className="text-yellow-500 w-full">
                    Informações Adicionais
                  </h3>
                  <div className="w-full h-px bg-gradient-to-tl from-yellow-500 via-transparent to-transparent"></div>
                </div>
                <div className="flex flex-col">
                  <IMCDisplay imc={measurements.imc} />
                  <div className="flex flex-col gap-4">
                    <SatisfactionSelect
                      value={measurements.nivel_satisfacao}
                      onChange={(value) => setValue('nivel_satisfacao', value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center fixed bottom-0 w-full border-t left-0 pb-4 pt-4">
            <div className="flex gap-2">
              {currentStep === 1 ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => router.replace('/exercicios')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      if (validateStepOne()) {
                        setCurrentStep(2)
                      }
                    }}
                  >
                    Próximo
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    onClick={previousStep}
                  >
                    Voltar
                  </Button>
                  <AutoSubmitButton onClick={handleSubmit(onSubmit)}>
                    Atualizar
                  </AutoSubmitButton>
                </>
              )}
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
