import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const questions = [
  {
    id: 'rotina',
    text: 'Como está sua rotina hoje?',
    options: [
      { label: '🏆 Organizada e produtiva', profile: 'estrategista' },
      { label: '🙃 Meio bagunçada', profile: 'desperto' },
      { label: '⏰ Sempre correndo', profile: 'executor' },
      { label: '🪫 Sem energia', profile: 'guerreiro' },
    ],
  },
  {
    id: 'motivacao',
    text: 'O que mais te motiva a mudar?',
    options: [
      { label: '🏁 Conquistas pessoais', profile: 'executor' },
      { label: '🌟 Reconhecimento', profile: 'estrategista' },
      { label: '💰 Prosperidade', profile: 'executor' },
      { label: '🔥 Superação', profile: 'guerreiro' },
    ],
  },
  {
    id: 'prioridade',
    text: 'Qual sua maior urgência agora?',
    options: [
      { label: '🎯 Foco', profile: 'estrategista' },
      { label: '⚡ Energia', profile: 'guerreiro' },
      { label: '📈 Resultados', profile: 'executor' },
      { label: '🧘 Equilíbrio', profile: 'desperto' },
    ],
  },
  {
    id: 'foco',
    text: 'Onde você quer vencer primeiro?',
    options: [
      { label: '💼 Carreira', profile: 'executor' },
      { label: '💪 Saúde', profile: 'guerreiro' },
      { label: '🧠 Mindset', profile: 'desperto' },
      { label: '❤️ Relacionamentos', profile: 'estrategista' },
    ],
  },
  {
    id: 'obstaculo',
    text: 'Qual é seu pior inimigo diário?',
    options: [
      { label: '📱 Distrações digitais', profile: 'estrategista' },
      { label: '😴 Procrastinação', profile: 'executor' },
      { label: '😰 Ansiedade', profile: 'desperto' },
      { label: '⏳ Falta de tempo', profile: 'guerreiro' },
    ],
  },
]

export function QuizStep({ onNext }: { onNext: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [score, setScore] = useState<{ [profile: string]: number }>({})
  const [direction, setDirection] = useState(1)

  const currentQuestion = questions[currentStep]

  const handleSelect = (option: { label: string; profile: string }) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option.label }
    setAnswers(updatedAnswers)
    setScore((prev) => ({
      ...prev,
      [option.profile]: (prev[option.profile] || 0) + 1,
    }))
    if (currentStep < questions.length) {
      setDirection(1)
      setTimeout(() => setCurrentStep((prev) => prev + 1), 100)
    }
  }

  const isLastQuestion = currentStep === questions.length

  const topProfile = Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0]
  const resultMap: Record<
    string,
    { title: string; subtitle: string; description: string }
  > = {
    estrategista: {
      title: '🎯 O ESTRATEGISTA',
      subtitle: 'Você não é de agir no impulso.',
      description:
        'Quer entender o jogo, dominar o terreno, e só depois acelerar. O problema é que o caos do dia a dia tira sua visão — e você sabe disso. Chegou a hora de assumir o controle e planejar como um verdadeiro mestre de guerra.',
    },
    desperto: {
      title: '🧘 O DESPERTO',
      subtitle: 'Você não tá mais no modo automático.',
      description:
        'Sabe que precisa mudar — mas precisa fazer do seu jeito, com profundidade. Antes de acelerar, você precisa entender o que importa de verdade. E aqui dentro, você vai encontrar esse caminho com silêncio, estrutura e intenção.',
    },
    executor: {
      title: '⚙️ O EXECUTOR',
      subtitle:
        'Você é daqueles que quer vencer, crescer, conquistar — e tem pressa.',
      description:
        'Mas não adianta correr sem direção. Aqui dentro, você vai aprender a transformar ambição em ação concreta. Nada de metas soltas ou produtividade vazia. Chegou a hora de usar o sistema como uma máquina de execução.',
    },
    guerreiro: {
      title: '🛡️ O GUERREIRO',
      subtitle: 'Você já sentiu o gosto da queda.',
      description:
        'Já andou sem energia, sem rumo… mas algo em você se recusa a desistir. Você é feito de garra. O que te falta não é força — é um ambiente certo para renascer. E aqui dentro, a sua reconstrução começa agora.',
    },
  }
  const result = resultMap[topProfile || '']

  useEffect(() => {
    if (isLastQuestion && result) {
      localStorage.setItem('cave_profile', JSON.stringify(result))
    }
  }, [isLastQuestion, result])

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto items-center gap-4">
      <div className="relative w-full h-[450px]">
        <AnimatePresence mode="wait" initial={false}>
          {isLastQuestion ? (
            <motion.div
              key="result"
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col absolute w-full gap-12"
            >
              <h1 className="font-bold text-center text-2xl lg:text-3xl">
                Seu perfil no <span className="text-primary">Modo Caverna</span>
              </h1>
              <Card className="flex flex-col h-full items-center justify-center gap-6 relative w-full rounded-xl px-6 py-16 text-center bg-white/5 shadow-sm shadow-red-900">
                <p className="text-4xl">{result?.title}</p>
                <p>{result?.subtitle}</p>
                <p className="opacity-80">{result?.description}</p>
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
                  <p className="opacity-80 text-primary">
                    Pergunta {currentStep + 1} de {questions.length}
                  </p>
                  <p className="text-xl font-semibold">
                    {currentQuestion.text}
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => (
                    <AnswerButton
                      key={option.label}
                      option={option.label}
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
