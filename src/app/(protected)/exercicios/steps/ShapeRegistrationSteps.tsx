'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { InputWithSuffix } from '@/components/ui/input-with-suffix'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import { createShapeRegistration } from '@/lib/api/shape'

type PhotoType = 'frontal' | 'lateral' | 'costas' | 'lateral2'

interface ShapePhoto {
  url: string
  type: PhotoType
  base64: string
}

interface FormData {
  membros_superiores: {
    ombro: number
    peito: number
    biceps_direito: number
    biceps_esquerdo: number
    triceps_direito: number
    triceps_esquerdo: number
  }
  membros_inferiores: {
    gluteos: number
    quadril: number
    quadriceps_direito: number
    quadriceps_esquerdo: number
    panturrilha_direita: number
    panturrilha_esquerda: number
  }
  satisfeito_fisico: number
  classificacao: string
  imc: number
  altura: number
  peso: number
  texto_meta: string
  nivel_satisfacao: string
  objetivo: 'perder' | 'manter' | 'ganhar'
  peso_meta: number
  fotos: string[]
}

export function ShapeRegistrationSteps() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<ShapePhoto[]>([])
  const [formData, setFormData] = useState<FormData>({
    membros_superiores: {
      ombro: 0,
      peito: 0,
      biceps_direito: 0,
      biceps_esquerdo: 0,
      triceps_direito: 0,
      triceps_esquerdo: 0,
    },
    membros_inferiores: {
      gluteos: 0,
      quadril: 0,
      quadriceps_direito: 0,
      quadriceps_esquerdo: 0,
      panturrilha_direita: 0,
      panturrilha_esquerda: 0,
    },
    satisfeito_fisico: 0,
    classificacao: '',
    imc: 0,
    altura: 0,
    peso: 0,
    texto_meta: '',
    nivel_satisfacao: '',
    objetivo: 'manter',
    peso_meta: 0,
    fotos: [],
  })

  const { mutate: submitShapeRegistration, isPending } = useMutation({
    mutationFn: createShapeRegistration,
    onSuccess: () => {
      toast.success('Registro de shape salvo com sucesso!')
      router.push('/exercicios')
    },
    onError: (error) => {
      console.error('Error saving shape registration:', error)
      toast.error('Erro ao salvar registro de shape. Tente novamente.')
    },
  })

  const photoTypes: { type: PhotoType; label: string }[] = [
    { type: 'frontal', label: 'Frontal' },
    { type: 'lateral', label: 'Lateral' },
    { type: 'costas', label: 'Costas' },
    { type: 'lateral2', label: 'Lateral' },
  ]

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      const formDataWithPhotos = {
        ...formData,
        fotos: photos.map((photo) => photo.base64),
      }
      submitShapeRegistration(formDataWithPhotos)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

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

    const newPhotos = photos.filter((photo) => photo.type !== type)
    setPhotos([...newPhotos, { url, type, base64 }])
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Registro de Shape</h2>
        <div className="flex gap-2">
          <span className="text-sm text-zinc-400">
            Passo {currentStep} de 3
          </span>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium">Medidas Corporais</h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-medium text-zinc-400">
                Membros Superiores
              </h4>
              <div className="flex flex-col gap-4">
                {Object.entries(formData.membros_superiores).map(
                  ([key, value]) => (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="text-sm capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <InputWithSuffix
                        value={value}
                        onChange={(e) =>
                          updateFormData('membros_superiores', {
                            ...formData.membros_superiores,
                            [key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        suffix="cm"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-medium text-zinc-400">
                Membros Inferiores
              </h4>
              <div className="flex flex-col gap-4">
                {Object.entries(formData.membros_inferiores).map(
                  ([key, value]) => (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="text-sm capitalize">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <InputWithSuffix
                        value={value}
                        onChange={(e) =>
                          updateFormData('membros_inferiores', {
                            ...formData.membros_inferiores,
                            [key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        suffix="cm"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium">Dados Pessoais</h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm">Altura</label>
              <InputWithSuffix
                value={formData.altura}
                onChange={(e) =>
                  updateFormData('altura', parseFloat(e.target.value) || 0)
                }
                suffix="cm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Peso</label>
              <InputWithSuffix
                value={formData.peso}
                onChange={(e) =>
                  updateFormData('peso', parseFloat(e.target.value) || 0)
                }
                suffix="kg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Peso Meta</label>
              <InputWithSuffix
                value={formData.peso_meta}
                onChange={(e) =>
                  updateFormData('peso_meta', parseFloat(e.target.value) || 0)
                }
                suffix="kg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Objetivo</label>
              <Select
                value={formData.objetivo}
                onValueChange={(value: 'perder' | 'manter' | 'ganhar') =>
                  updateFormData('objetivo', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perder">Perder peso</SelectItem>
                  <SelectItem value="manter">Manter peso</SelectItem>
                  <SelectItem value="ganhar">Ganhar massa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-medium">Fotos</h3>
          <div className="grid grid-cols-4 gap-4">
            {photoTypes.map((photoType) => (
              <div key={photoType.type} className="relative aspect-square">
                <div className="relative group w-full h-full rounded-lg border border-zinc-700 overflow-hidden">
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
                      <Camera className="group-hover:text-white w-6 h-6 text-zinc-400" />
                      <span className="text-sm text-zinc-400 mt-2">
                        {photoType.label}
                      </span>
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
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
        )}
        <Button onClick={handleNext} disabled={isPending}>
          {currentStep === 3 ? 'Finalizar' : 'Próximo'}
        </Button>
      </div>
    </div>
  )
}
