'use client'

import { useTourMenu } from '@/store/tour-menu'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const { setOpen } = useTourMenu()

  useEffect(() => {
    setOpen(true)

    const timeout = setTimeout(() => {
      router.replace('/dashboard')
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  return null
}
