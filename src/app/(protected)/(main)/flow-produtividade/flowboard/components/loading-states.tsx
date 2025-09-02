'use client'

import { cn } from '@/lib/utils'
import { Loader2, Palette } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 className={cn(
      'animate-spin text-zinc-400',
      sizeClasses[size],
      className
    )} />
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-zinc-800 rounded loading-skeleton"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  )
}

interface BoardListLoadingProps {
  count?: number
}

export function BoardListLoading({ count = 3 }: BoardListLoadingProps) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg animate-pulse"
        >
          <div className="w-10 h-10 bg-zinc-800 rounded-lg loading-skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-zinc-800 rounded loading-skeleton" style={{ width: '70%' }} />
            <div className="h-3 bg-zinc-800 rounded loading-skeleton" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

interface CanvasLoadingProps {
  className?: string
}

export function CanvasLoading({ className }: CanvasLoadingProps) {
  return (
    <div className={cn(
      'flex-1 flex items-center justify-center bg-[#18181b]',
      className
    )}>
      <div className="text-center text-zinc-400 animate-fade-in-up">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Palette size={24} className="text-zinc-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl animate-pulse" />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm font-medium">Carregando canvas...</span>
        </div>
        
        <p className="text-xs text-zinc-500">
          Preparando seu espaço de trabalho
        </p>
      </div>
    </div>
  )
}

interface FlowBoardLoadingProps {
  className?: string
}

export function FlowBoardLoading({ className }: FlowBoardLoadingProps) {
  return (
    <div className={cn(
      'flex h-[600px] bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden',
      className
    )}>
      {/* Panel Loading */}
      <div className="w-80 bg-zinc-900/95 border-r border-zinc-800/60 p-4">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 bg-zinc-800 rounded loading-skeleton" style={{ width: '60%' }} />
            <div className="h-4 bg-zinc-800 rounded loading-skeleton" style={{ width: '20%' }} />
          </div>
          
          {/* Button skeleton */}
          <div className="h-10 bg-zinc-800 rounded-lg loading-skeleton" />
          
          {/* List skeleton */}
          <BoardListLoading count={3} />
        </div>
      </div>
      
      {/* Canvas Loading */}
      <CanvasLoading className="flex-1" />
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ 
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Tente novamente.',
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="w-16 h-16 bg-red-950/50 rounded-2xl flex items-center justify-center mb-4">
        <svg 
          className="w-8 h-8 text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 mb-4 max-w-sm">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}