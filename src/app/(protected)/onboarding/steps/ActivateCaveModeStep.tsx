import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  goal: z.string().min(10, 'A meta deve ter no mínimo 10 caracteres'),
})

type FormData = z.infer<typeof schema>

export function ActivateCaveModeStep({ onNext }: { onNext: () => void }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      goal: '',
    },
  })

  function onSubmit(data: FormData) {
    console.log(data)
    onNext()
  }

  return (
    <div className="flex w-full flex-col flex-1 relative items-center p-4 3xl:pb-16 gap-10">
      <div className="flex w-full max-w-[611px] flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Defina Sua Meta Principal</h1>
        <p className="text-center opacity-80">
          Agora que você conhece seu perfil, defina o principal objetivo que
          quer conquistar nos próximos 40 dias.
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-8"
      >
        <Controller
          control={form.control}
          name="goal"
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Ex: Perder 10kg e ganhar massa muscular"
              className="w-[400px]"
            />
          )}
        />
        <Button
          type="submit"
          size="lg"
          disabled={(form.watch('goal') || '').length < 10}
        >
          🎯 Definir meta
        </Button>
      </form>
    </div>
  )
}
