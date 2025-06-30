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

export function DownloadAppStep({ onNext }: { onNext: () => void }) {
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

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep((prev) => prev - 1)
  }

  const isLastQuestion = currentStep === questions.length
  const isFirstQuestion = currentStep === 0

  return (
    <div className="flex w-full flex-col flex-1 relative items-center p-4 3xl:pb-16 gap-10">
      <div className="flex w-full max-w-[611px] flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Quiz de Autodescoberta</h1>
        <p className="text-center opacity-80">
          Responda com sinceridade. Essas perguntas vão moldar sua jornada de
          transformação.
        </p>

        <div className="relative w-full h-[400px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {isLastQuestion ? (
              <motion.div
                key="result"
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full"
              >
                <Card className="flex flex-col items-center gap-6 relative w-full rounded-xl px-6 py-16 text-center">
                  <p className="text-4xl">{result.title}</p>
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
                <Card className="flex flex-col items-center gap-6 relative w-full rounded-xl px-6 py-16">
                  <p className="text-yellow-400 text-lg">
                    {currentQuestion.text}
                  </p>
                  <div className="w-full grid grid-cols-2 gap-2">
                    {currentQuestion.options.map((option) => (
                      <AnswerButton
                        key={option}
                        option={option}
                        isSelected={answers[currentQuestion.id] === option}
                        onClick={() => handleSelect(option)}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="lg"
            variant="outline"
            disabled={isFirstQuestion}
            onClick={handleBack}
          >
            Voltar
          </Button>

          <Button size="lg" onClick={onNext} disabled={!isLastQuestion}>
            Continuar Jornada
          </Button>
        </div>
      </div>
    </div>
  )
}

function AnswerButton({
  option,
  isSelected,
  onClick,
}: {
  option: string
  isSelected: boolean
  onClick: () => void
}) {
  const [emoji, ...titleParts] = option.split(' ')
  const title = titleParts.join(' ')
  return (
    <div
      className={`flex flex-col items-center px-4 py-6 gap-1 rounded-xl border cursor-pointer 
      ${isSelected ? 'border-primary bg-zinc-900' : 'bg-zinc-950 hover:border-primary'}`}
      onClick={onClick}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-center opacity-80">{title}</span>
    </div>
  )
}
