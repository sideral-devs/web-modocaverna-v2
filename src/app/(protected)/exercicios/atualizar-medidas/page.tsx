'use client'

import { ProtectedRoute } from '@/components/protected-route'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { CloseButton } from '../../settings/CloseButton'
import { UpdateMeasurementsStep } from './UpdateMeasurementsStep'
import { UpdatePhotosStep } from './UpdatePhotosStep'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showPhotos = searchParams.get('photos') === 'true'

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen overflow-y-auto pb-[400px] items-center gap-6 bg-zinc-900">
        <header className="flex w-full pt-4 px-4 items-center justify-between ">
          <div className="w-1/3 "></div>
          <div className="flex flex-col w-1/3 justify-center max-w-3xl mx-auto items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
          </div>

          <div className="w-1/3 justify-end flex">
            <CloseButton
              onClick={() => router.push('/exercicios')}
              escapeTo="/exercicios"
            />
          </div>
        </header>
        {showPhotos ? <UpdatePhotosStep /> : <UpdateMeasurementsStep />}
      </div>
    </ProtectedRoute>
  )
}
