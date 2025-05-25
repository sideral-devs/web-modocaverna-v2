'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useShapeFormStore } from '@/store/shape-form'
import {
  CameraPlus,
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyXEyes,
} from '@phosphor-icons/react'
import Image from 'next/image'
import { FormProvider, useForm } from 'react-hook-form'

type PhotoType = 'frontal' | 'perfil esquerdo' | 'costas' | 'perfil direito'

interface ShapePhoto {
  url: string
  type: PhotoType
  base64: string
}

interface FormData {
  fotos: ShapePhoto[]
  satisfacao: string
  objetivo: 'Perder peso' | 'Manter peso' | 'Ganhar peso' | ''
  pesoMeta: string
  textoMeta: string
}

interface ShapeGoalsStepProps {
  onNext: (data: FormData) => void
  onBack: () => void
}

const photoTypes: { type: PhotoType; label: string }[] = [
  { type: 'frontal', label: 'Frontal' },
  { type: 'perfil esquerdo', label: 'Perfil esquerdo' },
  { type: 'costas', label: 'Costas' },
  { type: 'perfil direito', label: 'Perfil direito' },
]

export function ShapeGoalsStep({ onNext, onBack }: ShapeGoalsStepProps) {
  const { setData, data: storeData } = useShapeFormStore()
  const form = useForm<FormData>({
    defaultValues: {
      fotos: storeData.fotos.map((base64, index) => ({
        url: URL.createObjectURL(new Blob([base64], { type: 'image/jpeg' })),
        type: photoTypes[index].type,
        base64,
      })),
      satisfacao:
        storeData.nivel_satisfacao === 'Satisfeito'
          ? 'satisfied'
          : 'not_satisfied',
      objetivo: storeData.objetivo as
        | 'Perder peso'
        | 'Manter peso'
        | 'Ganhar peso'
        | '',
      pesoMeta: storeData.peso_meta?.toString() || '',
      textoMeta: storeData.texto_meta || '',
    },
  })

  const { setValue, watch } = form
  const { fotos, satisfacao, objetivo, pesoMeta, textoMeta } = watch()

  const hasFilledAllFields =
    (satisfacao && objetivo === 'Manter peso') || (pesoMeta && objetivo)

  async function handlePhotoUpload(type: PhotoType, file: File) {
    const url = URL.createObjectURL(file)

    // Convert to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        resolve(base64String)
      }
      reader.readAsDataURL(file)
    })

    const newPhotos = fotos.filter((photo) => photo.type !== type)
    setValue('fotos', [...newPhotos, { url, type, base64 }])
  }

  function onSubmit(data: FormData) {
    // Map satisfaction levels to match API expectations
    const satisfactionMap: Record<string, string> = {
      satisfied: 'Satisfeito',
      little_satisfied: 'Pouco satisfeito',
      not_satisfied: 'Nada satisfeito',
      very_not_satisfied: 'Insatisfeito',
      undefined: 'Indefinido',
    }

    // Save the data to the store before moving to the next step
    setData({
      fotos: data.fotos.map((photo) => photo.base64),
      nivel_satisfacao: satisfactionMap[data.satisfacao],
      objetivo: data.objetivo,
      peso_meta: Number(data.pesoMeta),
      texto_meta: data.textoMeta,
    })
    onNext(data)
  }

  return (
    <div className="flex select-none w-[632px] overflow-y-auto px-1 flex-col flex-1 items-center gap-8">
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-8">
          <div className="flex mb-4 flex-col gap-2">
            <h2 className="text-2xl font-medium">Registre seu progresso</h2>
            <p className="text-zinc-400 font-normal">
              Você não é obrigado, mas acompanhe sua evolução enviando fotos do
              seu shape atual
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              {photoTypes.map((photoType) => (
                <div key={photoType.type} className="flex flex-col gap-2">
                  <div className="relative group w-28 h-32 aspect-square rounded-2xl border border-zinc-700 overflow-hidden">
                    {fotos.find((p) => p.type === photoType.type) ? (
                      <div className="relative w-full h-full group">
                        <Image
                          src={
                            fotos.find((p) => p.type === photoType.type)!.url
                          }
                          alt={photoType.label}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              const newPhotos = fotos.filter(
                                (p) => p.type !== photoType.type,
                              )
                              setValue('fotos', newPhotos)
                            }}
                            className="text-white bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={`photo-${photoType.type}`}
                        className="flex relative flex-col items-center justify-center w-full h-full cursor-pointer"
                      >
                        <CameraPlus className="absolute bottom-2 right-2 w-6 h-6 text-white" />
                        <div className="relative w-24 h-24">
                          <Image
                            src={
                              photoType.type === 'frontal'
                                ? '/images/frente.png'
                                : photoType.type === 'perfil esquerdo'
                                  ? '/images/perfilesquerdo.png'
                                  : photoType.type === 'costas'
                                    ? '/images/costas.png'
                                    : '/images/perfildireito.png'
                            }
                            alt="Camera"
                            fill
                          />
                        </div>
                      </label>
                    )}
                    <input
                      type="file"
                      id={`photo-${photoType.type}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePhotoUpload(photoType.type, file)
                      }}
                    />
                  </div>
                  <span className="text-xs text-center text-zinc-400">
                    {photoType.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col border-b border-zinc-700 pb-6 gap-4">
            <h3 className="text-base font-medium">
              Qual o nível de satisfação com seu shape?
            </h3>
            <Select
              value={satisfacao}
              onValueChange={(value) => setValue('satisfacao', value)}
            >
              <SelectTrigger className="bg-zinc-800 border border-zinc-700 py-6 rounded-lg flex items-center gap-2">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border border-zinc-700">
                <SelectItem value="satisfied">
                  <div className="flex items-center gap-2">
                    <Smiley className="w-6 h-6 text-green-500" />
                    <span>Satisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="little_satisfied">
                  <div className="flex items-center gap-2">
                    <SmileyMeh className="w-6 h-6 text-yellow-500" />
                    <span>Pouco satisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="not_satisfied">
                  <div className="flex items-center gap-2">
                    <SmileyXEyes className="w-6 h-6 text-red-500" />
                    <span>Nada satisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="very_not_satisfied">
                  <div className="flex items-center gap-2">
                    <SmileySad className="w-6 h-6 text-orange-500" />
                    <span>Insatisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="undefined">
                  <div className="flex items-center gap-2">
                    <SmileyMeh className="w-6 h-6 text-zinc-500" />
                    <span>Indefinido</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              'flex flex-col gap-2 pb-6',
              objetivo ? 'border-b border-zinc-700' : 'border-b-0 pb-0',
            )}
          >
            <h3 className="text-normal font-medium">Qual seu objetivo?</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className={cn(
                  'flex items-center justify-between border w-full bg-zinc-800 hover:bg-zinc-900 border-zinc-800',
                  objetivo === 'Perder peso' && 'border-zinc-700',
                )}
                onClick={() => setValue('objetivo', 'Perder peso')}
              >
                <span className="text-sm font-normal">Perder peso</span>
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700',
                    objetivo === 'Perder peso' && 'border-red-500',
                  )}
                >
                  {objetivo === 'Perder peso' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'flex items-center justify-between border w-full bg-zinc-800 hover:bg-zinc-900 border-zinc-800',
                  objetivo === 'Manter peso' && 'border-zinc-700',
                )}
                onClick={() => setValue('objetivo', 'Manter peso')}
              >
                <span className="text-sm font-normal">Manter peso</span>
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700',
                    objetivo === 'Manter peso' && 'border-red-500',
                  )}
                >
                  {objetivo === 'Manter peso' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'flex items-center justify-between border w-full bg-zinc-800 hover:bg-zinc-900 border-zinc-800',
                  objetivo === 'Ganhar peso' && 'border-zinc-700',
                )}
                onClick={() => setValue('objetivo', 'Ganhar peso')}
              >
                <span className="text-sm font-normal">Ganhar peso</span>
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700',
                    objetivo === 'Ganhar peso' && 'border-red-500',
                  )}
                >
                  {objetivo === 'Ganhar peso' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {objetivo && objetivo !== 'Manter peso' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-normal font-medium">
                Qual sua meta de peso?
              </h3>
              <InputWithSuffix
                type="text"
                value={pesoMeta}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || /^\d*$/.test(value)) {
                    setValue('pesoMeta', value)
                  }
                }}
                className="bg-zinc-800 border-none max-w-[100px]"
                suffix="kg"
              />
            </div>
          )}

          <div className="flex justify-between fixed bg-black bottom-0 w-full border-t left-0 pb-4 pt-4">
            <div className="w-1/3">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  onNext({
                    fotos,
                    satisfacao,
                    objetivo,
                    pesoMeta,
                    textoMeta,
                  })
                }}
              >
                Pular
              </Button>
            </div>
            <div className="w-1/3 flex justify-center gap-4">
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
              <AutoSubmitButton
                onClick={form.handleSubmit(onSubmit)}
                disabled={!hasFilledAllFields}
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
