import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VideoPlayerMux } from '@/components/video-player-mux'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { muxVideos } from '@/lib/constants'
import { cellphoneMask, ddiMask, removeMask } from '@/lib/utils'
import { useOnboardingStore } from '@/store/onboarding'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  DDI: z
    .string({ required_error: 'Campo obrigatório' })
    .regex(/^\+[1-9]{1,3}$/, { message: 'Insira um DDI válido' }),
  cellphone: z.string({ required_error: 'Campo obrigatório' }),
})

type FormData = z.infer<typeof schema>

function formatCellphoneDDI(telefone: string) {
  const clean = telefone.replace(/\D/g, '')
  const sliced = clean.slice(0, 2)
  const ddi = sliced.length > 0 ? `+${sliced}` : undefined
  const number = clean.slice(2)
  return { ddi, number }
}

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [ended, setEnded] = useState(false)
  const { data: user } = useUser()
  const { setCellphone } = useOnboardingStore()

  const cellphone = user?.telefone || ''
  const { ddi, number } = formatCellphoneDDI(cellphone)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      DDI: ddi || '+55',
      cellphone: cellphoneMask(number),
    },
  })

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  async function handleSaveData(data: FormData) {
    const number = data.DDI + removeMask(data.cellphone)
    setCellphone(number)

    try {
      await api.post(`/evolution/check-whatsapp/${number}`)
    } catch (err) {
      console.log(err)
      // if (err instanceof AxiosError) {
      //   if (err?.status !== 500) {
      //     setError('cellphone', {
      //       message: 'Esse número de WhatsApp não existe',
      //     })
      //     return
      //   }
      // }
    }

    onNext()
  }

  return (
    <div className="flex flex-col items-center p-4 gap-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-2xl lg:text-3xl">
          Bem vindo ao <span className="text-primary">Modo Caverna</span>
        </h1>
        <p className="lg:text-lg opacity-80 text-center max-w-xl">
          Você está prestes a começar a jornada mais desafiadora e
          transformadora da sua vida.
        </p>
      </div>

      <div className="w-full rounded-xl overflow-hidden relative">
        <VideoPlayerMux id={muxVideos.welcome} onEnded={() => setEnded(true)} />
      </div>

      <FormProvider {...form}>
        <motion.div
          className="flex flex-col items-center p-6 gap-6 bg-background rounded-2xl border border-red-900 card-shadow-md"
          initial={{
            y: 50,
            opacity: 0,
          }}
          animate={{
            y: ended ? 0 : 50,
            opacity: ended ? 1 : 0,
          }}
        >
          <label htmlFor="cellphone">Informe seu WhatsApp</label>
          <div className="flex flex-col w-full gap-2">
            <div className="flex w-full gap-2">
              <Input
                className="w-16"
                placeholder="+55"
                maxLength={4}
                {...register('DDI')}
                onChange={(e) => {
                  const value = e.target?.value
                  const formatted = ddiMask(value)
                  setValue('DDI', formatted)
                }}
              />
              <Input
                className="w-full"
                placeholder="11 9999-9999"
                {...register('cellphone')}
                onChange={(e) => {
                  const value = e.target?.value
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
          <div className="flex w-full justify-center">
            <Button
              onClick={handleSubmit(handleSaveData)}
              loading={isSubmitting}
              size="lg"
              className="uppercase w-full"
            >
              Começar Jornada
            </Button>
          </div>
        </motion.div>
      </FormProvider>
    </div>
  )
}
