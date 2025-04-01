import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import InputUpperFirstWord from '@/components/ui/inputUpperFirstWord'
import { useCreateUserStore } from '@/store/create-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nome precisa ter no mínimo 2 caracteres' })
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/, {
      message: 'Não utilize caracteres especiais',
    }),
  lastName: z
    .string()
    .min(2, { message: 'Sobrenome precisa ter no mínimo 2 caracteres' })
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/, {
      message: 'Não utilize caracteres especiais',
    }),
})

type NameData = z.infer<typeof schema>

export function NameStep({ onNext }: { onNext: () => void }) {
  const { setNameStep, name, lastName } = useCreateUserStore()
  const form = useForm<NameData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name || '',
      lastName: lastName || '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  function handleSaveInfo(data: NameData) {
    setNameStep(data)
    onNext()
  }
  return (
    <div className="flex flex-col w-full max-w-sm gap-10">
      <FormProvider {...form}>
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-sm">Passo 1 de 3</span>
          <span>Seja bem vindo (a) à Caverna</span>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col w-full gap-3">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <InputUpperFirstWord
              type="text"
              placeholder="Digite seu nome"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-red-300 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full gap-3">
            <label htmlFor="lastName" className="text-sm font-medium">
              Sobrenome
            </label>
            <InputUpperFirstWord
              type="text"
              placeholder="Digite seu sobrenome"
              {...register('lastName')}
            />
            {errors.lastName && (
              <span className="text-red-300 text-xs">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>
        <AutoSubmitButton
          className="w-24 self-end"
          onClick={handleSubmit(handleSaveInfo)}
        >
          Avançar
        </AutoSubmitButton>
      </FormProvider>
    </div>
  )
}
