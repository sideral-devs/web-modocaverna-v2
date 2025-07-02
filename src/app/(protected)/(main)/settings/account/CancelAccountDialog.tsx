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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório ' })
    .regex(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Por favor, insira um e-mail válido',
    ),
  reason: z.string({ required_error: 'Campo obrigatório' }),
})

type PasswordData = z.infer<typeof schema>

export function CancelAccountDialogTrigger() {
  const form = useForm<PasswordData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  function handleCancelAccount(data: PasswordData) {
    // TODO: Integrar com API
    console.log(data)
  }

  useEffect(() => {
    reset()
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Cancelar Assinatura
        </Button>
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...form}>
          <DialogHeader>
            <DialogTitle>Cancelar assinatura</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col px-6 py-10 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs">
                E-mail de login
              </label>
              <Input
                className="h-10"
                placeholder="Insira o e-mail"
                {...register('email')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="reason" className="text-xs">
                Motivo
              </label>
              <Textarea
                {...register('reason')}
                placeholder="Insira o motivo"
                rows={9}
              />
              {errors && errors.reason && (
                <span className="text-xs text-primary">
                  {errors.reason.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter className="p-4 border-t">
            <Button
              onClick={handleSubmit(handleCancelAccount)}
              variant="outline"
              className="bg-zinc-700"
            >
              Solicitar cancelamento
            </Button>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
