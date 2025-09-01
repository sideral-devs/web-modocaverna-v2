'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useBoard } from '@/hooks/queries/use-board'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(customParseFormat)

const schema = z.object({
  title: z.string().min(1, { message: 'Obrigatório' }),
})

type RegisterData = z.infer<typeof schema>

export default function CreateColumnDialog() {
  const [open, setIsOpen] = useState(false);
  const { createTaskColumn } = useBoard()
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
    createTaskColumn.mutate({
      title: data.title
    }, {
      onError: () => {
        toast.success("Erro ao criar a lista! Por favor, tente novamente.")
      },
      onSuccess: () => {
        toast.success("Lista criada com sucesso!")
        setIsOpen(false)
        reset()
      }
    })

  }

  return (
    <FormProvider {...form}>
      <Dialog onOpenChange={setIsOpen} open={open}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-72'><Plus /> Nova lista</Button>
        </DialogTrigger>
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
              <DialogClose asChild><Button variant='secondary'>Cancelar</Button></DialogClose>
              <Button type="submit" loading={isSubmitting}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
