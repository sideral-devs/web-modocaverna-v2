'use client'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useCreateUserStore } from '@/store/create-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  password: z
    .string({ required_error: 'Por favor, insira uma senha ' })
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  confirmPassword: z.string({
    required_error: 'Por favor, confirme sua senha',
  }),
})

type PasswordData = z.infer<typeof schema>

export function PasswordStep({
  onNext,
  onPrev,
}: {
  onNext: () => void
  onPrev: () => void
}) {
  const { name, lastName, email, cellphone } = useCreateUserStore()
  const { setToken } = useAuthStore()

  const [firstRuleValid, setFirstRuleValid] = useState(false)
  const [secondRuleValid, setSecondRuleValid] = useState(false)
  const [thirdRuleValid, setThirdRuleValid] = useState(false)

  const form = useForm<PasswordData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = form

  const password = watch('password')

  async function handleSaveData(data: PasswordData) {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', { message: 'As senhas não coincidem' })
        return
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const res = await api.post('/webhooks/register', {
        status: 'authorized',
        email,
        name: name + ' ' + lastName,
        nickname: name + '' + lastName,
        password: data.password,
        password_confirmation: data.confirmPassword,
        telefone: cellphone,
        timezone,
      })

      const resData = res.data as { token: string }
      setToken(resData.token)

      onNext()
    } catch {
      toast.error('Não foi possível criar uma conta no momento!')
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
    <div className="flex flex-col w-full max-w-sm gap-10 relative">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">Passo 3 de 3</span>
        <span>Proteja sua conta</span>
      </div>
      <div className="flex flex-col gap-6">
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
          <label htmlFor="confirmPassword" className="text-sm font-medium">
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
      <div className="flex items-center self-end mt-16 gap-3">
        <Button className="w-24" onClick={onPrev} variant="outline">
          Voltar
        </Button>
        <AutoSubmitButton
          className="w-24"
          onClick={handleSubmit(handleSaveData)}
          disabled={!thirdRuleValid || !secondRuleValid || !firstRuleValid}
          loading={isSubmitting}
        >
          Avançar
        </AutoSubmitButton>
      </div>
      <ChevronLeft
        className="absolute top-0 -left-4 -translate-x-[100%] cursor-pointer"
        onClick={onPrev}
      />
    </div>
  )
}
