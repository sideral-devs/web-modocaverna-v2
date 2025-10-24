import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardList, Lightbulb, ArrowRight } from "lucide-react";
import Image from "next/image";

/**
 * JourneyStartWeb – versão refinada
 * Mudanças principais:
 * - Tipografia e espaçamentos reduzidos (melhor densidade para desktop)
 * - Largura máxima controlada (max-w-2xl) e grid simples
 * - CTA "Ativar Modo Caverna" com destaque (borda em gradiente + glow + pulso sutil)
 * - Cards mais compactos; ícones menores
 * - Banner de dica enxuto
 */
export default function JourneyStartWeb({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="relative isolate min-h-screen w-full grid place-items-center md:px-6 -mt-16 overflow-hidden overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#130808,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211010] via-[#140a0a] to-black" />
        <div className="absolute top-[-20%] right-[-15%] h-[50vmax] w-[50vmax] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
        <div className="absolute bottom-[-20%] left-[-20%] h-[45vmax] w-[45vmax] rounded-full opacity-15 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full"
      >
        {/* LOGO */}
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <Image src="/images/logo-icon.svg" alt="Logo" width={48} height={48} />
        </div>

        {/* HEADER */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-[22px] md:text-[28px] font-extrabold tracking-tight leading-tight">
            Sua Jornada no <span className="text-primary">Modo Caverna</span> Começou!
          </h1>
          <p className="mt-2 text-[13px] md:text-sm opacity-80 max-w-xl mx-auto">
            Assuma o controle. Chegou a hora de construir sua nova versão.
          </p>
        </div>

        {/* CONTEÚDO */}
        <div className="mx-auto w-full max-w-2xl space-y-5 md:space-y-6">
          <Card className="relative overflow-hidden rounded-2xl border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <div className="absolute inset-px rounded-[calc(theme(borderRadius.2xl)-1px)] bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
            <div className="p-5 md:p-6">
              <div className="flex justify-center items-center gap-2 text-base md:text-lg font-bold">
                <ClipboardList className="h-4 w-4 text-yellow-300" aria-hidden />
                <span>PRÓXIMOS PASSOS</span>
              </div>
              <p className="mt-1 text-xs md:text-sm opacity-80 text-center">
                O que você precisa fazer agora:
              </p>

              <div className="mt-5 md:mt-6 flex flex-col gap-3.5 md:gap-4">
                <StepItem
                  index={1}
                  title="Assista às aulas do curso"
                  description="Aprenda e aplique a metodologia do Modo Caverna."
                />
                <StepItem
                  index={2}
                  title="Crie seu primeiro Desafio de 40 dias"
                  description="Dê o primeiro passo para despertar sua melhor versão."
                />
              </div>
            </div>
          </Card>

          <TipBanner />

          {/* CTA DESTACADA */}
          <CallToAction onActivate={onActivate} />
        </div>
      </motion.div>
    </div>
  );
}

function StepItem({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-black/30 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-black text-[13px] font-extrabold">
          {index}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[14px] md:text-[15px] leading-tight">{title}</p>
          <p className="mt-1 text-[12px] md:text-[13px] opacity-80 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function TipBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="relative overflow-hidden rounded-xl border border-yellow-500/10"
      role="note"
      aria-label="Lembrete motivacional"
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Lightbulb className="h-4 w-4" aria-hidden />
        <p className="text-[12px] md:text-[13px] font-medium">
          Lembre-se: cada ação que você toma hoje te aproxima do seu objetivo.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.xl)-1px)] bg-gradient-to-b from-white/10 to-transparent" />
    </motion.div>
  );
}

function CallToAction({ onActivate }: { onActivate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex w-full justify-center"
    >
      {/* Wrapper com borda em gradiente e glow */}
      <motion.div
        className="relative rounded-2xl p-[1px] bg-[linear-gradient(180deg,rgba(255,51,51,0.7)_0%,rgba(255,51,51,0.25)_50%,transparent_100%)] shadow-[0_18px_55px_-20px_rgba(255,51,51,0.6)] overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <Button
          onClick={onActivate}
          size="lg"
          className="relative mx-auto w-full md:w-auto px-7 md:px-8 py-7 rounded-2xl uppercase tracking-wide text-[12px] md:text-[13px] font-bold backdrop-blur-md"
        >
          <span className="pr-1">Ativar Modo Caverna</span>
          <ArrowRight />

          {/* Glow animado interno */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 80px 10px rgba(255,51,51,0.35) inset" }}
          />
        </Button>

        {/* Halo externo sutil */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px] opacity-40 blur-xl"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(closest-side, rgba(255,51,51,0.35), transparent)" }}
        />
      </motion.div>
    </motion.div>
  );
}
