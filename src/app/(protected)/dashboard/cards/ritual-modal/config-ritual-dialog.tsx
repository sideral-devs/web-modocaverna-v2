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
import { cn } from '@/lib/utils'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  Bed,
  BriefcaseBusiness,
  CloudSun,
  Loader2,
  MoonIcon,
  PlusIcon,
  Sunrise,
} from 'lucide-react'

import { api } from '@/lib/api'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addHours, format, parse } from 'date-fns'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SortableItem } from './sortable-item'

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

type ListItem = {
  id: string
  text: string
}

type SetListItem = Dispatch<SetStateAction<ListItem[]>>

function sumHours(hour: string, hours: number) {
  const date = parse(hour, 'HH:mm', new Date())

  const novaData = addHours(date, hours)

  return format(novaData, 'HH:mm')
}

export function ConfigRitualDialog({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [morningItems, setMorningItems] = useState<ListItem[]>([])
  const [nightItems, setNightItems] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  const allSteps = 4

  const stepOneForm = useForm<RitualFormValues>({
    resolver: zodResolver(ritualFormSchema),
    defaultValues: {
      workTime: '',
      sleepTime: '',
      morningRoutine: '',
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
      // handleFinish()
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

  async function stepThreeSubmit(ritualForm: RitualFormValues) {
    setLoading(true)
    try {
      await api.post('/blocos/store', {
        horario_inicial: calcularHorarioFinal(
          ritualForm.workTime,
          `-${ritualForm.morningRoutine}`,
        ),
        horario_final: ritualForm.workTime,
        itens: morningItems.map((i) => i.text),
        tipo_ritual: 1,
      })
    } catch {
      toast.error('Não foi possível fazer isso agora!')
    } finally {
      setLoading(false)
    }
  }

  async function stepFourSubmit(ritualForm: RitualFormValues) {
    setLoading(true)
    try {
      await api.post('/blocos/store', {
        horario_inicial: ritualForm.sleepTime,
        horario_final: calcularHorarioFinal(ritualForm.sleepTime, '30'), // exemplo: duração do ritual noturno
        itens: nightItems.map((i) => i.text),
        tipo_ritual: 2,
      })
    } catch {
      toast.error('Não foi possível fazer isso agora!')
    } finally {
      setLoading(false)
    }
  }

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
            {currentStep === 3 && (
              <AddMorningRitual
                data={insertedRitual}
                items={morningItems}
                setItems={setMorningItems}
              />
            )}
            {currentStep === 4 && (
              <AddNightRitual
                data={insertedRitual}
                items={nightItems}
                setItems={setNightItems}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DialogFooter className="flex !flex-row w-full items-center !justify-between py-2 pr-2 pl-5 bg-zinc-800">
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
            loading={stepOneForm.formState.isLoading || loading}
            className="h-10"
            onClick={async () => {
              switch (currentStep) {
                case 1:
                  stepOneForm.handleSubmit(stepOneSubmit)()
                  break
                case 2:
                  nextStep()
                  break
                case 3:
                  await stepThreeSubmit(stepOneForm.getValues())
                  nextStep()
                  break
                case 4:
                  await stepFourSubmit(stepOneForm.getValues())
                  setCurrentStep(1)
                  setMorningItems([])
                  setNightItems([])
                  onClose()
                  queryClient.invalidateQueries({
                    queryKey: ['rituais-blocos-matinais'],
                  })
                  queryClient.invalidateQueries({
                    queryKey: ['rituais-blocos-noturnos'],
                  })
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
  function sleepTime() {
    let horasSomadas: string = ''
    if (data) {
      horasSomadas = sumHours(
        data.horario_trabalho_estudo,
        (data.duracao_ritual_matinal / 60) * -1,
      )
    }
    const horasSemZero = parseInt(horasSomadas.split(':')[0], 10)

    return horasSemZero
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
                {sleepTime()} horas de sono
              </span>
            </div>
          </div>
          <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
            <div className="flex w-10 h-10 items-center justify-center rounded-xl bg-red-900/30">
              <AlarmClock className="text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs leading-none">
                Acorde às{' '}
                <strong>
                  {sumHours(
                    data.horario_trabalho_estudo,
                    (data.duracao_ritual_matinal / 60) * -1,
                  )}
                </strong>
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
        <p className="text-sm text-zinc-200 font-normal">
          <strong className="text-white">Deseja alterar os horários? </strong>{' '}
          Clique em &quot;Voltar&quot; e reajuste até que fique adequado à sua
          necessidade e realidade.
        </p>
      </div>
    </div>
  )
}

function AddMorningRitual({
  data,
  items,
  setItems,
}: {
  data?: RitualResponseDTO
  items: ListItem[]
  setItems: SetListItem
}) {
  const [newItem, setNewItem] = useState('')

  const recommended = [
    {
      id: '1',
      text: 'Escovar os dentes',
    },
    {
      id: '2',
      text: 'Shot matinal',
    },
  ]

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      setItems([...items, { id: `item-${Date.now()}`, text: newItem.trim() }])
      setNewItem('')
    }
  }

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin duration-150" />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 divide-y overflow-y-auto scrollbar-minimal">
      <div className="flex items-center p-6 gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/lobo-face.svg" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-3">
          <span className="font-normal text-sm">
            Seu Ritual Matinal começa às{' '}
            <span className="px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {sumHours(
                data.horario_trabalho_estudo,
                (data.duracao_ritual_matinal / 60) * -1,
              ).replace(':', 'h') + 'm'}
            </span>{' '}
            <br /> e termina às{' '}
            <span className="px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {data.horario_trabalho_estudo.replace(':', 'h') + 'm'}
            </span>
          </span>
          <span className="text-zinc-400 text-xs">
            Adicione e organize sua rotina abaixo:
          </span>
        </div>
      </div>

      <div className="divide-y">
        <form
          className="flex flex-col w-full px-4 py-6 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full items-center gap-4">
            <Input
              placeholder="Digite um novo item"
              name="new-item"
              className="w-full h-10 flex-1"
              containerClassName="w-full"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <button type="submit">
              <PlusIcon className="text-primary" />
            </button>
          </div>
          {recommended.filter((item) => !items.some((i) => i.id === item.id))
            .length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs">Recomendados</p>
              <div className="flex items-center gap-2">
                {recommended
                  .filter((item) => !items.some((i) => i.id === item.id))
                  .map((item) => (
                    <span
                      key={item.id}
                      className="flex px-2 py-0.5 text-sm bg-red-900/50 text-primary rounded-full cursor-pointer"
                      onClick={() => setItems((prev) => [...prev, item])}
                    >
                      {item.text} +
                    </span>
                  ))}
              </div>
            </div>
          )}
        </form>
        <div className="flex flex-col px-4 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y">
                {items.map((item, index) => (
                  <SortableItem
                    key={index}
                    id={item.id}
                    index={index + 1}
                    text={item.text}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

function AddNightRitual({
  data,
  items,
  setItems,
}: {
  data?: RitualResponseDTO
  items: ListItem[]
  setItems: SetListItem
}) {
  const [newItem, setNewItem] = useState('')

  const recommended = [
    {
      id: '1',
      text: 'Escovar os dentes',
    },
    {
      id: '2',
      text: 'Shot noturno',
    },
  ]

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      setItems([...items, { id: `item-${Date.now()}`, text: newItem.trim() }])
      setNewItem('')
    }
  }

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin duration-150" />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 divide-y overflow-y-auto scrollbar-minimal">
      <div className="flex items-center p-6 gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/lobo-face.svg" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-3">
          <span className="font-normal text-sm">
            Seu Ritual Noturno começa às{' '}
            <span className="px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {sumHours(data.inicio_dormir, 0.5 * -1).replace(':', 'h') + 'm'}
            </span>{' '}
            <br /> e termina às{' '}
            <span className="px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {data.inicio_dormir.replace(':', 'h') + 'm'}
            </span>
          </span>

          <span className="text-zinc-400 text-xs">
            Adicione e organize sua rotina abaixo:
          </span>
        </div>
      </div>

      <div className="divide-y">
        <form
          className="flex flex-col w-full px-4 py-6 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full items-center gap-4">
            <Input
              placeholder="Digite um novo item"
              name="new-item"
              className="w-full h-10 flex-1"
              containerClassName="w-full"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />

            <PlusIcon className="text-primary" />
          </div>
          {recommended.filter((item) => !items.some((i) => i.id === item.id))
            .length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs">Recomendados</p>
              <div className="flex items-center gap-2">
                {recommended
                  .filter((item) => !items.some((i) => i.id === item.id))
                  .map((item) => (
                    <span
                      key={item.id}
                      className="flex px-2 py-0.5 text-sm bg-red-900/50 text-primary rounded-full cursor-pointer"
                      onClick={() => setItems((prev) => [...prev, item])}
                    >
                      {item.text} +
                    </span>
                  ))}
              </div>
            </div>
          )}
        </form>
        <div className="flex flex-col px-4 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y">
                {items.map((item, index) => (
                  <SortableItem
                    key={index}
                    id={item.id}
                    index={index + 1}
                    text={item.text}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

function calcularHorarioFinal(inicio: string, duracao: string): string {
  const [h1, m1] = inicio.split(':').map(Number)
  const dm = Number(duracao)

  const totalMin = h1 * 60 + m1 + dm
  const horas = Math.floor(totalMin / 60)
    .toString()
    .padStart(2, '0')
  const minutos = (totalMin % 60).toString().padStart(2, '0')

  return `${horas}:${minutos}`
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
