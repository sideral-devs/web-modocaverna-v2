'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, ArrowRight, ArrowLeft, Lightbulb, MousePointer, Keyboard, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  icon?: React.ReactNode
  action?: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao FlowBoard!',
    description: 'Seu quadro branco digital para organizar ideias, criar mapas mentais e fluxos de trabalho.',
    icon: <Lightbulb className="w-5 h-5" />,
    action: 'Vamos começar!'
  },
  {
    id: 'create-board',
    title: 'Crie seu primeiro quadro',
    description: 'Clique em "Criar novo Quadro" para começar. Você pode ter até 10 quadros diferentes.',
    target: '[data-onboarding="create-board"]',
    position: 'right',
    icon: <MousePointer className="w-5 h-5" />
  },
  {
    id: 'canvas-basics',
    title: 'Área do canvas',
    description: 'Aqui é onde a mágica acontece! Clique duplo para adicionar texto, ou use as ferramentas da barra superior.',
    target: '[data-onboarding="canvas"]',
    position: 'top',
    icon: <MousePointer className="w-5 h-5" />
  },
  {
    id: 'paste-images',
    title: 'Cole imagens facilmente',
    description: 'Copie qualquer imagem e cole com Ctrl+V diretamente no canvas. As imagens serão otimizadas automaticamente.',
    target: '[data-onboarding="canvas"]',
    position: 'top',
    icon: <Image className="w-5 h-5" />
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Atalhos do teclado',
    description: 'Use Ctrl+Z para desfazer, Delete para excluir elementos, e Ctrl+S para salvar manualmente.',
    icon: <Keyboard className="w-5 h-5" />
  },
  {
    id: 'auto-save',
    title: 'Salvamento automático',
    description: 'Suas alterações são salvas automaticamente a cada 2 segundos. Você pode ver o status no canto superior direito.',
    target: '[data-onboarding="save-status"]',
    position: 'bottom'
  }
]

interface OnboardingTourProps {
  onComplete?: () => void
  onSkip?: () => void
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
  const isFirstStep = currentStep === 0

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('flowboard-onboarding-completed')
    if (!hasCompletedOnboarding) {
      setIsVisible(true)
    }
  }, [])

  // Find target element when step changes
  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement
      setTargetElement(element)
    } else {
      setTargetElement(null)
    }
  }, [step.target])

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('flowboard-onboarding-completed', 'true')
    setIsVisible(false)
    onComplete?.()
  }

  const handleSkip = () => {
    localStorage.setItem('flowboard-onboarding-completed', 'true')
    setIsVisible(false)
    onSkip?.()
  }

  const getTooltipPosition = () => {
    if (!targetElement || !step.position) return {}

    const rect = targetElement.getBoundingClientRect()
    const tooltipWidth = 320
    const tooltipHeight = 200

    switch (step.position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - 16,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
        }
      case 'bottom':
        return {
          top: rect.bottom + 16,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
        }
      case 'left':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.left - tooltipWidth - 16
        }
      case 'right':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.right + 16
        }
      default:
        return {}
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300">
        {/* Highlight target element */}
        {targetElement && (
          <div
            className="absolute border-2 border-cyan-400 rounded-lg shadow-lg shadow-cyan-400/50 animate-pulse"
            style={{
              top: targetElement.offsetTop - 4,
              left: targetElement.offsetLeft - 4,
              width: targetElement.offsetWidth + 8,
              height: targetElement.offsetHeight + 8,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Tooltip */}
        <div
          className={cn(
            "absolute bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-2xl max-w-sm animate-in slide-in-from-bottom-4 duration-300",
            !targetElement && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
          style={targetElement ? getTooltipPosition() : {}}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStep ? "bg-cyan-400" : "bg-zinc-600"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-400 ml-2">
              {currentStep + 1} de {ONBOARDING_STEPS.length}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {step.icon && (
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 flex-shrink-0">
                  {step.icon}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Pular tutorial
              </Button>

              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isLastStep ? 'Finalizar' : step.action || 'Próximo'}
                  {!isLastStep && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook to restart onboarding
export function useOnboardingTour() {
  const restartTour = () => {
    localStorage.removeItem('flowboard-onboarding-completed')
    window.location.reload()
  }

  const hasCompletedTour = () => {
    return localStorage.getItem('flowboard-onboarding-completed') === 'true'
  }

  return {
    restartTour,
    hasCompletedTour
  }
}