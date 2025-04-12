'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn, timeMask } from '@/lib/utils'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  Bed,
  BriefcaseBusiness,
  Clock,
  CloudSun,
  GripVertical,
  Loader2,
  MoonIcon,
  PlusIcon,
  Sunrise,
  Trash2,
} from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addHours, format, parse } from 'date-fns'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ritualFormSchema = z.object({
  workTime: z.string().min(4, 'Informe um horário válido'),
  sleepTime: z.string().min(4, 'Informe um horário válido'),
  morningRoutine: z.string().min(4, 'Informe um horário válido'),
})

type RitualFormValues = z.infer<typeof ritualFormSchema>

interface RitualResponseDTO {
  rituais_calculadora_id: number
  duracao_ritual_matinal: number
  horario_trabalho_estudo: string
  inicio_dormir: string
}

interface RitualResponseItem {
  id: number
  horario_inicial: string
  horario_final: string
  itens: string[]
  tipo_ritual: number
  created_at: string
  updated_at: string
}

type ListItem = {
  id: string
  text: string
}

type SetListItem = Dispatch<SetStateAction<ListItem[]>>

function timeStringToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function sumHours(hour: string, hours: number) {
  const date = parse(hour, 'HH:mm', new Date())

  const novaData = addHours(date, hours)

  return format(novaData, 'HH:mm')
}

export default function RitualsCard() {
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false)
  const [finishDialogOpen, setFinishDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: morningRitual } = useQuery({
    queryKey: ['rituais-blocos-matinais'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=1')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const { data: nightRitual } = useQuery({
    queryKey: ['rituais-blocos-noturnos'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=2')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const updateBlocks = useMutation({
    mutationFn: async (data: RitualResponseItem) => {
      await api.put('/blocos/update/' + data.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rituais-blocos-matinais'] })
      queryClient.invalidateQueries({ queryKey: ['rituais-blocos-noturnos'] })
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleRemove = (item: string, ritual: RitualResponseItem) => {
    const updated = {
      ...ritual,
      itens: ritual.itens.filter((i) => i !== item),
    }
    updateBlocks.mutate(updated)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!morningRitual || !over || active.id === over.id) return

    console.log({ active, over })

    const oldIndex = morningRitual.itens.findIndex((item) => item === active.id)
    const newIndex = morningRitual.itens.findIndex((item) => item === over.id)

    const moved = arrayMove(morningRitual.itens, oldIndex, newIndex)
    updateBlocks.mutate({ ...morningRitual, itens: moved })
  }

  if (morningRitual && nightRitual) {
    return (
      <Card className="flex flex-col w-full h-full min-h-[300px] relative overflow-hidden">
        <CardHeader className="justify-between p-4">
          <div className="flex px-3 py-2 pt-[9px] border border-white rounded-full">
            <span className="text-[10px] font-semibold">RITUAIS</span>
          </div>
        </CardHeader>
        <div className="flex flex-col flex-1">
          <Tabs defaultValue="matinal">
            <TabsList className="w-full border-b px-4">
              <TabsTrigger
                value="matinal"
                className="p-3 text-sm relative data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none"
              >
                Matinal
              </TabsTrigger>
              <TabsTrigger
                value="noturno"
                className="p-3 text-sm relative data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none"
              >
                Noturno
              </TabsTrigger>
            </TabsList>
            <TabsContent value="matinal">
              <div className="flex flex-col px-4 divide-y">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={morningRitual.itens}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="divide-y">
                      {morningRitual.itens.map((item, index) => (
                        <SortableItem
                          key={index}
                          id={item + '-' + index}
                          index={index + 1}
                          text={item}
                          onRemove={() => handleRemove(item, morningRitual)}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              </div>
            </TabsContent>
            <TabsContent value="noturno">
              <div className="flex flex-col px-4 divide-y">
                <ul className="divide-y">
                  {nightRitual.itens.map((item, index) => (
                    <SortableItem
                      key={index}
                      id={item + '-' + index}
                      index={index + 1}
                      text={item}
                      onRemove={() => handleRemove(item, nightRitual)}
                    />
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] relative p-4 gap-5 overflow-hidden">
      <CardHeader className="justify-between">
        <div className="flex px-3 py-2 pt-[9px] border border-white rounded-full">
          <span className="text-[10px] font-semibold">RITUAIS</span>
        </div>
      </CardHeader>
      <div className="flex flex-col flex-1 items-center justify-center relative">
        <Image
          src="/images/empty-states/empty_rituals.png"
          alt="Nenhum objetivo encontrado"
          width={140}
          height={110}
          className="opacity-50"
        />
        <div className="w-60">
          <p className="text-[13px] text-zinc-400 text-center">
            Em breve você poderá criar e acompanhar seus rituais por aqui.
          </p>
        </div>
      </div>
      <CardFooter className="p-0">
        <Dialog open={stepsDialogOpen} onOpenChange={setStepsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-100 text-primary ml-auto"
            >
              Criar ritual
            </Button>
          </DialogTrigger>
          <ConfigRitualDialog
            onClose={() => {
              setStepsDialogOpen(false)
              setFinishDialogOpen(true)
            }}
          />
        </Dialog>
        <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
          <DialogContent className="h-[633px] max-h-[80%] rounded-3xl">
            <div className="flex flex-col flex-1 items-center justify-center gap-6">
              <Image
                src="/images/empty-states/empty_rituals.png"
                alt="Nenhum objetivo encontrado"
                width={140}
                height={110}
                className="opacity-50"
              />
              <DialogTitle>Rituais criados com sucesso</DialogTitle>
              <p className="text-zinc-400 text-xs text-center max-w-60">
                Acompanhe seus rituais na tela inicial da Central Caverna
              </p>
              <DialogClose asChild>
                <Button size="sm">Finalizar</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

function ConfigRitualDialog({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [morningItems, setMorningItems] = useState<ListItem[]>([])
  const [nightItems, setNightItems] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)

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
        duracao_ritual_matinal: String(
          timeStringToMinutes(data.morningRoutine),
        ),
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

  async function stepThreeSubmit() {
    setLoading(true)
    try {
      await api.post('/blocos/store', {
        horario_inicial: '07:00',
        horario_final: '07:30',
        itens: morningItems.map((i) => i.text),
        tipo_ritual: 1,
      })
    } catch {
      toast.error('Não foi possível fazer isso agora!')
    } finally {
      setLoading(false)
    }
  }

  async function stepFourSubmit() {
    setLoading(true)
    try {
      await api.post('/blocos/store', {
        horario_inicial: '22:00',
        horario_final: '22:30',
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
        currentStep > 2 ? 'h-[744px] max-h-[90%]' : 'h-[538px] max-h-[70%]',
      )}
    >
      <DialogHeader className="p-0 pt-4 gap-4">
        <DialogTitle>Calcular hábitos</DialogTitle>
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

      <DialogFooter className="flex !flex-row w-full items-center !justify-between py-2 pr-1 pl-5 bg-zinc-800">
        <span>
          {currentStep} de {allSteps}
        </span>
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
                await stepThreeSubmit()
                nextStep()
                break
              case 4:
                await stepFourSubmit()
                setCurrentStep(1)
                setMorningItems([])
                setNightItems([])
                onClose()
            }
          }}
        >
          Continuar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function CalculateHabitStep({
  form,
}: {
  form: UseFormReturn<RitualFormValues>
}) {
  const { register, setValue } = form

  return (
    <div className="flex flex-col flex-1 divide-y">
      <div className="flex items-center p-6 gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/images/lobo-face.svg" />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <p className="font-normal text-sm">
          O sistema te ajudará a determinar os horários dos seus rituais de
          acordo com as suas necessidades. Para isso,{' '}
          <strong>responda as perguntas a seguir:</strong>
        </p>
      </div>
      <div className="flex items-center justify-between px-5 py-7">
        <span className="flex items-center gap-2 text-sm">
          <BriefcaseBusiness size={16} />
          Horário de trabalho/estudo
        </span>
        <div className="relative">
          <Clock
            className="absolute left-2 top-1/2 bottom-1/2 -translate-y-1/2 z-50 fill-zinc-400  text-zinc-700"
            size={16}
          />
          <Input
            className="w-24 p-1 pl-8 border-0 bg-zinc-700"
            {...register('workTime')}
            onChange={(e) => {
              const value = e.target.value
              const formatted = timeMask(value)

              setValue('workTime', formatted)
            }}
            required
            maxLength={5}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-7">
        <span className="flex items-center gap-2 text-sm">
          <Bed size={16} />
          Horário de dormir
        </span>
        <div className="relative">
          <Clock
            className="absolute left-2 top-1/2 bottom-1/2 -translate-y-1/2 z-50 fill-zinc-400  text-zinc-700"
            size={16}
          />
          <Input
            className="w-24 p-1 pl-8 border-0 bg-zinc-700"
            {...register('sleepTime')}
            onChange={(e) => {
              const value = e.target.value
              const formatted = timeMask(value)
              setValue('sleepTime', formatted)
            }}
            required
            maxLength={5}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-7">
        <span className="flex items-center gap-2 text-sm">
          <Sunrise size={16} />
          Duração ritual matinal
        </span>
        <div className="relative">
          <Clock
            className="absolute left-2 top-1/2 bottom-1/2 -translate-y-1/2 z-50 fill-zinc-400  text-zinc-700"
            size={16}
          />
          <Input
            className="w-24 p-1 pl-8 border-0 bg-zinc-700"
            {...register('morningRoutine')}
            onChange={(e) => {
              const value = e.target.value
              const formatted = timeMask(value)
              setValue('morningRoutine', formatted)
            }}
            required
            maxLength={5}
          />
        </div>
      </div>
    </div>
  )
}

function ResultStep({ data }: { data?: RitualResponseDTO }) {
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
          <h3 className="font-semibold text-sm">Hábitos calculados</h3>
          <p className="font-normal text-sm">
            De acordo com as suas respostas, aqui estão algumas informações que
            determinam os seus rituais.
          </p>
          <span className="text-zinc-400 text-xs">
            Altere sempre que desejar ou for necessário.
          </span>
        </div>
      </div>
      <div className="flex flex-col px-4 py-6 gap-5">
        <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-red-900/30">
            <Bed className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold leading-tight">Sono</h3>
            <span className="text-xs leading-none">
              Tenha pelo menos 8 horas de sono diárias
            </span>
          </div>
        </div>
        <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-red-900/30">
            <AlarmClock className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold leading-tight">Manhã</h3>
            <span className="text-xs leading-none">
              Acorde às <strong>{sumHours(data.inicio_dormir, 8)}</strong>
            </span>
          </div>
        </div>
        <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-red-900/30">
            <CloudSun className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold leading-tight">
              Ritual Matinal
            </h3>
            <span className="text-xs leading-none">
              Dedique {data.duracao_ritual_matinal} minutos ao{' '}
              <strong>Ritual Matinal</strong>
            </span>
          </div>
        </div>
        <div className="flex w-full items-center p-1 gap-4 bg-[#1e1e1e] rounded-2xl">
          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-red-900/30">
            <MoonIcon className="text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold leading-tight">
              Ritual Noturno
            </h3>
            <span className="text-xs leading-none">
              Dedique {data.duracao_ritual_matinal} minutos ao{' '}
              <strong>Ritual Noturno</strong>. Inicie às{' '}
              {sumHours(
                data.inicio_dormir,
                (data.duracao_ritual_matinal / 60) * -1,
              )}
            </span>
          </div>
        </div>
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
          <p className="font-normal text-sm">
            Seu Ritual Matinal começa e termina às:
          </p>
          <div className="flex items-center gap-2">
            <span className="flex px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {sumHours(data.inicio_dormir, 8).replace(':', 'h') + 'm'}
            </span>
            <span className="flex px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {sumHours(
                sumHours(data.inicio_dormir, 8),
                data.duracao_ritual_matinal / 60,
              ).replace(':', 'h') + 'm'}
            </span>
          </div>
          <span className="text-zinc-400 text-xs">
            Adicione e organize sua rotina abaixo:
          </span>
        </div>
      </div>

      <div className="">
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
          <div className="flex flex-col gap-3">
            <p className="text-xs">Recomendado</p>
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
        </form>
        <div className="flex flex-col px-4 py-6 divide-y">
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

        console.log({ items, oldIndex, newIndex })

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
          <p className="font-normal text-sm">
            Seu Ritual Matinal começa e termina às:
          </p>
          <div className="flex items-center gap-2">
            <span className="flex px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {sumHours(data.inicio_dormir, 8).replace(':', 'h') + 'm'}
            </span>
            <span className="flex px-2 py-0.5 bg-cyan-700 text-cyan-400 text-xs rounded-full">
              {sumHours(
                sumHours(data.inicio_dormir, 8),
                data.duracao_ritual_matinal / 60,
              ).replace(':', 'h') + 'm'}
            </span>
          </div>
          <span className="text-zinc-400 text-xs">
            Adicione e organize sua rotina abaixo:
          </span>
        </div>
      </div>

      <div className="">
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
          <div className="flex flex-col gap-3">
            <p className="text-xs">Recomendado</p>
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
        </form>
        <div className="flex flex-col px-4 py-6 divide-y">
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

function SortableItem({
  index,
  id,
  text,
  onRemove,
}: {
  index: number
  id: string
  text: string
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex w-full items-center py-6 gap-4"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} className="text-zinc-400" />
      </div>
      <div className="w-4 h-4 flex items-center justify-center bg-zinc-700 rounded">
        <span className="text-[10px]">{index}</span>
      </div>
      <span className="flex-1 text-sm">{text}</span>

      <Trash2
        className="h-4 w-4 text-zinc-400 cursor-pointer"
        onClick={onRemove}
      />
    </li>
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
