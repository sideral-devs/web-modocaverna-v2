'use client'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(customParseFormat)

const schema = z.object({
  title: z.string().min(1, { message: 'Obrigatório' }),
})

type RegisterData = z.infer<typeof schema>

export function CreateColumnDialog({
  createColumn,
}: {
  createColumn: ({ title }: { title: string }) => Promise<void>
}) {
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = form

  async function handleRegister(data: RegisterData) {
    try {
      await createColumn({ ...data })
      reset()
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
            <DialogTitle>Nova lista</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 p-4 py-2">
            <label htmlFor="title" className="text-zinc-400">
              Título
            </label>
            <Input {...register('title')} />
            {errors.title && (
              <span className="text-red-400 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>
          <DialogFooter className="border-t p-4">
            <DialogClose asChild>
              <Button type="submit" loading={isSubmitting}>
                Salvar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </FormProvider>
  )
}
