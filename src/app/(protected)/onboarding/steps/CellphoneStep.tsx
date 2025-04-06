import { Input } from '@/components/ui/input'
import { cellphoneMask, ddiMask, removeMask } from '@/lib/utils'
import { useOnboardingStore } from '@/store/onboarding'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import Image from 'next/image'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUser } from '@/hooks/queries/use-user'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'

const schema = z.object({
  DDI: z
    .string({ required_error: 'Campo obrigatório' })
    .regex(/^\+[1-9]{1,3}$/, { message: 'Insira um DDI válido' }),
  cellphone: z
    .string({ required_error: 'Campo obrigatório' })
    .regex(/^\([1-9]{2}\) (?:[2-8]|9[0-9])[0-9]{3}-[0-9]{4}$/, {
      message: 'Insira um número válido',
    })
    .transform((value) => value.replace(/^\+55/, '').trim()),
})

type FormData = z.infer<typeof schema>

export function CellphoneStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()
  const { setCellphone } = useOnboardingStore()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      DDI: '+55',
      cellphone: cellphoneMask(
        user?.telefone ? user.telefone.replace(/^\+55/, '').trim() : '',
      ),
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
    let validateNumber: any = null
    try {
      const response = await api.post(`/evolution/check-whatsapp/${telefone}`)
      validateNumber = response.data
    } catch (err: any) {
     
      if (err.response?.status !== 500) {
        throw err 
      }
    }
    if (validateNumber && validateNumber.status !== 500) {
      const respEvolution = validateNumber as { numberExists: boolean }
  
      if (!respEvolution.numberExists) {
        setError('cellphone', { message: 'Esse número de whatsapp não existe' })
        return
      }
    }
  

    onNext()
  }

  return (
    <div className="flex flex-col flex-1 relative items-center p-4 3xl:pb-16 gap-12">
      <div className="flex items-start gap-16">
        <Image
          src={'/images/lobo/apontando.webp'}
          alt="Capitão Caverna"
          className="absolute -top-2 -left-72"
          width={222}
          height={402}
        />
        <div className="flex flex-col relative w-[611px] px-12 py-8 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">
            Quer saber? Eu posso ser mais do que um simples guia.
          </h1>
          <p className="text-zinc-400 ">
            Sou uma inteligência artificial e fui treinado para ser o seu
            assistente pessoal no WhatsApp.
          </p>
          <p className="text-zinc-400">
            Vou te ajudar no gerenciamento da sua rotina. Te mostrando
            exatamente o que deve ser feito durante o seu dia.
          </p>
          <p className="text-zinc-400">
            <strong className="text-white">
              Para ativar essa função, preencha ou confirme o seu número no
              campo abaixo.
            </strong>{' '}
            Em seguida, clique no botão vermelho.
          </p>

          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px] top-[25%]"
          />
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
            <AutoSubmitButton
              onClick={handleSubmit(handleSaveData)}
              loading={isSubmitting}
              className="mt-auto"
            >
              Entendido Capitão!
            </AutoSubmitButton>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
