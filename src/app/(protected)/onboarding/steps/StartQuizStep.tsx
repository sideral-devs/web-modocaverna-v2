import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, Target, Hourglass, Fingerprint } from "lucide-react";
import React from "react";

type Props = { onNext: () => void };

const features = [
  {
    title: "5 perguntas diretas",
    Icon: Target,
  },
  {
    title: "Leva menos de 1 minuto",
    Icon: Hourglass,
  },
  {
    title: "Descubra seu Perfil Caverna",
    Icon: Fingerprint,
  },
];

export default function StartQuizStep({ onNext }: Props) {
  return (
    <div className="relative isolate w-full flex flex-col items-center justify-center px-4 lg:px-16 py-10 gap-8">
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute bottom-[20%] -left-[30%] h-[75vmax] w-[75vmax] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]"
          animate={{
            x: [0, 12, 0, -8, 0],
            y: [0, -10, 0, 8, 0],
            scale: [1, 1.06, 1],
            rotate: [0, 1.6, 0, -1, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -top-[25%] -right-[30%] h-[75vmax] w-[75vmax] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]"
          animate={{
            x: [0, -10, 0, 6, 0],
            y: [0, 8, 0, -10, 0],
            scale: [1.02, 1, 1.02],
            rotate: [0, -1.2, 0, 1, 0],
            opacity: [0.16, 0.22, 0.16],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />

        <motion.div
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.05),transparent)]"
          animate={{ opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <h1 className="font-bold text-3xl lg:text-5xl tracking-tight">
          Momento da <span className="text-primary">Verdade</span>
        </h1>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="w-full"
      >
        <div className="group relative flex items-center gap-4 p-4 md:p-5 rounded-2xl border bg-white/5 border-white/10 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/30">
            <AlertTriangle className="size-5 text-red-400" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-red-400/90 uppercase text-[11px] tracking-[0.14em] font-semibold">
              Seja brutalmente honesto
            </span>
            <p className="text-sm opacity-90">
              A verdade que você evitar aqui… vai te cobrar lá na frente.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
      >
        {features.map(({ title, Icon }, idx) => (
          <motion.div
            key={idx}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-4 md:p-6 text-center shadow-lg"
          >
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl ring-1 ring-white/15">
              <Icon className="size-6 text-muted-foreground" aria-hidden />
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-tight">
              {title}
            </p>
            <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.2xl)-1px)] bg-gradient-to-b from-white/5 to-transparent" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center gap-3"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="uppercase px-8 py-6 text-sm tracking-wide rounded-2xl shadow-[0_12px_30px_-10px_rgba(255,51,51,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
          aria-label="Começar o questionário"
        >
          COMEÇAR
        </Button>
      </motion.div>


    </div>
  );
}
