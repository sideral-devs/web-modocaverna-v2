'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface TutorialStep {
  id: number
  title: string
  description: string
  elementId?: string
  dialogPosition:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center'
    | 'bottomLeft'
    | 'topLeft'
    | 'inside' // nova opção
}

type GuidedTourProps = {
  data: TutorialStep[]
  active: boolean
  setIsActive: (arg: boolean) => void
  redirect?: boolean
  origin?: string
  containerRef?: MutableRefObject<HTMLDivElement | null>
}

export function GuidedTour(props: GuidedTourProps) {
  const { data, active, setIsActive, origin, containerRef } = props
  const router = useRouter()
  const scrollableRef = useRef<HTMLDivElement | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (!active) return

    const step = data[currentStep]
    const el = step.elementId
      ? document.querySelector(`[data-tutorial-id="${step.elementId}"]`)
      : null

    if (el) {
      if (containerRef?.current) {
        const elRect = el.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        setHighlightRect({
          top: elRect.top - containerRect.top,
          left: elRect.left - containerRect.left,
          width: elRect.width,
          height: elRect.height,
        })
      } else {
        const rect = el.getBoundingClientRect()

        setHighlightRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      }
    } else {
      setHighlightRect({ top: 0, left: 0, width: 0, height: 0 })
    }
  }, [active, containerRef, currentStep, data])

  const closeTutorial = () => {
    setIsActive(false)
    setCurrentStep(0)

    router.replace(origin || '/dashboard')
  }

  const handleFinish = () => {
    closeTutorial()
  }

  const nextStep = () => {
    if (currentStep < data.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const currentStepData = data[currentStep]

  const CLAMP_MARGIN = 16
  const CARD_WIDTH = 360
  const CARD_HEIGHT = 260

  const clampStyle = (
    style: Record<string, number | string>,
  ): Record<string, number | string> => {
    if (typeof window === 'undefined') return style

    const clamped = { ...style }

    if (typeof clamped.left === 'number') {
      clamped.left = Math.min(
        Math.max(clamped.left, CLAMP_MARGIN),
        window.innerWidth - CARD_WIDTH - CLAMP_MARGIN,
      )
    }

    if (typeof clamped.top === 'number') {
      clamped.top = Math.min(
        Math.max(clamped.top, CLAMP_MARGIN),
        window.innerHeight - CARD_HEIGHT - CLAMP_MARGIN,
      )
    }

    return clamped
  }

  const getDialogPosition = () => {
    const rect = highlightRect
    const dialogPosition = currentStepData.dialogPosition

    if (!rect.top && !rect.left) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    switch (dialogPosition) {
      case 'top':
        return clampStyle({
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)',
          position: 'absolute' as const,
        })
      case 'bottom':
        return clampStyle({
          top: rect.top + rect.height + 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)',
          position: 'absolute' as const,
        })
      case 'left':
        return clampStyle({
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
          transform: 'translate(-100%, -50%)',
          position: 'absolute' as const,
        })
      case 'right':
        return clampStyle({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width + 10,
          transform: 'translate(0, -50%)',
          position: 'absolute' as const,
        })
      case 'bottomLeft':
        return clampStyle({
          top: rect.top + rect.height + 10,
          left: rect.left - 10,
          transform: 'translate(-100%, 0)',
          position: 'absolute' as const,
        })
      case 'topLeft':
        return clampStyle({
          top: rect.top - 10,
          left: rect.left - 10,
          transform: 'translate(-100%, -100%)',
          position: 'absolute' as const,
        })
      case 'inside':
        return clampStyle({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -50%)',
          position: 'absolute' as const,
        })
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  const scrollToDialog = useCallback(() => {
    if (!scrollableRef.current || !active) return

    const dialog = scrollableRef.current
    setTimeout(() => {
      dialog.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }, 50)
  }, [active])

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToDialog()
    }, 100)
    return () => clearTimeout(timer)
  }, [scrollToDialog])

  if (!active) return null

  return (
    <div className="hidden md:block absolute inset-0 z-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute bg-white/10 border-2 border-primary rounded-lg shadow-2xl"
          style={{
            left: `${highlightRect.left}px`,
            top: `${highlightRect.top}px`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            zIndex: 51,
          }}
        />
      </div>

      <Card
        className="absolute max-w-md z-[52] shadow-2xl border-2"
        style={getDialogPosition()}
        ref={scrollableRef}
      >
        <CardHeader className="flex flex-col items-start px-6 py-4 gap-4">
          <div className="w-full flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Passo {currentStep + 1} de {data.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={closeTutorial}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {currentStepData.description}
          </CardDescription>

          <div className="flex justify-center space-x-1">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                      ? 'bg-red-700'
                      : 'bg-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              Anterior
            </Button>

            <Button size="sm" onClick={nextStep} className="gap-1">
              {currentStep === data.length - 1 ? (
                'Finalizar'
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-3 h-3" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Button
        variant="ghost"
        size="sm"
        onClick={closeTutorial}
        className="absolute bottom-4 right-4 z-52 text-white hover:bg-white/20"
      >
        Pular Tutorial
      </Button> */}
    </div>
  )
}
