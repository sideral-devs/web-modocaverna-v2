'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/queries/use-user'
import { useFlowBoardStore } from '../hooks/use-flowboard-store'

interface FlowBoardProviderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FlowBoardProvider({ children, fallback }: FlowBoardProviderProps) {
  const { data: user } = useUser()
  const [isInitialized, setIsInitialized] = useState(false)
  const { initializeService, loadBoards, service } = useFlowBoardStore()

  useEffect(() => {
    if (user?.id && !service) {
      initializeService(user.id)
    }
  }, [user?.id, service, initializeService])

  useEffect(() => {
    if (service && !isInitialized) {
      loadBoards().finally(() => {
        setIsInitialized(true)
      })
    }
  }, [service, isInitialized, loadBoards])

  if (!user?.id || !service || !isInitialized) {
    return (
      <>
        {fallback || (
          <div className="flex w-full h-full items-center justify-center bg-zinc-950">
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
              <span>Inicializando FlowBoard...</span>
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}