import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { ArrowRight, ClockIcon, PlusIcon, RepeatIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, { message: 'Obrigatório' }),
  description: z.string().optional(),
  category: z.string({ message: 'Obrigatório' }),
  color: z.string().optional(),
  initialDate: z.date(),
  endDate: z.date(),
  initialTime: z.string().refine(
    (value) => {
      return dayjs(value, 'HH:mm', true).isValid()
    },
    {
      message: 'Horário inválido.',
    },
  ),
  endTime: z.string().refine(
    (value) => {
      return dayjs(value, 'HH:mm', true).isValid()
    },
    {
      message: 'Horário inválido.',
    },
  ),
  repeat: z.string().optional(),
})

type RegisterData = z.infer<typeof schema>

export function CreateEventDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [repeat, setRepeat] = useState(0)
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'Compromisso',
      initialDate: new Date(),
      endDate: new Date(),
    },
  })
  const session = useSession()
  const {
    setValue,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const initialDate = watch('initialDate')
  const endDate = watch('endDate')

  const selectTriggerClassName =
    'w-fit h-6 px-1 rounded border-0 data-[state=open]:border data-[state=open]:bg-cyan-700 data-[state=open]:text-cyan-400 text-xs group'
  const selectContentClassName =
    'p-[3px] rounded-lg bg-zinc-800 border-cyan-700'
  const selectItemClassName = 'text-xs data-[state=checked]:bg-zinc-700'

  function setRepeatMode(data: RegisterData) {
    let body = {}
    const repeteIntervaloDias = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    const weekday = dayjs().day()

    if (data.repeat === 'dia') {
      body = {
        titulo: data.title,
        descricao: data.description,
        comeca: `${dayjs(data.initialDate).format('YYYY-MM-DD') + ' ' + data.initialTime}`,
        termina: `${dayjs(data.endDate).format('YYYY-MM-DD') + ' ' + data.endTime}`,
        categoria: data.category,
        repete: 1,
        repete_intervalo_tipo: data.repeat,
        repete_opcao_termino: 'ocorrencias',
        repete_termino_ocorrencias: 30,
        repete_intervalo_quantidade: 1,
      }
    } else if (data.repeat === 'semana') {
      body = {
        titulo: data.title,
        descricao: data.description,
        comeca: `${dayjs(data.initialDate).format('YYYY-MM-DD') + ' ' + data.initialTime}`,
        termina: `${dayjs(data.endDate).format('YYYY-MM-DD') + ' ' + data.endTime}`,
        categoria: data.category,
        repete: 1,
        repete_intervalo_tipo: 'semana',
        repete_opcao_termino: 'ocorrencias',
        repete_termino_ocorrencias: 30,
        repete_intervalo_dias: [repeteIntervaloDias[weekday]],
        repete_intervalo_quantidade: 1,
      }
    } else if (data.repeat === 'weekDay') {
      body = {
        titulo: data.title,
        descricao: data.description,
        comeca: `${dayjs(data.initialDate).format('YYYY-MM-DD') + ' ' + data.initialTime}`,
        termina: `${dayjs(data.endDate).format('YYYY-MM-DD') + ' ' + data.endTime}`,
        categoria: data.category,
        repete: 1,
        repete_intervalo_tipo: 'semana',
        repete_opcao_termino: 'ocorrencias',
        repete_termino_ocorrencias: 30,
        repete_intervalo_dias: [repeteIntervaloDias[weekday]],
        repete_intervalo_quantidade: 1,
      }
    } else if (data.repeat === 'monthDay') {
      body = {
        titulo: data.title,
        descricao: data.description,
        comeca: `${dayjs(data.initialDate).format('YYYY-MM-DD') + ' ' + data.initialTime}`,
        termina: `${dayjs(data.endDate).format('YYYY-MM-DD') + ' ' + data.endTime}`,
        categoria: data.category,
        repete: 1,
        repete_intervalo_tipo: 'mes',
        repete_opcao_termino: 'ocorrencias',
        repete_termino_ocorrencias: 10,
        repete_intervalo_quantidade: 1,
      }
    }
    return body // TODO MONTAR A REPETIÇÃO CUSTOM
  }
  async function handleCreateEvent(data: RegisterData) {
    try {
      if (data.category === 'google') {
        const body = {
          titulo: data.title || '(Sem Título)',
          descricao: data.description || '(Sem descrição)',
          comeca:
            dayjs(data.initialDate).format('YYYY-MM-DD') +
            ' ' +
            data.initialTime,
          termina:
            dayjs(data.endDate).format('YYYY-MM-DD') + ' ' + data.endTime,
          repete: 0,
        }
        await api.post('/eventos-google/post', body)
      } else {
        if (repeat) {
          const body = setRepeatMode(data)
          await api.post('/compromissos/store', body)
        } else {
          await api.post('/compromissos/store', {
            titulo: data.title,
            descricao: data.description,
            comeca:
              dayjs(data.initialDate).format('YYYY-MM-DD') +
              ' ' +
              data.initialTime,
            termina:
              dayjs(data.endDate).format('YYYY-MM-DD') + ' ' + data.endTime,
            repete: 0,
            categoria: data.category,
          })
        }
      }
      toast.success('Compromisso salvo')
      reset()
      setIsOpen(false)
      queryClient.refetchQueries({ queryKey: ['events'] })
      setIsOpen(false)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }
      toast.error('Erro ao agendar o compromisso')
    }
  }

  function setInitialDate(date: Date | undefined) {
    if (!date) return
    setValue('initialDate', date)
  }

  function setEndDate(date: Date | undefined) {
    if (!date) return
    setValue('endDate', date)
  }

  useEffect(() => {
    if (initialDate.getTime() > endDate.getTime()) {
      setValue('endDate', initialDate)
    }
  }, [initialDate])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FormProvider {...form}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="gap-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-col items-start p-3 border-b">
            <div className="flex items-center gap-2">
              <DialogTitle>
                <div className="w-4 h-4 rounded border-2 border-white" />
              </DialogTitle>
              <Input
                placeholder="Título compromisso"
                className="h-8 p-0 border-0 focus-visible:ring-0 placeholder:text-zinc-500"
                {...register('title')}
              />
              {errors?.title && (
                <span className="text-[10px] text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" />
              <Input
                placeholder="Adicionar descrição"
                className="h-8 p-0 border-0 focus-visible:ring-0 text-xs placeholder:text-xs text-zinc-400 placeholder:text-zinc-400 placeholder:font-semibold"
                {...register('description')}
              />
            </div>
          </DialogHeader>
          <div className="flex items-center p-3 gap-2 border-b">
            <div className="w-2 h-2 rounded-full bg-zinc-500" />
            <Select
              defaultValue="Compromisso"
              onValueChange={(val) => setValue('category', val)}
            >
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem
                  value="Compromisso"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-1 h-1 rounded bg-cyan-400 group-data-[state=closed]:hidden" />
                    Compromisso
                  </div>
                </SelectItem>
                <SelectItem
                  value="Refeição"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-1 h-1 rounded bg-yellow-400 group-data-[state=closed]:hidden" />
                    Refeição
                  </div>
                </SelectItem>
                <SelectItem
                  value="Treino"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-1 h-1 rounded bg-red-500 group-data-[state=closed]:hidden" />
                    Treino
                  </div>
                </SelectItem>
                <SelectItem
                  value="Pessoal"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="w-1 h-1 rounded bg-green-500 group-data-[state=closed]:hidden" />
                    Pessoal
                  </div>
                </SelectItem>
                {session && (
                  <SelectItem
                    value="google"
                    className={selectItemClassName}
                    hideIcon
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-1 h-1 rounded bg-violet-500 group-data-[state=closed]:hidden" />
                      Google
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors?.category && (
              <span className="text-xs text-red-500">
                {errors.category.message}
              </span>
            )}
          </div>
          <div className="flex relative items-center p-3 gap-2 border-b">
            <ClockIcon className="text-zinc-800" fill="#71717a" size={16} />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Input
                  className="p-1 border-0"
                  type="time"
                  {...register('initialTime')}
                  defaultValue={dayjs().format('HH:mm')}
                  onChange={(e) => setValue('initialTime', e.target.value)}
                  required
                />
                <ArrowRight size={16} className="text-zinc-500" />
                <Input
                  className="p-1 border-0"
                  type="time"
                  {...register('endTime')}
                  defaultValue={dayjs().add(30, 'minutes').format('HH:mm')}
                  onChange={(e) => setValue('endTime', e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <DatePicker
                  date={initialDate}
                  setDate={setInitialDate}
                  placeholder="Selecione uma data"
                  fromDate={new Date()}
                />
                <ArrowRight size={16} className="text-zinc-500" />
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  placeholder="Selecione uma data"
                  fromDate={initialDate}
                />
              </div>
              {errors?.initialTime ? (
                <span className="text-xs text-red-500">
                  {errors.initialTime.message}
                </span>
              ) : (
                errors?.endTime && (
                  <span className="text-xs text-red-500">
                    {errors.endTime.message}
                  </span>
                )
              )}
            </div>
            <Select
              onValueChange={(val) => {
                setValue('repeat', val)
                setRepeat(1)
              }}
            >
              <SelectTrigger
                className={cn(
                  selectTriggerClassName,
                  'absolute bottom-3 right-3 text-zinc-400',
                )}
                hideIcon
              >
                <RepeatIcon size={12} />
                <SelectValue placeholder="Repetir" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem
                  value="dia"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    Repetir diariamente
                  </div>
                </SelectItem>
                <SelectItem
                  value="semana"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    Repetir semanalmente
                  </div>
                </SelectItem>
                <SelectItem
                  value="weekDay"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    {(() => {
                      const weekday = dayjs().day()
                      const weekdayText = weekdays[weekday]

                      const all = weekday > 0 && weekday < 6 ? 'Toda' : 'Todo'

                      return `${all} ${weekdayText}`
                    })()}
                  </div>
                </SelectItem>
                <SelectItem
                  value="monthDay"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    Todo dia {dayjs().date()}
                  </div>
                </SelectItem>
                <SelectItem
                  value="none"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    Não repetir
                  </div>
                </SelectItem>
                <SelectItem
                  value="custom"
                  className={selectItemClassName}
                  hideIcon
                >
                  <div className="flex flex-row items-center gap-2">
                    Personalizar...
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex p-3">
            <Button
              size="sm"
              className="self-end"
              onClick={handleSubmit(handleCreateEvent)}
              loading={isSubmitting}
            >
              Criar <PlusIcon size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}

const weekdays = [
  'domingo',
  'segunda',
  'terça',
  'quarta',
  'quinta',
  'sexta',
  'sábado',
]
