'use client'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export function ProtectedRoute({
  children,
  level = 'basic',
}: {
  children: ReactNode
  level?: 'basic' | 'non-trial' | 'admin'
}) {
  const router = useRouter()
  const { token, hasHydrated } = useAuthStore()
  const { data: user, error } = useUser()

  useEffect(() => {
    if (hasHydrated && !token) {
      router.push('/login')
    }
  }, [token, hasHydrated, router])

  useEffect(() => {
    if (error) {
      router.push('/login')
    }
  }, [error, router])

  if (!token || !user) {
    return null
  }

  if (user && level === 'non-trial') {
    if (user.plan.toLowerCase() === 'trial') {
      router.push('/dashboard')
      return null
    }
  }

  api.defaults.headers.Authorization = `Bearer ${token}`

  return <>{children}</>
}
