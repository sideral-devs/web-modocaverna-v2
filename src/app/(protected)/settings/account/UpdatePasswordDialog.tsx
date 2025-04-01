'use client'
import { PhaseCounter } from '@/app/(public)/trial/sign-up/PhaseCounter'
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
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  password: z.string({ required_error: 'Por favor, insira sua senha ' }),
  newPassword: z
    .string({ required_error: 'Por favor, insira uma senha ' })
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  confirmNewPassword: z.string({
    required_error: 'Por favor, confirme sua senha',
  }),
})

type PasswordData = z.infer<typeof schema>

export function UpdatePasswordDialogTrigger() {
  const [firstRuleValid, setFirstRuleValid] = useState(false)
  const [secondRuleValid, setSecondRuleValid] = useState(false)
  const [thirdRuleValid, setThirdRuleValid] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [strength, setStrength] = useState(1)

  const form = useForm<PasswordData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const password = watch('newPassword')

  async function handleSavePassword(data: PasswordData) {
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        setError('confirmNewPassword', { message: 'As senhas não coincidem' })
        return
      }

      await api.put('/users/editPassword', {
        old_password: data.password,
        password: data.newPassword,
        password_confirmation: data.confirmNewPassword,
      })
      reset()
      setIsOpen(false)
      toast.success('Senha alterada com sucesso!')
    } catch (error) {
      if ((error as { response?: { data?: ApiError } })?.response?.data) {
        const apiError = (error as { response: { data: ApiError } }).response
          .data
        toast.error(apiError.message)
      } else {
        toast.error('Ocorreu um erro ao alterar a senha')
      }
    }
  }

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    if (password?.match(/[A-Z]/)) {
      setFirstRuleValid(true)
    } else {
      setFirstRuleValid(false)
    }
    if (password?.match(/[^a-zA-Z0-9]/)) {
      setSecondRuleValid(true)
    } else {
      setSecondRuleValid(false)
    }
    if (password?.length >= 8) {
      setThirdRuleValid(true)
    } else {
      setThirdRuleValid(false)
    }
  }, [password])

  useEffect(() => {
    setStrength(1)
    if (firstRuleValid) {
      setStrength((curr) => curr + 1)
    }
    if (secondRuleValid) {
      setStrength((curr) => curr + 1)
    }
    if (thirdRuleValid) {
      setStrength((curr) => curr + 1)
    }
  }, [firstRuleValid, secondRuleValid, thirdRuleValid])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Atualizar senha</Button>
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...form}>
          <DialogHeader>
            <DialogTitle>Atualizar senha</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col px-6 py-10 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs">
                Senha atual
              </label>
              <Input
                type="password"
                className="h-10"
                {...register('password')}
              />
              <Link href="/forgot-password" className="text-xs text-primary">
                Esqueceu sua senha? Clique para recuperar.
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="new-password" className="text-xs">
                Nova senha
              </label>
              <Input
                type="password"
                className="h-10"
                {...register('newPassword')}
              />
              <PhaseCounter
                total={4}
                current={strength}
                className="my-2"
                animate={{
                  backgroundColor:
                    strength === 4
                      ? '#34d399'
                      : strength === 3
                        ? '#F9CB15'
                        : '#EE4444',
                }}
              />
              <span className="text-xs text-zinc-500">
                Segurança da senha:{' '}
                {strength === 4
                  ? 'forte'
                  : strength === 3
                    ? 'razoável'
                    : 'fraca'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmNewPassword" className="text-xs">
                Confirmar nova senha
              </label>
              <Input
                type="password"
                className="h-10"
                {...register('confirmNewPassword')}
              />
              {errors && errors.confirmNewPassword && (
                <span className="text-xs text-primary">
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter className="p-4 border-t">
            <Button
              onClick={handleSubmit(handleSavePassword)}
              loading={isSubmitting}
            >
              Alterar Senha
            </Button>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
