import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
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

  async function onSubmit(data: FormData) {
    try {
      const year = dayjs().year()
      await api.put(`/metas/update/${year}`, {
        ano: year,
        objetivos: {
          principal: data.goal,
        },
      })
      onNext()
    } catch {
      toast.error('Não foi possível salvar sua meta')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="font-bold text-center text-2xl lg:text-3xl">
        Qual o seu principal objetivo na{' '}
        <span className="text-primary">Caverna?</span>
      </h1>
      <div className="flex flex-col gap-4">
        <p className="text-center opacity-80 max-w-md">
          Agora que você encarou o espelho, reflita sobre o que quer conquistar
          nos próximos 40 dias.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full items-center gap-8"
      >
        <Controller
          control={form.control}
          name="goal"
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Ex: Me tornar mais produtivo e focado"
              className="w-full max-w-[440px]"
            />
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="uppercase"
          disabled={(form.watch('goal') || '').length < 10}
          loading={form.formState.isLoading}
        >
          🎯 Definir objetivo
        </Button>
      </form>
    </div>
  )
}
