'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { X, Lightbulb } from 'lucide-react'

interface TooltipProps {
  children: React.ReactNode
  content: string
  title?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  className?: string
  disabled?: boolean
}

export function FeatureTooltip({
  children,
  content,
  title,
  position = 'top',
  trigger = 'hover',
  delay = 500,
  className,
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    if (disabled) return
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true)
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setIsVisible(false)
    setTimeout(() => setShouldShow(false), 150) // Wait for animation
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 px-3 py-2 text-xs bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-w-xs transition-all duration-150"
    
    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2", 
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2"
    }

    const visibilityClasses = isVisible 
      ? "opacity-100 scale-100" 
      : "opacity-0 scale-95 pointer-events-none"

    return cn(baseClasses, positionClasses[position], visibilityClasses)
  }

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-zinc-800 border border-zinc-700 rotate-45"
    
    const arrowPositions = {
      top: "top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0",
      bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0",
      left: "left-full top-1/2 -translate-y-1/2 -ml-1 border-l-0 border-b-0",
      right: "right-full top-1/2 -translate-y-1/2 -mr-1 border-r-0 border-t-0"
    }

    return cn(baseClasses, arrowPositions[position])
  }

  const triggerProps = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip
    }),
    ...(trigger === 'click' && {
      onClick: () => isVisible ? hideTooltip() : showTooltip()
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip
    })
  }

  return (
    <div className={cn("relative inline-block", className)} {...triggerProps}>
      {children}
      
      {shouldShow && (
        <div ref={tooltipRef} className={getTooltipClasses()}>
          <div className={getArrowClasses()} />
          {title && (
            <div className="font-medium text-zinc-200 mb-1 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-yellow-400" />
              {title}
            </div>
          )}
          <div className="text-zinc-300 leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

// Persistent tooltip for important features
interface PersistentTooltipProps {
  target: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  onDismiss?: () => void
  dismissKey?: string
}

export function PersistentTooltip({
  target,
  title,
  content,
  position = 'top',
  onDismiss,
  dismissKey
}: PersistentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Check if tooltip was dismissed
    if (dismissKey && localStorage.getItem(`tooltip-dismissed-${dismissKey}`)) {
      return
    }

    // Find target element
    const element = document.querySelector(target) as HTMLElement
    if (element) {
      setTargetElement(element)
      setIsVisible(true)
    }
  }, [target, dismissKey])

  const handleDismiss = () => {
    if (dismissKey) {
      localStorage.setItem(`tooltip-dismissed-${dismissKey}`, 'true')
    }
    setIsVisible(false)
    onDismiss?.()
  }

  const getTooltipPosition = () => {
    if (!targetElement) return {}

    const rect = targetElement.getBoundingClientRect()
    const tooltipWidth = 280
    const tooltipHeight = 120

    switch (position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - 12,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
        }
      case 'bottom':
        return {
          top: rect.bottom + 12,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
        }
      case 'left':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.left - tooltipWidth - 12
        }
      case 'right':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.right + 12
        }
      default:
        return {}
    }
  }

  if (!isVisible || !targetElement) return null

  return (
    <div
      className="fixed z-50 bg-gradient-to-r from-cyan-900 to-cyan-800 border border-cyan-600 rounded-lg shadow-2xl p-4 max-w-xs animate-in slide-in-from-bottom-2 duration-300"
      style={getTooltipPosition()}
    >
      {/* Arrow */}
      <div className={cn(
        "absolute w-3 h-3 bg-cyan-800 border border-cyan-600 rotate-45",
        position === 'top' && "bottom-full left-1/2 -translate-x-1/2 mb-1.5 border-t-0 border-l-0",
        position === 'bottom' && "top-full left-1/2 -translate-x-1/2 mt-1.5 border-b-0 border-r-0",
        position === 'left' && "right-full top-1/2 -translate-y-1/2 mr-1.5 border-l-0 border-b-0",
        position === 'right' && "left-full top-1/2 -translate-y-1/2 ml-1.5 border-r-0 border-t-0"
      )} />

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-cyan-300 hover:text-cyan-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="pr-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <Lightbulb className="w-3 h-3 text-cyan-300" />
          </div>
          <h4 className="text-sm font-semibold text-cyan-100">
            {title}
          </h4>
        </div>
        <p className="text-xs text-cyan-200 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  )
}

// Hook to manage feature discovery
export function useFeatureDiscovery() {
  const [discoveredFeatures, setDiscoveredFeatures] = useState<string[]>([])

  useEffect(() => {
    const discovered = localStorage.getItem('flowboard-discovered-features')
    if (discovered) {
      setDiscoveredFeatures(JSON.parse(discovered))
    }
  }, [])

  const markFeatureDiscovered = (featureKey: string) => {
    const updated = [...discoveredFeatures, featureKey]
    setDiscoveredFeatures(updated)
    localStorage.setItem('flowboard-discovered-features', JSON.stringify(updated))
  }

  const isFeatureDiscovered = (featureKey: string) => {
    return discoveredFeatures.includes(featureKey)
  }

  const resetDiscovery = () => {
    setDiscoveredFeatures([])
    localStorage.removeItem('flowboard-discovered-features')
  }

  return {
    markFeatureDiscovered,
    isFeatureDiscovered,
    resetDiscovery,
    discoveredFeatures
  }
}