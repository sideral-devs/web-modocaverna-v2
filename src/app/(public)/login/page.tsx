'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
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
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  lembre_me: z.boolean().optional(),
})

type LoginData = z.infer<typeof loginSchema>

export default function Page() {
  const queryClient = useQueryClient()
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })
  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = form

  const { setToken, token } = useAuthStore()
  const { data: user, isLoading, isError, isFetched } = useUser()
  const router = useRouter()

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      timezone,
      ...data
    }: LoginData & { timezone: string }) => {
      const response = await api.post('/auth/login', {
        ...data,
        timezone,
      })
      return response.data as { token: string }
    },
    onSuccess: (data) => {
      setToken(data.token)
    },
  })

  function handleRememberChange(val: CheckedState) {
    const checked = val.valueOf() === true || false
    setValue('lembre_me', checked)
  }

  async function handleLogin(data: LoginData) {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      await mutateAsync({ timezone, ...data })
      await signOut({ redirect: false }).catch(() => { })
      // queryClient.invalidateQueries({ queryKey: ['user'] })

      // toast.success('Login realizado com sucesso.')

      queryClient.clear()

      router.replace('/dashboard')
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          toast.error(err.response.data.message)
        } else {
          toast.error(
            'Ocorreu um erro inesperado. Por favor, entre em contato com o suporte.',
          )
        }
      }
    }
  }

  if (user && !isLoading && !isError && token && isFetched) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex relative w-full h-full min-h-screen justify-center pt-40">
      <div className="w-[402px] p-[1px] pb-0 rounded-t-xl bg-gradient-to-b from-[#FF414161] to-[#D01D1D33] overflow-hidden">
        <FormProvider {...form}>
          <form
            className="flex flex-col w-full h-full items-center px-5 py-10 gap-12 bg-[#171719] rounded-t-xl"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Image
              width={117}
              height={31}
              alt="Logo"
              src={'/images/logo.svg'}
            />
            <div className="flex flex-col w-full gap-5">
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input
                    placeholder="Digite seu e-mail"
                    {...register('email')}
                  />
                  {errors.email && (
                    <span className="text-red-400 text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    {...register('password')}
                  />
                  {errors.password && (
                    <span className="text-red-400 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Checkbox onCheckedChange={handleRememberChange} />
                  Mantenha-me conectado
                </span>
                <Link href={'/forgot-password'}>
                  <span className="text-sm text-red-500 text-primary">
                    Esqueci a senha
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex flex-col w-full gap-6 items-center">
              <Button
                className="w-full"
                onClick={handleSubmit(handleLogin)}
                type="submit"
                loading={isSubmitting}
              >
                Acessar
              </Button>
              <span className="mt-auto text-sm items-baseline">
                O que é o Modo Caverna?{' '}
                <Link target='_blank' href="https://quiz.modocaverna.com/" className="text-primary ml-1 text-sm ">
                  Ver detalhes
                </Link>
              </span>


            </div>

            <Link className="mt-auto underline text-xs text-muted-foreground items-baseline mb-6" href={'/terms'}>
              Termos de uso & Políticas de Privacidade
            </Link>
          </form>
        </FormProvider>
      </div>
      <Image
        src={'/images/bg.webp'}
        alt="bg"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'top center',
          zIndex: -1,
          opacity: 0.5,
        }}
      />
    </div>
  )
}
