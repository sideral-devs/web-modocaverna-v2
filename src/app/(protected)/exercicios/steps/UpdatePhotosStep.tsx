'use client'

import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ShapePhoto {
  url: string
  base64: string
}

type FormData = {
  fotos: ShapePhoto[]
}

export function UpdatePhotosStep({
  onNext,
}: {
  onNext: (data: any) => void
}) {
  const form = useForm<FormData>({
    defaultValues: {
      fotos: [],
    },
  })

  const { setValue, watch } = form
  const { fotos } = watch()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null)

  const REQUIRED_PHOTOS = 4

  // Check if all required photos are uploaded
  const hasAllPhotos = fotos.length === REQUIRED_PHOTOS

  async function handlePhotoUpload(file: File, index: number) {
    try {
      setUploadingPhotoIndex(index)
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

      // Create a new array with the photo at the specific index
      const newPhotos = [...fotos]
      newPhotos[index] = { url, base64 }
      setValue('fotos', newPhotos)
    } catch (error) {
      toast.error('Erro ao fazer upload da foto')
    } finally {
      setUploadingPhotoIndex(null)
    }
  }

  function handleRemovePhoto(index: number) {
    const newPhotos = [...fotos]
    newPhotos.splice(index, 1)
    setValue('fotos', newPhotos)
  }

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true)
      if (!hasAllPhotos) {
        toast.error('Por favor, faça upload de todas as fotos necessárias')
        return
      }

      await onNext({
        fotos: data.fotos.map(photo => photo.base64),
      })
    } catch (error) {
      toast.error('Erro ao atualizar fotos')
    } finally {
      setIsLoading(false)
    }
  }

  const photoLabels = ['Frontal', 'Lateral', 'Costas', 'Lateral']

  return (
    <div className="flex flex-col select-none w-[632px] flex-1 items-center gap-4 min-h-screen">
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-8">
          <div className="flex mb-4 flex-col gap-2">
            <h2 className="text-2xl font-medium">Atualize suas fotos</h2>
            <p className="text-zinc-400 font-normal">
              Faça upload do seu shape atual abaixo para comparação futura (todas as fotos são obrigatórias)
            </p>
          </div>

          <div className="flex flex-col gap-0">
            <div className="flex justify-between gap-4">
              {photoLabels.map((label, index) => (
                <div key={index} className="flex w-full min-h-[200px] flex-col gap-2">
                  <div className="relative group w-full h-full rounded-2xl border border-zinc-700 overflow-hidden">
                    {fotos[index] ? (
                      <>
                        <Image
                          src={fotos[index].url}
                          alt={label}
                          fill
                          className="object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute rounded-full top-2 right-2 bg-zinc-900/80 hover:bg-red-800 z-10"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <label
                        htmlFor={`photo-${index}`}
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                      >
                        {uploadingPhotoIndex === index ? (
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                          <Camera className="group-hover:text-white w-6 h-6 text-white" />
                        )}
                      </label>
                    )}
                    <input
                      type="file"
                      id={`photo-${index}`}
                      className="hidden"
                      accept="image/*"
                      disabled={uploadingPhotoIndex !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handlePhotoUpload(file, index)
                        }
                      }}
                    />
                  </div>
                  <span className="text-xs text-center text-zinc-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center fixed bg-black bottom-0 w-full border-t left-0 py-4 pt-6">
            <div className="flex gap-2">
              <AutoSubmitButton 
                onClick={form.handleSubmit(onSubmit)}
                disabled={!hasAllPhotos || isLoading || uploadingPhotoIndex !== null}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Atualizando...</span>
                  </div>
                ) : (
                  'Atualizar fotos'
                )}
              </AutoSubmitButton>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
} 