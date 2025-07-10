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
import { useEffect, useState } from 'react'

interface TutorialStep {
  id: number
  title: string
  description: string
  elementId?: string
  dialogPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'bottomLeft'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Bem vindo ao Tutorial Caverna',
    description:
      'Aqui você vai conhecer as principais funções do sistema e aprender a usar cada ferramenta com inteligência e propósito.',
    elementId: undefined,
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'HUBS de ferramentas',
    description:
      'Os HUBS organizam suas ferramentas por objetivo. Navegue entre eles para acessar diferentes áreas de desenvolvimento.',
    elementId: 'hubs',
    dialogPosition: 'bottom',
  },
  {
    id: 3,
    title: 'Perfil e configurações',
    description: 'Personalize sua experiência e acompanhe seu progresso.',
    elementId: 'perfil',
    dialogPosition: 'bottomLeft',
  },
  {
    id: 4,
    title: 'Central Caverna',
    description:
      'A CENTRAL CAVERNA é o coração do sistema. É onde tudo começa e  onde você sempre retorna para evoluir!',
    elementId: 'central-caverna',
    dialogPosition: 'right',
  },
  {
    id: 5,
    title: 'Streak',
    description:
      'Seu streak mostra sua consistência! Manter a chama acesa diariamente é o segredo da transformação.',
    elementId: 'streak',
    dialogPosition: 'right',
  },
  {
    id: 6,
    title: 'Rituais',
    description:
      'Seus rituais moldam sua evolução. A forma como você inicia e encerra o dia define quem você se torna.',
    elementId: 'rituais',
    dialogPosition: 'right',
  },
  {
    id: 7,
    title: 'Sua Rotina Cavernosa',
    description:
      'Organize seus dias com intenção. Agenda de compromissos, treinos, refeições e rituais — tudo em um só lugar, pra manter a  disciplina e o controle da sua evolução.',
    elementId: 'rotina-cavernosa',
    dialogPosition: 'left',
  },
  {
    id: 8,
    title: 'Desafio Caverna',
    description:
      'O Desafio Caverna é uma jornada de 40 dias rumo à sua transformação. Um período intenso de disciplina, renúncia e evolução.',
    elementId: 'desafio-caverna',
    dialogPosition: 'right',
  },
  {
    id: 9,
    title: 'Flow Produtividade',
    description:
      'Entre no estado de FLOW! Sessões de foco máximo com bloqueio de distrações para você produzir em alta performance.',
    elementId: 'flow-produtividade',
    dialogPosition: 'right',
  },
]

export function DashboardTour({
  active,
  setIsActive,
}: {
  active: boolean
  setIsActive: (arg: boolean) => void
}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (!active) return

    const step = tutorialSteps[currentStep]
    const el = step.elementId
      ? document.querySelector(`[data-tutorial-id="${step.elementId}"]`)
      : null

    if (el) {
      const rect = el.getBoundingClientRect()
      console.log(rect)
      setHighlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    } else {
      setHighlightRect({ top: 0, left: 0, width: 0, height: 0 })
    }
  }, [active, currentStep])

  const closeTutorial = () => {
    setIsActive(false)
    setCurrentStep(0)
    router.replace('/dashboard')
  }

  const handleFinish = () => {
    router.replace('/onboarding/concluido')
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
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

  const currentStepData = tutorialSteps[currentStep]

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
        return {
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)',
          position: 'absolute' as const,
        }
      case 'bottom':
        return {
          top: rect.top + rect.height + 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)',
          position: 'absolute' as const,
        }
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
          transform: 'translate(-100%, -50%)',
          position: 'absolute' as const,
        }
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width + 10,
          transform: 'translate(0, -50%)',
          position: 'absolute' as const,
        }
      case 'bottomLeft':
        return {
          top: rect.top + rect.height + 10,
          left: rect.left - 10,
          transform: 'translate(-100%, 0)',
          position: 'absolute' as const,
        }
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  if (!active) return null

  return (
    <div className="absolute inset-0 z-50">
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
      >
        <CardHeader className="flex flex-col items-start px-6 py-4 gap-4">
          <div className="w-full flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Passo {currentStep + 1} de {tutorialSteps.length}
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
            {tutorialSteps.map((_, index) => (
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
              {currentStep === tutorialSteps.length - 1 ? (
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

      <Button
        variant="ghost"
        size="sm"
        onClick={closeTutorial}
        className="absolute bottom-4 right-4 z-52 text-white hover:bg-white/20"
      >
        Pular Tutorial
      </Button>
    </div>
  )
}
