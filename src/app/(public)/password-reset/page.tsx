'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório ' })
    .regex(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Por favor, insira um e-mail válido',
    ),
  password: z
    .string({ required_error: 'Por favor, insira uma senha ' })
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  confirmPassword: z.string({
    required_error: 'Por favor, confirme sua senha',
  }),
})

type ForgotPasswordData = z.infer<typeof loginSchema>

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  )
}

function Content() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [firstRuleValid, setFirstRuleValid] = useState(false)
  const [secondRuleValid, setSecondRuleValid] = useState(false)
  const [thirdRuleValid, setThirdRuleValid] = useState(false)

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email || '',
    },
  })
  const {
    handleSubmit,
    register,
    setError,
    watch,
    formState: { isSubmitting, errors },
  } = form

  const password = watch('password')

  async function handleResetPassword(data: ForgotPasswordData) {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', { message: 'As senhas não coincidem' })
        return
      }

      await api.post('/auth/password-reset', {
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        token,
      })
      toast.success('Senha redefinida com sucesso!')
      router.replace('/login')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

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

  return (
    <div className="flex flex-col w-full h-full min-h-screen overflow-hidden items-center p-4">
      <div className="flex flex-col w-full flex-1 max-w-[590px] items-center py-16 gap-7">
        <Image
          src={'/images/logo-icon.svg'}
          alt="Logo"
          width={32}
          height={27}
        />
        <div className="flex flex-col w-full max-w-sm gap-10 relative">
          <FormProvider {...form}>
            <h1 className="text-lg mt-12">Crie sua nova senha</h1>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu e-mail"
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-red-300 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password')}
                />
                {errors.password && (
                  <span className="text-red-300 text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full gap-3">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirme sua senha
                </label>
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <span className="text-red-300 text-xs">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-muted-foreground text-xs">
                  Sua senha deve conter ao menos
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Checkbox
                    className="bg-zinc-500 scale-75"
                    checked={firstRuleValid}
                  />
                  1 letra maiúscula
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Checkbox
                    className="bg-zinc-500 scale-75"
                    checked={secondRuleValid}
                  />
                  1 número e caractere especial (exemplo: # ? ! & )
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Checkbox
                    className="bg-zinc-500 scale-75"
                    checked={thirdRuleValid}
                  />
                  Mínimo 8 caracteres
                </span>
              </div>
            </div>
            <div className="self-end mt-12">
              <Button
                onClick={handleSubmit(handleResetPassword)}
                loading={isSubmitting}
              >
                Salvar nova senha
              </Button>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
