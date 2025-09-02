'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  return (
    <div className={cn(
      // Base layout
      "flex flex-col lg:flex-row h-full w-full",
      // Responsive spacing and gaps
      "gap-0 lg:gap-0",
      // Smooth transitions
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsivePanelProps {
  children: ReactNode
  className?: string
  side?: 'left' | 'right'
  collapsible?: boolean
  collapsed?: boolean
}

export function ResponsivePanel({ 
  children, 
  className, 
  side = 'left',
  collapsible = false,
  collapsed = false 
}: ResponsivePanelProps) {
  return (
    <div className={cn(
      // Base panel styles
      "flex flex-col bg-zinc-900/95 backdrop-blur-sm",
      // Responsive width and positioning
      side === 'left' && [
        "w-full lg:w-80 xl:w-96",
        "lg:border-r lg:border-zinc-800/60"
      ],
      side === 'right' && [
        "w-full lg:w-80 xl:w-96", 
        "lg:border-l lg:border-zinc-800/60"
      ],
      // Collapsible behavior
      collapsible && collapsed && "lg:w-0 lg:overflow-hidden",
      // Smooth transitions
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveMainProps {
  children: ReactNode
  className?: string
}

export function ResponsiveMain({ children, className }: ResponsiveMainProps) {
  return (
    <div className={cn(
      // Base main content area
      "flex-1 flex flex-col min-h-0",
      // Responsive behavior
      "w-full",
      // Smooth transitions
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {children}
    </div>
  )
}

// Responsive breakpoint hooks
export function useResponsiveBreakpoint() {
  if (typeof window === 'undefined') return 'lg'
  
  const width = window.innerWidth
  
  if (width < 640) return 'sm'
  if (width < 768) return 'md'  
  if (width < 1024) return 'lg'
  if (width < 1280) return 'xl'
  if (width < 1536) return '2xl'
  return '3xl'
}

// Mobile detection utility
export function useIsMobile() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 1024
}