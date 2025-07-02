'use client'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Image from 'next/image'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(customParseFormat)

const schema = z.object({
  objective: z.string().min(1, { message: 'Obrigatório' }),
})

type RegisterData = z.infer<typeof schema>

export function EditObjetiveDialog({
  currentObjective,
  currentYear,
  onClose,
}: {
  currentObjective: string
  currentYear: number
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      objective: currentObjective,
    },
  })

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = form

  async function handleRegister(data: RegisterData) {
    try {
      await api.put(`/metas/update/${currentYear}`, {
        ano: currentYear,
        objetivos: {
          principal: data.objective,
        },
      })
      toast.success('Objetivo atualizado')
      reset({
        objective: undefined,
      })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      onClose()
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
        console.log(err)
      }
    }
  }

  return (
    <FormProvider {...form}>
      <DialogContent className="max-h-[85%] bg-zinc-900">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleRegister)}
        >
          <DialogHeader>
            <DialogTitle>Objetivo Principal</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 p-4 py-2">
            <Image
              height={33}
              width={46}
              alt="Quote"
              src={'/icons/quote.svg'}
              className="scale-75"
            />
            <Textarea {...register('objective')} rows={8} />
            {errors.objective && (
              <span className="text-red-400 text-xs">
                {errors.objective.message}
              </span>
            )}
          </div>
          <DialogFooter className="border-t p-4">
            <Button type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </FormProvider>
  )
}
