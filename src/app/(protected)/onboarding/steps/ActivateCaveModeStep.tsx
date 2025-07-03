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
    <div className="flex flex-col items-center justify-center gap-12">
      <h1 className="font-bold text-center text-2xl lg:text-3xl">
        Qual o seu principal objetivo com o{' '}
        <span className="text-primary">Modo Caverna?</span>
      </h1>
      <p className="text-center opacity-80">
        Agora que você encarou o espelho, reflita sobre o que quer conquistar
        nos próximos 40 dias.
      </p>

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
          className="uppercase"
          disabled={(form.watch('goal') || '').length < 10}
        >
          🎯 Definir objetivo
        </Button>
      </form>
    </div>
  )
}
