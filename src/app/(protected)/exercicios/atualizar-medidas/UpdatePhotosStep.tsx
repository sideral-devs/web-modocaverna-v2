'use client'

import { Button } from '@/components/ui/button'
import { Camera, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useShape } from '@/hooks/queries/use-shape'
import { toast } from 'sonner'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'

type PhotoType = 'frontal' | 'perfil esquerdo' | 'costas' | 'perfil direito'

interface ShapePhoto {
  url: string
  type: PhotoType
  base64: string
}

interface FormData {
  fotos: ShapePhoto[]
}

export function UpdatePhotosStep() {
  const router = useRouter()
  const { shapeRegistrations, updateShapeRegistration } = useShape()
  const lastRegistration =
    shapeRegistrations && shapeRegistrations.length > 1
      ? shapeRegistrations[shapeRegistrations.length - 1]
      : shapeRegistrations?.[0]

  const form = useForm<FormData>({
    defaultValues: {
      fotos: [],
    },
  })

  const { setValue, watch } = form
  const { fotos } = watch()

  const photoTypes: { type: PhotoType; label: string }[] = [
    { type: 'frontal', label: 'Frontal' },
    { type: 'perfil esquerdo', label: 'Perfil esquerdo' },
    { type: 'costas', label: 'Costas' },
    { type: 'perfil direito', label: 'Perfil direito' },
  ]

  // Check if at least one photo is uploaded
  const hasAnyNewPhoto = fotos.length > 0

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

  const onSubmit = async (data: FormData) => {
    if (!lastRegistration) {
      toast.error('Não foi possível atualizar as fotos')
      return
    }

    try {
      // Create an array with the same length as photoTypes
      const updatedPhotos = photoTypes.map((photoType, index) => {
        // Find if there's a new photo for this type
        const newPhoto = data.fotos.find(
          (photo) => photo.type === photoType.type,
        )

        if (newPhoto) {
          // If there's a new photo, use its base64
          return newPhoto.base64
        } else {
          // If no new photo, keep the existing one from lastRegistration
          return lastRegistration.fotos?.[index]
        }
      })

      await updateShapeRegistration({
        id: lastRegistration.shape_id,
        data: {
          ...lastRegistration,
          fotos: updatedPhotos.filter(
            (photo): photo is string => photo !== undefined,
          ),
        },
      })

      toast.success('Fotos atualizadas com sucesso!')
      router.push('/exercicios')
    } catch (error) {
      toast.error('Erro ao atualizar fotos')
    }
  }

  console.log(
    `${process.env.NEXT_PUBLIC_PROD_URL}/${lastRegistration?.fotos?.[0]}`,
  )

  const handleDeletePhoto = (type: PhotoType) => {
    const newPhotos = fotos.filter((photo) => photo.type !== type)
    setValue('fotos', newPhotos)
  }

  return (
    <div className="flex select-none w-[632px] overflow-y-auto px-1 flex-col flex-1 items-center gap-8">
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-3xl gap-8">
          <div className="flex mb-4 flex-col gap-2">
            <h2 className="text-2xl font-medium">
              Documente sua evolução física
            </h2>
            <p className="text-zinc-400 font-normal">
              Envie fotos do seu shape atual para acompanhar sua evolução.{' '}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              {photoTypes.map((photoType) => {
                const currentPhoto = fotos.find(
                  (p) => p.type === photoType.type,
                )
                const lastPhoto =
                  lastRegistration?.fotos?.[
                    photoTypes.findIndex((pt) => pt.type === photoType.type)
                  ]

                return (
                  <div key={photoType.type} className="flex flex-col gap-2">
                    <div className="relative group w-28 h-32 aspect-square rounded-2xl border border-zinc-700 overflow-hidden">
                      {currentPhoto || lastPhoto ? (
                        <div className="relative w-full h-full group">
                          <Image
                            src={
                              currentPhoto?.url ||
                              `${process.env.NEXT_PUBLIC_PROD_URL}/${lastPhoto}`
                            }
                            alt={photoType.label}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                              htmlFor={`photo-${photoType.type}`}
                              className="text-white bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full cursor-pointer"
                            >
                              <Upload size={16} />
                            </label>
                            {currentPhoto && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleDeletePhoto(photoType.type)
                                }}
                                className="text-white bg-red-500 hover:bg-red-600 transition-colors p-2 rounded-full"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor={`photo-${photoType.type}`}
                          className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="relative w-12 h-12">
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
                )
              })}
            </div>
          </div>

          <div className="flex justify-center fixed bg-black bottom-0 w-full border-t left-0 pb-4 pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => router.push('/exercicios')}
              >
                Cancelar
              </Button>
              <AutoSubmitButton
                onClick={form.handleSubmit(onSubmit)}
                disabled={!hasAnyNewPhoto}
              >
                Atualizar fotos
              </AutoSubmitButton>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
