'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { ArrowRight, ClockIcon, RepeatIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { RepetitionData } from './create-event-dialog'
import { EditRepetitionDialogTrigger } from './edit-repetition-dialog'

const schema = z.object({
  title: z.string().min(1, { message: 'Obrigatório' }),
  description: z.string().optional(),
  category: z.string({ message: 'Obrigatório' }),
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
})

type RegisterData = z.infer<typeof schema>

export function EditEventDialog({
  open,
  setOpen,
  event,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
  event: Compromisso
}) {
  const session = useSession()
  // @ts-expect-error exists
  const accessToken = session?.data?.accessToken as string
  const [repetitionData, setRepetitionData] = useState<RepetitionData>({
    repete: 0,
  })
  const queryClient = useQueryClient()
  const [initialDate, setInitialDate] = useState<Date | undefined>(
    dayjs(event.comeca).toDate(),
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    dayjs(event.termina).toDate(),
  )

  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: event.titulo,
      description: event.descricao,
      category: event.categoria,
      initialTime: dayjs(event.comeca).format('HH:mm'),
      endTime: dayjs(event.termina).format('HH:mm'),
    },
  })

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  const selectTriggerClassName =
    'w-fit h-6 px-1 rounded border-0 data-[state=open]:border data-[state=open]:bg-cyan-700 data-[state=open]:text-cyan-400 text-xs group'
  const selectContentClassName =
    'p-[3px] rounded-lg bg-zinc-800 border-cyan-700'
  const selectItemClassName = 'text-xs data-[state=checked]:bg-zinc-700'

  async function handleUpdateEvent(data: RegisterData) {
    try {
      const postData = {
        ...(() => {
          return repetitionData.repete
            ? { ...repetitionData }
            : event.repete
              ? { ...event }
              : { repete: 0 }
        })(),
        titulo: data.title,
        descricao: data.description || '',
        comeca:
          dayjs(initialDate).format('YYYY-MM-DD') + ' ' + data.initialTime,
        termina: dayjs(endDate).format('YYYY-MM-DD') + ' ' + data.endTime,
        categoria: data.category,
      }
      // Buscar propriedades não nulas
      const filteredEvent = {
        ...Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(event).filter(([_, v]) => v != null),
        ),
      }

      // Se repete, mandar as outras propriedades referentes a repetição
      const actualPost = event.repete
        ? { ...filteredEvent, ...postData }
        : postData

      if (event.categoria === 'google') {
        actualPost.repete = 1
        await api.put('/eventos-google/update/' + event.event_id, actualPost, {
          headers: {
            Access: accessToken,
          },
        })
        queryClient.refetchQueries({ queryKey: ['events-google'] })
      } else {
        await api.put(
          '/compromissos/update/' + event.compromisso_id,
          actualPost,
        )
      }
      toast.success('Compromisso salvo')
      queryClient.refetchQueries({ queryKey: ['events'] })
      setOpen(false)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }
      toast.error('Não foi possível atualizar o compromisso.')
    }
  }

  async function handleDeleteEvent() {
    try {
      if (event.categoria === 'google') {
        await api.delete('/eventos-google/destroy/' + event.event_id, {
          headers: {
            Access: accessToken,
          },
        })
        queryClient.refetchQueries({ queryKey: ['events-google'] })
      } else {
        await api.delete('/compromissos/destroy/' + event.compromisso_id)
      }
      toast.success('Compromisso excluído')
      queryClient.refetchQueries({ queryKey: ['events'] })
      queryClient.refetchQueries({ queryKey: ['google-events'] })
      setOpen(false)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }
      setOpen(false)
    }
  }

  const handleUpdateRepetition = (data: Partial<RepetitionData>) => {
    setRepetitionData((prev) => ({
      ...prev,
      ...data,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <FormProvider {...form}>
        <DialogContent
          className="gap-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-col items-start p-3 border-b">
            <div className="flex items-center gap-2">
              <DialogTitle className="hidden">Editar Evento</DialogTitle>
              <Input
                placeholder="Título compromisso"
                className="h-8 pl-6 border-0 focus-visible:ring-0 placeholder:text-zinc-500"
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
            {event.categoria === 'google' ? (
              <Input
                className={selectTriggerClassName}
                value="Google"
                disabled
              />
            ) : (
              <Select
                onValueChange={(val) => setValue('category', val)}
                defaultValue={event.categoria}
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
                </SelectContent>
              </Select>
            )}
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
                  onChange={(e) => setValue('initialTime', e.target.value)}
                  required
                />
                <ArrowRight size={16} className="text-zinc-500" />
                <Input
                  className="p-1 border-0"
                  type="time"
                  {...register('endTime')}
                  onChange={(e) => setValue('endTime', e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <DatePicker
                  date={initialDate}
                  setDate={setInitialDate}
                  placeholder="Selecione uma data"
                />
                <ArrowRight size={16} className="text-zinc-500" />
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                  placeholder="Selecione uma data"
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
            {event.categoria !== 'google' && (
              <EditRepetitionDialogTrigger
                updateRepetition={handleUpdateRepetition}
              >
                <Button className="h-fit p-0 bg-transparent text-xs absolute bottom-3 right-3 text-zinc-400">
                  <RepeatIcon size={12} />
                  Editar repetição
                </Button>
              </EditRepetitionDialogTrigger>
            )}
          </div>
          <DialogFooter className="flex p-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="self-end bg-zinc-700"
                  variant="outline"
                >
                  Excluir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col w-[80%] p-7 gap-6">
                  <div className="flex flex-col gap-3">
                    <DialogTitle className="text-lg">
                      Tem certeza que deseja excluir esse evento?
                    </DialogTitle>
                    <p className="text-sm text-zinc-400">
                      Isso também excluirá suas repetições futuras.
                    </p>
                  </div>
                </div>
                <DialogFooter className="p-4 border-t">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleDeleteEvent}>Excluir</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              className="self-end"
              loading={isSubmitting}
              onClick={handleSubmit(handleUpdateEvent)}
            >
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  )
}
