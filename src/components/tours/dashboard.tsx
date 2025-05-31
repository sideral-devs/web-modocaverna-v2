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
import { ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react'
import { useState } from 'react'

interface TutorialStep {
  id: number
  title: string
  description: string
  highlight: {
    x: number
    y: number
    width: number
    height: number
  }
  dialogPosition: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Bem vindo ao Tutorial Caverna',
    description:
      'Este tutorial serve para mostrar as principais funcionalidades do sisteme e te ajudar a usar suas ferramentas ao máximo',
    highlight: { x: 0, y: 0, width: 0, height: 0 },
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'HUBS',
    description:
      'Os HUBS organizam suas ferramentas por objetivo. Navegue entre eles para acessar diferentes áreas de desenvolvimento.',
    highlight: { x: 6, y: 12, width: 60, height: 8 },
    dialogPosition: 'bottom',
  },
  {
    id: 3,
    title: 'Perfil e configurações',
    description: 'Personalize sua experiência e acompanhe seu progresso.',
    highlight: { x: 94, y: 1, width: 6, height: 8 },
    dialogPosition: 'bottom',
  },
  {
    id: 4,
    title: 'Central caverna',
    description:
      'A CENTRAL CAVERNA é o coração do sistema. É onde tudo começa e para onde você sempre retorna para evoluir!',
    highlight: { x: 6, y: 12, width: 12, height: 8 },
    dialogPosition: 'right',
  },
  {
    id: 5,
    title: 'Streak',
    description:
      'Seu streak mostra sua consistência! Manter a chama acesa diariamente é o segredo da transformação.',
    highlight: { x: 6, y: 18, width: 30, height: 40 },
    dialogPosition: 'right',
  },
  {
    id: 6,
    title: 'Rituais',
    description:
      'Os rituais são seus hábitos de evolução! Configure sua rotina matinal e noturna para máximo desempenho.',
    highlight: { x: 35, y: 18, width: 30, height: 40 },
    dialogPosition: 'right',
  },
  {
    id: 7,
    title: 'Agenda do dia',
    description:
      'Os rituais são seus hábitos de evolução! Configure sua rotina matinal e noturna para máximo desempenho.',
    highlight: { x: 64, y: 18, width: 30, height: 76 },
    dialogPosition: 'left',
  },
  {
    id: 8,
    title: 'Desafio Caverna',
    description:
      'O Desafio Caverna é sua jornada de 40 dias! Um período intenso de transformação e evolução.',
    highlight: { x: 6, y: 55, width: 30, height: 40 },
    dialogPosition: 'top',
  },
  {
    id: 9,
    title: 'Flow Produtividade',
    description:
      'Entre no estado de FLOW! Sessões de foco máximo com bloqueio de distrações para alta performance.',
    highlight: { x: 35, y: 55, width: 30, height: 40 },
    dialogPosition: 'right',
  },
]

export function DashboardTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const startTutorial = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const closeTutorial = () => {
    setIsActive(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      closeTutorial()
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
    const highlight = currentStepData.highlight
    const dialogPosition = currentStepData.dialogPosition

    switch (dialogPosition) {
      case 'top':
        return {
          top: `${highlight.y - 5}%`,
          left: `${highlight.x + highlight.width / 2}%`,
          transform: 'translate(-50%, -100%)',
        }
      case 'bottom':
        return {
          top: `${highlight.y + highlight.height + 5}%`,
          left: `${highlight.x + highlight.width / 2}%`,
          transform: 'translate(-50%, 0)',
        }
      case 'left':
        return {
          top: `${highlight.y + highlight.height / 2}%`,
          left: `${highlight.x - 5}%`,
          transform: 'translate(-100%, -50%)',
        }
      case 'right':
        return {
          top: `${highlight.y + highlight.height / 2}%`,
          left: `${highlight.x + highlight.width + 5}%`,
          transform: 'translate(0, -50%)',
        }
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  return (
    <>
      {!isActive && (
        <div
          onClick={startTutorial}
          className="hidden lg:flex h-11 items-center group hover:bg-red-500 justify-center bg-card px-5 gap-2 rounded-xl cursor-pointer"
        >
          <HelpCircle
            className="text-red-500 group-hover:text-white"
            size={20}
          />
        </div>
      )}
      {isActive && (
        <div className="absolute inset-0 z-50 max-w-8xl mx-auto">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/60" />
            <div
              className="absolute bg-white/10 border-2 border-primary rounded-lg shadow-2xl"
              style={{
                left: `${currentStepData.highlight.x}%`,
                top: `${currentStepData.highlight.y}%`,
                width: `${currentStepData.highlight.width}%`,
                height: `${currentStepData.highlight.height}%`,
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
                  Passo {currentStep + 1} of {tutorialSteps.length}
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
                          ? 'bg-primary/60'
                          : 'bg-gray-300'
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
      )}
    </>
  )
}
