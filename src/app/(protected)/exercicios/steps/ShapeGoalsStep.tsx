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
import {
  Smiley,
  SmileyAngry,
  SmileyMeh,
  SmileyWink,
} from '@phosphor-icons/react'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { FormProvider, useForm } from 'react-hook-form'

type PhotoType = 'frontal' | 'lateral' | 'costas' | 'lateral2'

interface ShapePhoto {
  url: string
  type: PhotoType
}

type FormData = {
  photos: ShapePhoto[]
  satisfaction: string
  weightGoal: 'perder' | 'manter' | 'ganhar' | ''
  targetWeight: string
}

export function ShapeGoalsStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const form = useForm<FormData>({
    defaultValues: {
      photos: [],
      satisfaction: '',
      weightGoal: '',
      targetWeight: '',
    },
  })

  const { setValue, watch } = form
  const { photos, satisfaction, weightGoal, targetWeight } = watch()

  const photoTypes: { type: PhotoType; label: string }[] = [
    { type: 'frontal', label: 'Frontal' },
    { type: 'lateral', label: 'Lateral' },
    { type: 'costas', label: 'Costas' },
    { type: 'lateral2', label: 'Lateral' },
  ]

  function handlePhotoUpload(type: PhotoType, file: File) {
    const url = URL.createObjectURL(file)
    const newPhotos = photos.filter((photo) => photo.type !== type)
    setValue('photos', [...newPhotos, { url, type }])
  }

  function onSubmit(data: FormData) {
    console.log(data)
    onNext()
  }

  return (
    <div className="flex select-none overflow-y-auto px-1 flex-col flex-1 items-center gap-8">
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-8">
          <div className="flex mb-4 flex-col gap-2">
            <h2 className="text-2xl font-medium">Registre seu progresso</h2>
            <p className="text-zinc-400 font-normal">
              Faça upload do seu shape atual abaixo para comparação futura
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              {photoTypes.map((photoType) => (
                <div key={photoType.type} className="flex flex-col gap-2">
                  <div className="relative group w-28 h-32 aspect-square rounded-2xl border border-zinc-700 overflow-hidden">
                    {photos.find((p) => p.type === photoType.type) ? (
                      <Image
                        src={photos.find((p) => p.type === photoType.type)!.url}
                        alt={photoType.label}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <label
                        htmlFor={`photo-${photoType.type}`}
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                      >
                        <Camera className="group-hover:text-white w-6 h-6 text-white" />
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
              value={satisfaction}
              onValueChange={(value) => setValue('satisfaction', value)}
            >
              <SelectTrigger className="bg-zinc-800 border border-zinc-700 py-6 rounded-lg flex items-center gap-2">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border border-zinc-700">
                <SelectItem value="not_satisfied" className="!hover:bg-red-500">
                  <div className="flex h-10 items-center gap-2">
                    <SmileyAngry className="w-6 h-6 text-zinc-500" />
                    <span>Não satisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="partially_satisfied">
                  <div className="flex items-center gap-2">
                    <SmileyMeh className="w-6 h-6 text-zinc-500" />
                    <span>Parcialmente satisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="satisfied">
                  <div className="flex items-center gap-2">
                    <Smiley className="w-6 h-6 text-zinc-500" />
                    <span>Satisfeito</span>
                  </div>
                </SelectItem>
                <SelectItem value="very_satisfied">
                  <div className="flex items-center gap-2">
                    <SmileyWink className="w-6 h-6 text-zinc-500" />
                    <span>Muito satisfeito</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              'flex flex-col gap-2 pb-6',
              weightGoal ? ' border-b border-zinc-700' : 'border-b-0 pb-0',
            )}
          >
            <h3 className="text-normal font-medium">Qual seu objetivo?</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className={cn(
                  'flex items-center justify-between border w-full bg-zinc-800 hover:bg-zinc-900 border-zinc-800',
                  weightGoal === 'perder' && 'border-zinc-700',
                )}
                onClick={() => setValue('weightGoal', 'perder')}
              >
                <span className="text-sm font-normal">Perder peso</span>
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700',
                    weightGoal === 'perder' && 'border-red-500',
                  )}
                >
                  {weightGoal === 'perder' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'flex items-center justify-between border w-full bg-zinc-800 hover:bg-zinc-900 border-zinc-800',
                  weightGoal === 'manter' && 'border-zinc-700',
                )}
                onClick={() => setValue('weightGoal', 'manter')}
              >
                <span className="text-sm font-normal">Manter peso</span>
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700',
                    weightGoal === 'manter' && 'border-red-500',
                  )}
                >
                  {weightGoal === 'manter' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'flex items-center justify-between border w-full bg-zinc-800 hover:bg-zinc-900 border-zinc-800',
                  weightGoal === 'ganhar' && 'border-zinc-700',
                )}
                onClick={() => setValue('weightGoal', 'ganhar')}
              >
                <span className="text-sm font-normal">Ganhar peso</span>
                <div
                  className={cn(
                    'w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700',
                    weightGoal === 'ganhar' && 'border-red-500',
                  )}
                >
                  {weightGoal === 'ganhar' && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {weightGoal && weightGoal !== 'manter' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-normal font-medium">Quantos kg?</h3>
              <InputWithSuffix
                type="number"
                value={targetWeight}
                onChange={(e) => setValue('targetWeight', e.target.value)}
                className="bg-zinc-800 border-none max-w-[100px]"
                suffix="kg"
              />
            </div>
          )}

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
              <AutoSubmitButton onClick={form.handleSubmit(onSubmit)}>
                Continuar
              </AutoSubmitButton>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
