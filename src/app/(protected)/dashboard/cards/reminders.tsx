'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import TextareaUpperFirstWord from '@/components/ui/textareaUpperFirstWord'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { AlertTriangleIcon, Maximize2, Plus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function RemindersCard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null,
  )

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const response = await api.get('/nao-esquecer/find')
      return response.data as Reminder[]
    },
  })

  if (isLoading) {
    return <Skeleton className="flex flex-col w-full h-full min-h-[300px]" />
  }

  if (!reminders) {
    return (
      <Card className="flex flex-col w-full h-full min-h-[300px] relative p-4 gap-5 overflow-hidden">
        <CardHeader className="justify-between">
          <div className="flex px-3 py-2 pt-1 border border-white rounded-full">
            <span className="text-[10px] font-semibold">LEMBRETES</span>
          </div>
          <Maximize2 className="text-zinc-500" />
        </CardHeader>
        <div className="flex flex-col w-full flex-1 items-center justify-center gap-3">
          <AlertTriangleIcon className="text-red-400" strokeWidth={2} />
          <p className=" text-center ext-zinc-700">
            Não foi possível carregar os lembretes!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] relative p-4 gap-5 overflow-hidden">
      <CardHeader className="justify-between">
        <div className="flex px-3 py-2 pt-[9px] border border-white rounded-full">
          <span className="text-[10px] font-semibold">LEMBRETES</span>
        </div>
        {/* <Maximize2 className="text-zinc-500" /> */}
      </CardHeader>
      {reminders.length > 0 ? (
        <ReminderCard
          reminders={reminders.filter((item) => !item.checked)}
          setSelected={setSelectedReminder}
          setDialogOpen={setDialogOpen}
          setDialogMode={setDialogMode}
        />
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center">
          <p className="text-xl text-center">Você não criou nenhum lembrete</p>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Plus
            className="absolute text-primary right-4 bottom-4 z-10 cursor-pointer"
            onClick={() => setDialogMode('create')}
          />
        </DialogTrigger>
        <ReminderDialog
          onClose={() => setDialogOpen(false)}
          mode={dialogMode}
          reminder={selectedReminder}
        />
      </Dialog>
    </Card>
  )
}

interface ReminderProps {
  text: string
  index: number
  position: { x: number; y: number; rotate: number }
  onClick: () => void
}

const Reminder = ({ text, index, position, onClick }: ReminderProps) => {
  return (
    <motion.div
      className="absolute bg-white shadow-md flex flex-col"
      style={{
        rotate: position.rotate,
        x: position.x,
        y: position.y,
        zIndex: index,
        width: '95px',
        height: '71px',
        padding: '12px 8px',
      }}
      initial={{ rotate: position.rotate, x: position.x, y: position.y }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-gray-300 border-r-gray-300 shadow-sm" />
      <div className="absolute top-0 right-0 w-0 h-0 border-b-[10px] border-l-[10px] border-b-white border-l-transparent" />
      <span className="text-[6px] text-gray-400 mb-1">#{index + 1}</span>
      <p className="text-[10px] font-bold text-gray-700 z-10 line-clamp-3">
        {text}
      </p>
    </motion.div>
  )
}

interface ReminderCardProps {
  reminders: Reminder[]
  setSelected: (reminder: Reminder) => void
  setDialogOpen: (open: boolean) => void
  setDialogMode: (mode: 'create' | 'edit') => void
}

const reminderPositions = [
  { x: -5, y: 30, rotate: -18 },
  { x: -6, y: 95, rotate: 40 },
  { x: 120, y: 125, rotate: -3 },
  { x: 40, y: 120, rotate: -12 },
  { x: 160, y: 66, rotate: 22 },
  { x: 50, y: 66, rotate: -10 },
  { x: 95, y: 66, rotate: 23 },
  { x: 120, y: 25, rotate: -5 },
  { x: 65, y: 15, rotate: 4 },
]

function ReminderCard({
  reminders,
  setSelected,
  setDialogMode,
  setDialogOpen,
}: ReminderCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  function handleClick(reminder: Reminder) {
    setSelected(reminder)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* <div className="absolute inset-0 bg-gradient-to-br from-transparent from-[50%] to-card to-[90%] z-10" /> */}
      {Array.from({ length: 7 }, (_, index) => {
        const reminder = reminders[index]
        if (!reminder) return null

        const position = reminderPositions[index]

        return (
          <motion.div
            key={index}
            className="cursor-pointer"
            animate={
              isHovered
                ? {
                    y: position.y + (Math.random() * 10 - 5),
                    x: position.x + (Math.random() * 10 - 5),
                    transition: { duration: 0.5 },
                  }
                : {
                    y: position.y,
                    x: position.x,
                    transition: { duration: 0.5 },
                  }
            }
          >
            <Reminder
              text={reminder.item}
              index={index}
              position={position}
              onClick={() => handleClick(reminder)}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

const schema = z.object({
  item: z.string().min(1, { message: 'Obrigatório' }),
  checked: z.boolean().optional(),
})

type RegisterData = z.infer<typeof schema>

function ReminderDialog({
  onClose,
  mode = 'create',
  reminder,
}: {
  onClose: () => void
  mode?: 'create' | 'edit'
  reminder?: Reminder | null
}) {
  const queryClient = useQueryClient()
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = form

  async function handleRegister(data: RegisterData) {
    try {
      if (mode === 'edit' && reminder) {
        await api.put(`/nao-esquecer/update/${reminder.nao_esquecer_id}`, {
          checked: data.checked || false,
          item: data.item,
        })
        toast.success('Lembrete atualizado')
        reset()
      } else {
        await api.post(`/nao-esquecer/store`, {
          checked: data.checked || false,
          item: data.item,
        })
        toast.success('Lembrete criado')
        reset()
      }
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      onClose()
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
        console.log(err)
      }
    }
  }

  useEffect(() => {
    if (reminder && mode === 'edit') {
      form.setValue('item', reminder.item)
    }
    if (mode === 'create') {
      reset({ item: undefined })
    }
  }, [reminder])

  return (
    <FormProvider {...form}>
      <DialogContent className="max-h-[85%] bg-zinc-900">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleRegister)}
        >
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar lembrete' : 'Criar lembrete'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 p-4 py-2">
            <Image
              height={33}
              width={46}
              alt="Quote"
              src={'/icons/quote.svg'}
              className="scale-75"
            />
            <TextareaUpperFirstWord {...register('item')} rows={8} />
            {errors.item && (
              <span className="text-red-400 text-xs">
                {errors.item.message}
              </span>
            )}
            <span className="flex items-center gap-2 text-sm font-medium mt-2">
              <Checkbox
                onCheckedChange={(val: CheckedState) => {
                  const checked = val.valueOf() === true || false
                  setValue('checked', checked)
                }}
              />
              Concluído
            </span>
          </div>
          <DialogFooter className="border-t p-4">
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </FormProvider>
  )
}
