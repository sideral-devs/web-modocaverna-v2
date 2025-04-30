'use client'

import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CloseButton } from '../../settings/CloseButton'
import { UpdateMeasurementsStep } from './UpdateMeasurementsStep'
import { UpdatePhotosStep } from './UpdatePhotosStep'
import { PhaseCounter } from '@/app/(public)/trial/sign-up/PhaseCounter'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const showPhotos = searchParams.get('photos') === 'true'

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen overflow-y-auto pb-[400px] items-center gap-6 bg-zinc-900">
        <header className="flex w-full pt-4 items-center justify-between ">
          <div className="flex flex-col w-full max-w-3xl mx-auto items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
          </div>

          <CloseButton onClick={() => router.back()} escapeTo="/exercicios" />
        </header>
        {showPhotos ? <UpdatePhotosStep /> : <UpdateMeasurementsStep />}
      </div>
    </ProtectedRoute>
  )
}
