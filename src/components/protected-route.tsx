'use client'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { usePopupDesafio } from '@/store/usePopupDesafio'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import dayjs from 'dayjs'

export function ProtectedRoute({
  children,
  level = 'basic',
}: {
  children: ReactNode
  level?: 'basic' | 'non-trial' | 'admin'
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { show } = usePopupDesafio()
  const { token, hasHydrated } = useAuthStore()
  const { data: user, error, isLoading: userLoading } = useUser()
  const [checkedAccess, setCheckedAccess] = useState(false)
  dayjs.locale('pt-br')

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

  useEffect(() => {
    if (!user || !pathname) return

    const userPlan = user.plan?.toLowerCase()
    if (user.status_plan === 'REEMBOLSO') {
      router.push('/settings/plans')
      return
    }

    // Exemplo: se plano trial tenta acessar algo de non-trial
    if (user && level === 'non-trial' && userPlan === 'trial') {
      console.log('entrou no if 3')
      router.push('/dashboard')
      return
    }

    setCheckedAccess(true)
  }, [user, pathname, level, router, show])

  if (!token || !user || userLoading || !checkedAccess) {
    return null
  }

  api.defaults.headers.Authorization = `Bearer ${token}`

  return <>{children}</>
}
