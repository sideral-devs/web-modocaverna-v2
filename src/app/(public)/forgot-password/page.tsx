'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
})

type ForgotPasswordData = z.infer<typeof loginSchema>

export default function Page() {
  const router = useRouter()
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(loginSchema),
  })
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = form

  async function handleForgot(data: ForgotPasswordData) {
    try {
      await api.post('/auth/forgot-password', data)
      toast.success('E-mail para redefinição de senha enviado')
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response?.data &&
        err.response?.status === 404
      ) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

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
            <div className="flex flex-col gap-2">
              <h1 className="text-lg">Recupere sua senha</h1>
              <span className="text-muted-foreground text-sm">
                Digite seu e-mail de cadastro e lhe enviaremos um link de
                redefinição de senha.
              </span>
            </div>
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
            </div>

            <Button
              className="self-end"
              onClick={handleSubmit(handleForgot)}
              loading={isSubmitting}
            >
              Recuperar Conta
            </Button>
            <ChevronLeft
              className="absolute top-0 -left-4 -translate-x-[100%] cursor-pointer"
              onClick={() => router.replace('/login')}
            />
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
