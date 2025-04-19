'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import { useOnboardingStore } from '@/store/onboarding'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CloseButton } from '../../settings/CloseButton'
import { ShapeConfigStep } from '../steps/ShapeConfigStep'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { UpdateMeasurementsStep } from '../steps/UpdateMeasurementsStep'

export default function Page() {
  const router = useRouter()
  const { data: user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const { cellphone } = useOnboardingStore()

  async function handleNext(data: any) {
    try {
      setIsLoading(true)
      await api.post('/registro-de-shape/store', data)
      toast.success('Medidas atualizadas com sucesso!')
      router.replace('/exercicios')
    } catch (error) {
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen items-center gap-6 bg-zinc-900">
        <header className="flex fixed w-full pt-4 items-center justify-between p-6">
          <span className="text-sm w-1/3 text-muted-foreground">
            Atualizar medidas
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
          <UpdateMeasurementsStep onNext={handleNext} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
