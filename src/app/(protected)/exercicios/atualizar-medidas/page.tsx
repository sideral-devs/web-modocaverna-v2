'use client'

import { ProtectedRoute } from '@/components/protected-route'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CloseButton } from '../../settings/CloseButton'
import { UpdateMeasurementsStep } from '../steps/UpdateMeasurementsStep'
import { UpdatePhotosStep } from '../steps/UpdatePhotosStep'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useShape } from '@/hooks/queries/use-shape'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // const { data: user } = useUser()
  // const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  // @ts-expect-error: tipagem propositalmente ignorada (refatorar depois)
  const [measurementsData, setMeasurementsData] = useState(null as any)

  // const { cellphone } = useOnboardingStore()
  const { shapeRegistrations } = useShape()
  const lastShapeRegistration =
    shapeRegistrations?.[shapeRegistrations.length - 1]

  // Check if we should start with photos
  useEffect(() => {
    const startWithPhotos = searchParams.get('photos') === 'true'
    if (startWithPhotos) {
      setCurrentStep(2)
      // Use last shape registration data for measurements
      if (lastShapeRegistration) {
        setMeasurementsData({
          membros_superiores: lastShapeRegistration.membros_superiores,
          membros_inferiores: lastShapeRegistration.membros_inferiores,
          altura: lastShapeRegistration.altura,
          peso: lastShapeRegistration.peso,
          classificacao: lastShapeRegistration.classificacao,
          imc: lastShapeRegistration.imc,
          nivel_satisfacao: lastShapeRegistration.satisfeito_fisico
            ? 'Satisfeito'
            : 'Não satisfeito',
          objetivo: lastShapeRegistration.objetivo,
          fotos: lastShapeRegistration.fotos,
        })
      }
    }
  }, [searchParams, lastShapeRegistration])

  async function handleMeasurementsNext(data: any) {
    setMeasurementsData(data)
    setCurrentStep(2)
  }

  async function handlePhotosNext(data: any) {
    try {
      // setIsLoading(true)
      // Merge measurements and photos data
      const finalData = {
        ...measurementsData,
        ...data,
      }
      await api.post('/registro-de-shape/store', finalData)
      toast.success('Medidas e fotos atualizadas com sucesso!')
      router.replace('/exercicios')
    } catch (error) {
      console.log(error)
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      // setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen items-center gap-6 bg-zinc-900">
        <header className="flex fixed w-full pt-4 items-center justify-between p-6">
          <span className="text-sm w-1/3 text-muted-foreground">
            {currentStep === 1 ? 'Atualizar medidas' : 'Atualizar fotos'}
          </span>
          <div className="flex flex-col w-2/3 max-w-2xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
          </div>

          <div className="flex w-1/3 justify-end">
            <CloseButton href="/exercicios" />
          </div>
        </header>
        <div className="flex flex-col flex-1 w-full items-center pt-28">
          {currentStep === 1 ? (
            <UpdateMeasurementsStep onNext={handleMeasurementsNext} />
          ) : (
            <UpdatePhotosStep onNext={handlePhotosNext} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
