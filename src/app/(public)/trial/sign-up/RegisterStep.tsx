import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { cellphoneMask, ddiMask, removeMask } from '@/lib/utils'
import { useCreateUserStore } from '@/store/create-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  email: z
    .string({ required_error: 'Campo obrigatório ' })
    .regex(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Por favor, insira um e-mail válido',
    ),
  DDI: z
    .string({ required_error: 'Campo obrigatório' })
    .regex(/^\+[1-9]{1,3}$/, { message: 'Insira um DDI válido' }),
  cellphone: z
    .string({ required_error: 'Campo obrigatório ' })
    .regex(/^\([1-9]{2}\) (?:[2-8]|9[0-9])[0-9]{3}-[0-9]{4}$/, {
      message: 'Número inválido',
    }),
})

type RegisterData = z.infer<typeof schema>

export function RegisterStep({
  onNext,
  onPrev,
}: {
  onNext: () => void
  onPrev: () => void
}) {
  const { setEmailStep, email, cellphone } = useCreateUserStore()

  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: email || '',
      cellphone: cellphone || '',
      DDI: '+55',
    },
  })

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = form

  async function handleSaveData(data: RegisterData) {
    try {
      const telefone = data.DDI + removeMask(data.cellphone)
    
      const res = await api.post('/check-email', { email: data.email })
    
      let validateNumber: any = null
    
      try {
        const response = await api.post(`/evolution/check-whatsapp/${telefone}`)
        validateNumber = response.data
      } catch (err: any) {
       
        if (err.response?.status !== 500) {
          throw err 
        }
      }
    
      const registeredEmail = res.data as { resp: boolean }
      if (registeredEmail.resp === true) {
        setError('email', { message: 'Esse e-mail já está cadastrado' })
        return
      }
    
     
      if (validateNumber && validateNumber.status !== 500) {
        const respEvolution = validateNumber as { numberExists: boolean }
    
        if (!respEvolution.numberExists) {
          setError('cellphone', { message: 'Esse número de whatsapp não existe' })
          return
        }
      }
    
      
      setEmailStep({
        email: data.email,
        cellphone: telefone,
      })
      onNext()
    } catch {
      toast.error('Não foi possível fazer isso')
    }
    
  }

  return (
    <div className="flex flex-col w-full max-w-sm gap-10 relative">
      <FormProvider {...form}>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm">Passo 2 de 3</span>
          <span>Cadastro</span>
          <span className="text-muted-foreground text-xs">
            Informe seus dados abaixo. O e-mail será utilizado como login
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
          <div className="flex flex-col w-full gap-3">
            <label htmlFor="cellphone" className="text-sm font-medium">
              Seu WhatsApp
            </label>

            <div className="flex w-full border border-input bg-zinc-800 rounded-lg group focus-within:ring-1 focus-within:ring-ring">
              <Input
                className="w-16 bg-transparent border-0 focus-visible:ring-0 peer-autofill:text-black group"
                maxLength={4}
                {...register('DDI')}
                onChange={(e) => {
                  const value = e.target.value
                  const formatted = ddiMask(value)
                  setValue('DDI', formatted)
                }}
              />
              <Input
                className="px-0 bg-transparent border-0 focus-visible:ring-0 peer w-full autofill:bg-transparent"
                placeholder="11 9999-9999"
                {...register('cellphone')}
                onChange={(e) => {
                  const value = e.target.value
                  const formatted = cellphoneMask(value)
                  setValue('cellphone', formatted)
                }}
              />
            </div>
            {errors.cellphone && (
              <span className="text-red-300 text-xs">
                {errors.cellphone.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 self-end">
          <Button className="w-24" onClick={onPrev} variant="outline">
            Voltar
          </Button>
          <AutoSubmitButton
            className="w-24"
            onClick={handleSubmit(handleSaveData)}
            loading={isSubmitting}
          >
            Avançar
          </AutoSubmitButton>
        </div>
        <ChevronLeft
          className="absolute top-0 -left-4 -translate-x-[100%] cursor-pointer"
          onClick={onPrev}
        />
      </FormProvider>
    </div>
  )
}
