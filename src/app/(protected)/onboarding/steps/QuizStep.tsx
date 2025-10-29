import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import {
  ListChecks,
  AlarmClockOff,
  Trophy,
  Flame,
  Focus,
  Scale,
  BriefcaseBusiness,
  Brain,
  Activity,
  Hourglass,
  ArrowRight,
} from "lucide-react";

const questions = [
  {
    id: "rotina",
    text: "Como está sua rotina hoje?",
    options: [
      { label: "Organizada e produtiva", profile: "estrategista", Icon: ListChecks },
      { label: "Caos Total", profile: "executor", Icon: AlarmClockOff },
    ],
  },
  {
    id: "motivacao",
    text: "O que mais te motiva a mudar?",
    options: [
      { label: "Conquistas pessoais", profile: "executor", Icon: Trophy },
      { label: "Superação", profile: "guerreiro", Icon: Flame },
    ],
  },
  {
    id: "prioridade",
    text: "Qual sua maior urgência agora?",
    options: [
      { label: "Foco", profile: "estrategista", Icon: Focus },
      { label: "Equilíbrio", profile: "desperto", Icon: Scale },
    ],
  },
  {
    id: "foco",
    text: "Onde você quer vencer primeiro?",
    options: [
      { label: "Carreira", profile: "executor", Icon: BriefcaseBusiness },
      { label: "Mindset", profile: "desperto", Icon: Brain },
    ],
  },
  {
    id: "obstaculo",
    text: "Qual é seu pior inimigo diário?",
    options: [
      { label: "Ansiedade", profile: "desperto", Icon: Activity },
      { label: "Falta de tempo", profile: "guerreiro", Icon: Hourglass },
    ],
  },
] as const;

type Option = (typeof questions)[number]["options"][number];
export type QuizStepProps = { onNext: () => void };

function ResultAura() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute left-[-20%] top-[-10%] h-72 w-72 rounded-full blur-3xl opacity-25 bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]"
        animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-18%] bottom-[-12%] h-80 w-80 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]"
        animate={{ x: [0, -8, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
    </div>
  );
}

export default function QuizStep({ onNext }: QuizStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length;

  const topProfile = useMemo(() => {
    const entry = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
    return entry?.[0];
  }, [score]);

  const resultMap: Record<string, { title: string; subtitle: string; description: string }> = {
    estrategista: {
      title: "O ESTRATEGISTA",
      subtitle: "Você não é de agir no impulso.",
      description:
        "Quer entender o jogo, dominar o terreno, e só depois acelerar. O problema é que o caos do dia a dia tira sua visão — e você sabe disso. Chegou a hora de assumir o controle e planejar como um verdadeiro mestre de guerra.",
    },
    desperto: {
      title: "O DESPERTO",
      subtitle: "Você não tá mais no modo automático.",
      description:
        "Sabe que precisa mudar — mas precisa fazer do seu jeito, com profundidade. Antes de acelerar, você precisa entender o que importa de verdade. E aqui dentro, você vai encontrar esse caminho com silêncio, estrutura e intenção.",
    },
    executor: {
      title: "O EXECUTOR",
      subtitle: "Você é daqueles que quer vencer, crescer, conquistar — e tem pressa.",
      description:
        "Mas não adianta correr sem direção. Aqui dentro, você vai aprender a transformar ambição em ação concreta. Nada de metas soltas ou produtividade vazia. Chegou a hora de usar o sistema como uma máquina de execução.",
    },
    guerreiro: {
      title: "O GUERREIRO",
      subtitle: "Você já sentiu o gosto da queda.",
      description:
        "Já andou sem energia, sem rumo… mas algo em você se recusa a desistir. Você é feito de garra. O que te falta não é força — é um ambiente certo para renascer. E aqui dentro, a sua reconstrução começa agora.",
    },
  };

  const result = resultMap[topProfile || ""];

  function handleSelect(option: Option) {
    const updatedAnswers = { ...answers, [currentQuestion.id]: option.label };
    setAnswers(updatedAnswers);
    setScore((prev) => ({ ...prev, [option.profile]: (prev[option.profile] || 0) + 1 }));
    if (currentStep < questions.length) {
      setDirection(1);
      setTimeout(() => setCurrentStep((prev) => prev + 1), 120);
    }
  }

  useEffect(() => {
    if (isLastQuestion && result) localStorage.setItem("cave_profile", JSON.stringify(result));
  }, [isLastQuestion, result]);

  return (
    <div className="relative flex flex-col w-full">
      <SoftGlowBackground />

      <div className="flex justify-center items-center h-full -mt-16 relative w-full">
        <AnimatePresence mode="wait" initial={false}>
          {isLastQuestion ? (
            <motion.div
              key="result"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.6 }}
              className="absolute w-full px-4"
            >
              <div className="mx-auto w-full max-w-3xl space-y-8">
                <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Seu perfil no <span className="text-primary opacity-90">Modo Caverna</span>
                </h1>

                <div className="relative rounded-3xl p-[1px] bg-[linear-gradient(180deg,rgba(255,51,51,0.55)_0%,rgba(255,51,51,0.15)_50%,transparent_100%)] shadow-[0_20px_60px_-20px_rgba(255,51,51,0.35)]">
                  <Card className="relative overflow-hidden rounded-[calc(theme(borderRadius.3xl))] bg-white/5 backdrop-blur-md border-white/10">
                    <ResultAura />

                    <div className="flex flex-col items-center gap-6 px-8 py-12 md:py-14 text-center">
                      <div className="relative">
                        <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl ring-1 ring-white/15 bg-black/30">
                          <span aria-hidden className="text-2xl">🐺</span>
                        </div>
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
                          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          style={{ boxShadow: "0 0 80px 20px rgba(255,51,51,0.25)" }}
                        />
                      </div>

                      <div className="space-y-3">
                        <p className="text-2xl md:text-3xl font-black tracking-tight">{result?.title}</p>
                        <p className="text-sm md:text-base text-white/85">{result?.subtitle}</p>
                        <p className="mx-auto max-w-2xl text-sm md:text-base leading-relaxed text-white/75">{result?.description}</p>
                      </div>

                      <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                      <div className="flex w-full justify-center">
                        <Button
                          size="lg"
                          onClick={onNext}
                          className="uppercase tracking-wide px-7 md:px-8 shadow-[0_14px_40px_-18px_rgba(255,51,51,0.55)]"
                        >
                          Avançar <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-[100%] opacity-30 blur-3xl bg-[radial-gradient(closest-side,rgba(255,51,51,0.35),transparent)]"
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.3xl)-1px)] bg-gradient-to-b from-white/6 to-transparent" />
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion.id}
              initial={{ x: direction > 0 ? 320 : -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? 320 : -320, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute w-full px-4"
            >
              <div className="mx-auto w-full max-w-3xl">

                <div className="w-full text-center mb-6 select-none">
                  <span className="inline-flex items-center gap-2 mb-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] md:text-[11px] font-semibold tracking-wide text-primary">
                    Pergunta {currentStep + 1} de {questions.length}
                  </span>
                  <p className="text-xl md:text-2xl font-semibold leading-snug mt-1">
                    {currentQuestion.text}
                  </p>
                  <p className="text-xs md:text-sm text-white/60">Selecione uma das opções abaixo</p>
                </div>

                <motion.div
                  className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }}
                >
                  {currentQuestion.options.map((option) => (
                    <AnswerButton key={option.label} option={option} onClick={() => handleSelect(option)} />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnswerButton({ option, onClick }: { option: Option; onClick: () => void }) {
  const { Icon, label } = option;
  return (
    <motion.button
      type="button"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className="group relative w-full rounded-2xl isolate"
    >
      <div className="relative rounded-2xl p-[1px] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.12)_100%)]">
        <div className="relative flex items-center gap-4 h-[96px] rounded-[calc(theme(borderRadius.2xl)-1px)] border border-white/10 bg-black/50 px-5 md:px-6 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-colors duration-200 group-hover:border-primary/40 group-focus-within:border-primary/60">
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/15 bg-black/30">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <span className="text-[15px] md:text-[16px] font-semibold leading-snug">
              {label}
            </span>
          </div>

          <motion.span
            aria-hidden
            className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-white/5"
            initial={{ x: 0, opacity: 0.8 }}
            whileHover={{ x: 2, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.span>

          <span className="pointer-events-none absolute inset-0">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]" />
          </span>
        </div>
      </div>

      <span className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-focus-visible:ring-primary/60 transition" />
    </motion.button>
  );
}


function SoftGlowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-[35%] top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]"
        animate={{ x: [0, 12, 0, -8, 0], y: [0, -10, 0, 8, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[35%] bottom-[5%] h-[60vmax] w-[60vmax] rounded-full opacity-15 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]"
        animate={{ x: [0, -10, 0, 6, 0], y: [0, 8, 0, -10, 0], scale: [1.02, 1, 1.02] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
