'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addDays, addHours, differenceInMinutes, format, parse } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  AlertOctagonIcon,
  Bed,
  BriefcaseBusiness,
  CloudSun,
  Loader2,
  MoonIcon,
  Sunrise,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ritualFormSchema = z.object({
  workTime: z.string().min(4, 'Informe um horário válido'),
  sleepTime: z.string().min(4, 'Informe um horário válido'),
  morningRoutine: z
    .string()
    .refine((val) => Number(val) > 0, { message: 'O menor valor é 1' }),
})

type RitualFormValues = z.infer<typeof ritualFormSchema>

interface RitualResponseDTO {
  rituais_calculadora_id: number
  duracao_ritual_matinal: number
  horario_trabalho_estudo: string
  inicio_dormir: string
}

function sumHours(hour: string, hours: number) {
  const date = parse(hour, 'HH:mm', new Date())

  const novaData = addHours(date, hours)

  return format(novaData, 'HH:mm')
}

export function RecalculateRitualDialog({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)

  const allSteps = 2

  const stepOneForm = useForm<RitualFormValues>({
    resolver: zodResolver(ritualFormSchema),
    defaultValues: {
      workTime: '',
      sleepTime: '',
      morningRoutine: '',
    },
  })

  const { data, isFetched } = useQuery({
    queryKey: ['show-ritual-calculadora'],
    queryFn: async () => {
      const res = await api.get('/rituais-calculadoras/show')
      return res.data as RitualResponseDTO
    },
  })

  const { mutateAsync, data: insertedRitual } = useMutation({
    mutationFn: async (data: RitualFormValues) => {
      const res = await api.post('/rituais-calculadoras/upsert', {
        inicio_dormir: data.sleepTime,
        horario_trabalho_estudo: data.workTime,
        duracao_ritual_matinal: data.morningRoutine,
      })
      return res.data as RitualResponseDTO
    },
  })

  function nextStep() {
    if (currentStep >= allSteps) {
      // Nada
    } else {
      setCurrentStep((prev) => (prev += 1))
    }
  }

  async function stepOneSubmit(data: RitualFormValues) {
    try {
      await mutateAsync(data)
      nextStep()
    } catch {
      toast.error('Não foi possível fazer isso agora!')
    }
  }

  useEffect(() => {
    if (data) {
      stepOneForm.reset({
        morningRoutine: String(data.duracao_ritual_matinal),
        sleepTime: data.inicio_dormir,
        workTime: data.horario_trabalho_estudo,
      })
    }
  }, [isFetched, data])

  return (
    <DialogContent
      className={cn(
        'flex flex-col p-0 bg-zinc-900 transition-all duration-200 overflow-hidden',
        currentStep > 2 ? 'h-[900px] max-h-[95%]' : 'h-[780px] max-h-[85%]',
      )}
    >
      <DialogHeader className="p-0 pt-4 gap-4">
        <DialogTitle>Calculadora de Rituais</DialogTitle>
        <StepCounter current={currentStep} total={allSteps} />
      </DialogHeader>

      <div className="flex-1 overflow-y-auto scrollbar-minimal">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && <CalculateHabitStep form={stepOneForm} />}
            {currentStep === 2 && <ResultStep data={insertedRitual} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <DialogFooter className="flex !flex-row w-full items-center !justify-between py-2 pr-1 pl-5 bg-zinc-800">
        <span>
          {currentStep} de {allSteps}
        </span>
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Voltar
            </Button>
          )}
          <Button
            loading={stepOneForm.formState.isSubmitting}
            className="h-10"
            onClick={async () => {
              switch (currentStep) {
                case 1:
                  stepOneForm.handleSubmit(stepOneSubmit)()
                  break
                case 2:
                  setCurrentStep(1)
                  onClose()
                  break
              }
            }}
          >
            Continuar
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

function CalculateHabitStep({
  form,
}: {
  form: UseFormReturn<RitualFormValues>
}) {
  const { register } = form

  return (
    <div className="flex flex-col flex-1">
      <div className="divide-y">
        <div className="flex items-center p-6 gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/images/lobo-face.svg" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <p className="font-normal text-sm">
            O sistema te ajudará a determinar os horários dos seus rituais de
            acordo com as suas necessidades. Para isso,{' '}
            <strong>preencha os campos abaixo:</strong>
          </p>
        </div>
        <div className="flex items-center justify-between p-5">
          <span className="flex items-center gap-2 text-sm">
            <BriefcaseBusiness size={16} />
            Horário de início de trabalho/estudo
          </span>
          <Input
            type="time"
            {...register('workTime')}
            className="items-center text-center w-24 bg-zinc-700 border-0"
          />
        </div>
        <div className="flex items-center justify-between p-5">
          <span className="flex items-center gap-2 text-sm">
            <Bed size={16} />
            Horário de dormir
          </span>
          <Input
            type="time"
            className="w-24 bg-zinc-700 border-0"
            {...register('sleepTime')}
          />
        </div>
        <div className="flex items-center justify-between p-5">
          <span className="flex items-center gap-2 text-sm">
            <Sunrise size={16} />
            Duração do Ritual Matinal em minutos
          </span>
          <div className="flex flex-col gap-1">
            <Input
              className="w-24 bg-zinc-700 border-0"
              {...register('morningRoutine')}
            />
            <span className="text-[10px] text-zinc-400 text-right">
              Sugerido: 90 min
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between p-6 py-2">
        <p className="text-sm text-zinc-200 font-normal">
          <strong className="text-white">Recomendação: </strong> Assista ao
          curso do Modo Caverna para aproveitar ao máximo essa ferramenta
        </p>
      </div>
    </div>
  )
}

function ResultStep({ data }: { data?: RitualResponseDTO }) {
  function getWakeUpTime(data: RitualResponseDTO) {
    return sumHours(
      data.horario_trabalho_estudo,
      (data.duracao_ritual_matinal / 60) * -1,
    )
  }

  function getSleepTime(data: RitualResponseDTO) {
    const wakeUpTime = getWakeUpTime(data)

    const now = new Date()
    const sleep = parse(data.inicio_dormir, 'HH:mm', now)
    let wake = parse(wakeUpTime, 'HH:mm', now)

    if (wake <= sleep) {
      wake = addDays(wake, 1)
    }

    const minutesSlept = differenceInMinutes(wake, sleep)
    const hours = Math.floor(minutesSlept / 60)
    const minutes = minutesSlept % 60

    const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    return formatted
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin duration-150" />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-minimal">
      <div className="flex-1 divide-y">
        <div className="flex items-center p-5 gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/images/lobo-face.svg" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm">Horários definidos</h3>
            <p className="font-normal text-sm">
              De acordo com as suas respostas, aqui estão algumas informações
              que determinam os seus rituais.
            </p>
            <span className="text-zinc-400 text-xs">
              Altere sempre que desejar ou for necessário.
            </span>
          </div>
        </div>
        <div className="flex flex-col px-4 py-5 gap-5">
          <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
            <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-red-900/30">
              <Bed className="text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs leading-none">
                {getSleepTime(data)} horas de sono
              </span>
            </div>
          </div>
          <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
            <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-red-900/30">
              <AlarmClock className="text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs leading-none">
                Acorde às <strong>{getWakeUpTime(data)}</strong>
              </span>
            </div>
          </div>
          <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
            <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-red-900/30">
              <CloudSun className="text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs leading-none">
                Dedique {data.duracao_ritual_matinal} minutos ao{' '}
                <strong>Ritual Matinal</strong>
              </span>
            </div>
          </div>
          <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
            <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-red-900/30">
              <MoonIcon className="text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs leading-none">
                Dedique 30 minutos ao <strong>Ritual Noturno</strong>. Inicie às{' '}
                {sumHours(data.inicio_dormir, 0.5 * -1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between p-6 py-2">
        <div className="w-full flex items-center 3xl:px-5 3xl:py-6  p-4 gap-6 bg-[#44430D80]/50 rounded-lg">
          <AlertOctagonIcon className="text-yellow-400 min-w-4 xl:min-w-6" />
          <p className="text-yellow-400 3xl:text-base text-[0.85rem]">
            <strong>Deseja alterar os horários? </strong> Clique em
            &quot;Voltar&quot; e reajuste até que fique adequado à sua
            necessidade e realidade.
          </p>
        </div>
      </div>
    </div>
  )
}

function StepCounter({
  total,
  current,
  className,
}: {
  total: number
  current: number
  className?: string
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex w-full h-[1px] bg-zinc-700">
        <motion.div
          className={cn('flex h-1 bg-primary', className)}
          animate={{
            width: (Math.min(current, total) / total) * 100 + '%',
            transition: {
              duration: 0.5,
            },
            backgroundColor: '#EE4444',
          }}
        ></motion.div>
      </div>
    </div>
  )
}
