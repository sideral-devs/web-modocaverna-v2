// 'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const questions = [
  {
    id: 'rotina',
    text: 'Como está sua rotina hoje?',
    options: [
      '🏆 Organizada e produtiva',
      '🤷‍♂️ Meio bagunçada',
      '⏰ Sempre correndo',
      '🔋 Sem energia',
    ],
  },
  {
    id: 'inimigo',
    text: 'Seu maior inimigo diário?',
    options: [
      '📱 Celular',
      '😵‍💫 Procrastinação',
      '📅 Falta de planejamento',
      '🙁 Desânimo',
    ],
  },
  {
    id: 'vencer',
    text: 'Onde quer vencer primeiro?',
    options: ['💼 Carreira', '🏠 Casa', '💪 Saúde', '❤️ Relacionamentos'],
  },
  {
    id: 'prioridade',
    text: 'Sua prioridade urgente?',
    options: [
      '🧠 Clareza mental',
      '⏳ Gerenciar tempo',
      '🚀 Tirar um projeto do papel',
      '🛌 Dormir melhor',
    ],
  },
  {
    id: 'motivacao',
    text: 'O que mais te motiva?',
    options: [
      '🏖️ Liberdade',
      '🎯 Resultados',
      '🎨 Criar algo novo',
      '💞 Impactar pessoas',
    ],
  },
]

const result = {
  title: '🌟\nO VISIONÁRIO',
  description:
    'Você é criativo, inspirador e inovador. Sua força está na capacidade de imaginar possibilidades e inspirar mudanças. No Modo Caverna, você será o criador do seu futuro ideal.',
}

export function QuizStep({ onNext }: { onNext: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [direction, setDirection] = useState(1)

  const currentQuestion = questions[currentStep]

  const handleSelect = (option: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option }
    setAnswers(updatedAnswers)
    if (currentStep < questions.length) {
      setDirection(1)
      setTimeout(() => setCurrentStep((prev) => prev + 1), 100)
    }
  }

  const isLastQuestion = currentStep === questions.length

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto items-center gap-12">
      <div className="relative w-full h-[480px]">
        <AnimatePresence mode="wait" initial={false}>
          {isLastQuestion ? (
            <motion.div
              key="result"
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col absolute w-full h-[480px] gap-12"
            >
              <h1 className="font-bold text-center text-2xl lg:text-3xl">
                Seu perfil no <span className="text-primary">Modo Caverna</span>
              </h1>
              <Card className="flex flex-col h-full items-center justify-center gap-6 relative w-full rounded-xl px-6 py-16 text-center bg-white/5 shadow-sm shadow-red-900">
                <p className="text-4xl">{result.title}</p>
                <p></p>
                <p className="opacity-80">{result.description}</p>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion.id}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <div className="flex flex-col items-center p-4 gap-6 relative w-full">
                <div className="w-full flex flex-col items-center p-6 gap-2 bg-red-700/10 rounded-lg border border-red-950">
                  <p className="opacity-80">
                    Pergunta {currentStep + 1} de {questions.length}
                  </p>
                  <p className="text-xl font-semibold">
                    {currentQuestion.text}
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => (
                    <AnswerButton
                      key={option}
                      option={option}
                      onClick={() => handleSelect(option)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLastQuestion && (
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            onClick={onNext}
            disabled={!isLastQuestion}
            className="uppercase"
          >
            Avançar
          </Button>
        </div>
      )}
    </div>
  )
}

function AnswerButton({
  option,
  onClick,
}: {
  option: string
  onClick: () => void
}) {
  const [emoji, ...titleParts] = option.split(' ')
  const title = titleParts.join(' ')
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center px-6 py-6 gap-4 text-sm bg-white/5 border rounded-lg cursor-pointer transition-all duration-500 hover:border-primary hover:scale-105 hover:bg-red-700/20 group hover:card-shadow-sm"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine pointer-events-none " />
      <span className="text-2xl">{emoji}</span>
      <span className="text-center text-lg">{title}</span>
    </div>
  )
}
