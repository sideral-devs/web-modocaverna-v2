'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function CaptainCaveWelcome({ onNext }: { onNext: () => void }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative isolate min-h-[86vh] w-full overflow-hidden flex items-center justify-center px-4 lg:px-10"
    >
      {/* Background */}
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
      >
        <div className="absolute inset-0 bg-[#16090a]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)] opacity-30" />
      </motion.div>

      {/* Layout: Mascote | Conteúdo */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-5 md:gap-10 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Mascote (menor) */}
        <motion.div variants={item} className="flex justify-center md:justify-start">
          {/* wrapper com aspect ratio para evitar layout shift no mobile */}
          <div className="relative aspect-[3/4] w-[44vw] max-w-[220px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[280px] select-none pointer-events-none">
            <Image
              src="/images/lobo/apresentando.png"
              alt="Capitão Caverna"
              fill
              sizes="(max-width: 768px) 44vw, (max-width: 1024px) 260px, 280px"
              className="object-contain drop-shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
              priority
            />
          </div>
        </motion.div>


        {/* Texto + Card */}
        <motion.div variants={item} className="flex flex-col items-center md:items-start gap-6">
          <motion.h1
            variants={item}
            className="text-center md:text-left font-extrabold leading-tight text-3xl md:text-5xl"
          >
            Sou o <span className="text-primary">Capitão Caverna.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-center md:text-left text-white/85 text-base md:text-lg max-w-xl"
          >
            Serei o seu guia e assistente virtual. Vamos começar a sua jornada agora.
          </motion.p>

          {/* Card com apenas o CTA */}
          <motion.div
            variants={item}
            className="relative w-full max-w-xl rounded-3xl p-[1px] bg-[linear-gradient(180deg,rgba(255,51,51,0.45)_0%,rgba(255,51,51,0.15)_55%,transparent_100%)] shadow-[0_25px_80px_-30px_rgba(255,51,51,0.45)]"
          >
            <div className="rounded-[calc(theme(borderRadius.3xl))] bg-black/60 backdrop-blur-md border border-white/10 p-5 md:p-6">
              <Button
                onClick={onNext}
                size="lg"
                className="w-full h-12 rounded-xl uppercase tracking-wide shadow-[0_14px_40px_-18px_rgba(255,51,51,0.55)]"
                aria-label="Começar jornada"
              >
                Começar Jornada
              </Button>
            </div>

            {/* brilho interno */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[calc(theme(borderRadius.3xl))]"
              animate={{ opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ boxShadow: '0 0 90px 18px rgba(255,51,51,0.35) inset' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
