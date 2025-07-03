'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useInteractionStore } from '@/store/interaction-store'
import { useEffect } from 'react'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { setHasUserInteracted } = useInteractionStore()

  useEffect(() => {
    const handleInteraction = () => {
      setHasUserInteracted(true)
      window.removeEventListener('click', handleInteraction)
    }

    window.addEventListener('click', handleInteraction)
    return () => window.removeEventListener('click', handleInteraction)
  }, [])

  return <ProtectedRoute>{children}</ProtectedRoute>
}
