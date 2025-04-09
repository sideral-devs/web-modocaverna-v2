'use client'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { usePopupDesafio } from '@/store/usePopupDesafio'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { protectedRoutesChallengePlan } from '@/lib/protectedRoutes'
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
  const [blockedByPlan, setBlockedByPlan] = useState(false)
  const [checkedAccess, setCheckedAccess] = useState(false)
  dayjs.locale('pt-br')
  // Redirecionar se não tiver token
  useEffect(() => {
    if (hasHydrated && !token) {
      router.push('/login')
    }
  }, [token, hasHydrated, router])

  // Redirecionar se erro no carregamento do user
  useEffect(() => {
    if (error) {
      router.push('/login')
    }
  }, [error, router])

  useEffect(() => {
    if (!user || !pathname) return

    const userPlan = user.plan?.toLowerCase()
    const actualDate = dayjs()
    const purchaseDate = dayjs(user.data_de_compra)
    const afterSevenDays = purchaseDate.add(7, 'day')
    const isProtected = protectedRoutesChallengePlan.some((route) =>
      pathname.startsWith(route),
    )

    console.log(
      'pathname',
      pathname,
      user.data_de_compra,
      level,
      isProtected,
      actualDate.isAfter(afterSevenDays),
    )
    if (
      isProtected &&
      userPlan === 'desafio' &&
      actualDate.isAfter(afterSevenDays)
    ) {
      router.push('/settings/plans') // TODO VER A ROTA QUE VAI COLOCAR AQUI ESPECÍFICAMENTE.
      return
    }
    if (
      isProtected &&
      userPlan === 'desafio' &&
      actualDate.isAfter(afterSevenDays)
    ) {
      // Mostrar modal e bloquear renderização
      show()
      setBlockedByPlan(true)
      setCheckedAccess(true)
      return
    }

    // Exemplo: se plano trial tenta acessar algo de non-trial
    if (user && level === 'non-trial' && userPlan === 'trial') {
      console.log('entrou no if 3')
      router.push('/dashboard')
      return
    }

    // Exemplo: rota inválida ou usuário sem permissão alguma
    // Aqui você pode expandir com base no `level === 'admin'`, por exemplo

    // Se passou em tudo, libera
    setCheckedAccess(true)
  }, [user, pathname, level, router, show])

  if (!token || !user || userLoading || !checkedAccess) {
    return null
  }

  if (blockedByPlan) {
    return null
  }

  api.defaults.headers.Authorization = `Bearer ${token}`

  return <>{children}</>
}
