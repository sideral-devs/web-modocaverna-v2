import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VideoPlayer } from '@/components/video-player'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { videos } from '@/lib/constants'
import { cellphoneMask, ddiMask, removeMask } from '@/lib/utils'
import { useOnboardingStore } from '@/store/onboarding'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  DDI: z
    .string({ required_error: 'Campo obrigatório' })
    .regex(/^\+[1-9]{1,3}$/, { message: 'Insira um DDI válido' }),
  cellphone: z.string({ required_error: 'Campo obrigatório' }),
})

type FormData = z.infer<typeof schema>

function separarDdiENumero(telefone: string): { ddi: string; numero: string } {
  const limpo = telefone.replace(/\D/g, '') // remove tudo que não é número
  const ddi = `+${limpo.slice(0, 2)}`
  const numero = limpo.slice(2)
  return { ddi, numero }
}

export function CellphoneStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()
  const { setCellphone } = useOnboardingStore()
  const telefone = user?.telefone || ''
  const { ddi, numero } = separarDdiENumero(telefone)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      DDI: ddi,
      cellphone: cellphoneMask(numero),
    },
  })

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = form

  async function handleSaveData(data: FormData) {
    const telefone = data.DDI + removeMask(data.cellphone)
    setCellphone(telefone)
    let validateNumber = null
    try {
      const response = await api.post(`/evolution/check-whatsapp/${telefone}`)
      validateNumber = response.data
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status !== 500) {
          setError('cellphone', {
            message: 'Esse número de WhatsApp não existe',
          })
          return
        }
      } else {
        toast.error('Erro inesperado ao atualizar dados do usuário!')
      }
    }
    if (validateNumber && validateNumber.status !== 500) {
      const respEvolution = validateNumber as { numberExists: boolean }

      if (!respEvolution.numberExists) {
        setError('cellphone', {
          message: 'Esse número de WhatsApp não existe',
        })
        return
      }
    }

    onNext()
  }

  return (
    <div className="flex w-full flex-col flex-1 relative items-center p-4 3xl:pb-16 gap-10">
      <div className="flex w-full max-w-[611px] flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Conecte-se com o Capitão Caverna</h1>
        <p className="text-center opacity-80">
          Estabeleça uma conexão direta comigo via WhatsApp para receber
          orientações personalizadas.
        </p>
        <div className="flex flex-col relative w-full border border-zinc-700 rounded-lg">
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <VideoPlayer id={videos.caveRite} />
          </div>
        </div>
      </div>
      <FormProvider {...form}>
        <div className="flex flex-col w-full max-w-[251px] gap-3">
          <label htmlFor="cellphone" className="text-xs">
            Seu WhatsApp
          </label>
          <div className="flex flex-col w-full gap-2 mb-[3.2rem]">
            <div className="flex w-full gap-2">
              <Input
                className="w-16"
                placeholder="+55"
                maxLength={4}
                {...register('DDI')}
                onChange={(e) => {
                  const value = e.target.value
                  const formatted = ddiMask(value)
                  setValue('DDI', formatted)
                }}
              />
              <Input
                className="w-full"
                placeholder="11 9999-9999"
                {...register('cellphone')}
                onChange={(e) => {
                  const value = e.target.value
                  const formatted = cellphoneMask(value)
                  setValue('cellphone', formatted)
                }}
              />
            </div>
            {errors?.cellphone && (
              <span className="text-xs text-red-500">
                {errors.cellphone.message}
              </span>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit(handleSaveData)}
              loading={isSubmitting}
              size="lg"
            >
              Conectar com Capitão Caverna
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
