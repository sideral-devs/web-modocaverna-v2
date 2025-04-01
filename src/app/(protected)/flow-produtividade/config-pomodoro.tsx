'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock, CrosshairIcon } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  productivityTime: z.string({ required_error: 'Obrigatório ' }),
  shortBreakTime: z.string({ required_error: 'Obrigatório ' }),
  longBreakTime: z.string({ required_error: 'Obrigatório ' }),
})

type RegisterData = z.infer<typeof schema>

export function ConfigPomodoroDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = useQueryClient()
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
  })

  const [isOpen, setIsOpen] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = form

  const { data: pomodoro } = useQuery({
    queryKey: ['pomodoro'],
    queryFn: async () => {
      const response = await api.get('/pomodoro/today')
      return response.data as PomodoroResponse
    },
  })

  async function handleRegister(data: RegisterData) {
    if (!pomodoro) return
    try {
      await api.put(`/pomodoro/update/${pomodoro.pomodoro_id}`, {
        minutagem_produtividade: toSeconds(data.productivityTime),
        intervalo_curto: toSeconds(data.shortBreakTime),
        intervalo_longo: toSeconds(data.longBreakTime),
      })

      queryClient.invalidateQueries({ queryKey: ['pomodoro'] })

      toast.success('Atualizado')

      setIsOpen(false)
    } catch {
      toast.error('Não foi possível realizar isso nesse momento!')
    }
  }

  useEffect(() => {
    if (pomodoro) {
      reset({
        productivityTime: toMinutesSeconds(
          Number(pomodoro.minutagem_produtividade),
        ),
        longBreakTime: toMinutesSeconds(Number(pomodoro.intervalo_longo)),
        shortBreakTime: toMinutesSeconds(Number(pomodoro.intervalo_curto)),
      })
    }
  }, [pomodoro, reset])

  function timeMask(val: string) {
    let value = val.replace(/\D/g, '')

    value = value.padStart(4, '0').slice(-4)
    const minutes = value.slice(0, 2) // Dois primeiros caracteres são os minutos
    let seconds = value.slice(2, 4) // Dois últimos caracteres são os segundos

    // Garante que os segundos não ultrapassem 59
    if (parseInt(seconds, 10) > 59) {
      seconds = '59'
    }

    return `${minutes}:${seconds}`
  }

  function toSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }

  function toMinutesSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Configurar Pomodoro</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div className="flex flex-col overflow-y-auto">
            <div className="grid grid-cols-3 px-4 py-8 gap-4">
              <span className="flex col-span-2 items-center gap-3">
                <CrosshairIcon size={20} />
                Produtividade
              </span>
              <div className="flex flex-col gap-2 justify-self-end">
                <label className="text-xs text-zinc-400">minutos</label>
                <Input
                  className="w-20 p-1 pl-2 border-0"
                  {...register('productivityTime')}
                  onChange={(e) => {
                    const value = e.target.value
                    const formatted = timeMask(value)

                    setValue('productivityTime', formatted)
                  }}
                  required
                />
              </div>
              {errors.productivityTime && (
                <span className="text-red-400 text-xs">
                  {errors.productivityTime.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-1 bg-border" />
          <div className="flex flex-col items-center px-4 py-8 gap-8">
            <h2 className="text-lg font-semibold">
              Defina o tempo dos intervalos
            </h2>
            <div className="grid grid-cols-3 w-full">
              <span className="flex col-span-2 items-center gap-3">
                <Clock size={20} />
                Curto
              </span>
              <div className="flex flex-col gap-2 justify-self-end">
                <label className="text-xs text-zinc-400">minutos</label>
                <Input
                  className="w-20 p-1 pl-2 border-0"
                  {...register('shortBreakTime')}
                  onChange={(e) => {
                    const value = e.target.value
                    const formatted = timeMask(value)

                    setValue('shortBreakTime', formatted)
                  }}
                  required
                />
              </div>
              {errors.shortBreakTime && (
                <span className="text-red-400 text-xs">
                  {errors.shortBreakTime.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 w-full">
              <span className="flex col-span-2 items-center gap-3">
                <Clock size={20} />
                Longo
              </span>
              <div className="flex flex-col gap-2 justify-self-end">
                <label className="text-xs text-zinc-400">minutos</label>
                <Input
                  className="w-20 p-1 pl-2 border-0"
                  {...register('longBreakTime')}
                  onChange={(e) => {
                    const value = e.target.value
                    const formatted = timeMask(value)

                    setValue('longBreakTime', formatted)
                  }}
                  required
                />
              </div>
              {errors.longBreakTime && (
                <span className="text-red-400 text-xs">
                  {errors.longBreakTime.message}
                </span>
              )}
            </div>
          </div>
        </FormProvider>
        <DialogFooter className="border-t p-4">
          <Button
            onClick={handleSubmit(handleRegister)}
            loading={isSubmitting}
            type="submit"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
