'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TagDialog } from './tag-dialog'
import { TaskChecklist } from './task-checklist'

import TextareaUpperFirstWord from '@/components/ui/textareaUpperFirstWord'
import { useBoard } from '@/hooks/queries/use-board'

const schema = z.object({
  item: z.string().min(1, { message: 'Título é obrigatório' }),
  prioridade: z.enum(['Prioridade Baixa', 'Prioridade Média', 'Prioridade Alta']),
  descricao: z.string().nullable(),
})

type TaskData = z.infer<typeof schema>

interface EditTaskDialogProps {
  task: Task
}

export function EditTaskDialog({
  task,
  children,
}: React.PropsWithChildren<EditTaskDialogProps>) {
  const { updateTask, deleteTask } = useBoard()
  const [tags, setTags] = useState(task.task_tickets)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)

  const form = useForm<TaskData>({
    resolver: zodResolver(schema),
    defaultValues: {
      item: task.item,
      prioridade: task.prioridade,
      descricao: task.descricao,
    },
  })

  const {
    register,
    setValue,
    formState: { errors },
  } = form

  function handleDeleteTask(id: number) {
    deleteTask.mutate(id, {
      onSuccess: () => {
        toast.success('Tarefa excluída com sucesso!')
        setIsDeleteDialogOpen(false)
      },
      onError: () => {
        toast.error('Erro ao excluir tarefa. Tente novamente mais tarde.')
      },
    })
  }

  function handleRegister(data: TaskData) {
    updateTask.mutate(
      {
        ...task,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success('Atualizado com sucesso')
          setIsTagDialogOpen(false)
        },
        onError: () => {
          toast.error('Algo deu errado. Tente novamente.')
        },
      },
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80%] bg-zinc-900 overflow-y-auto scrollbar-minimal">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div className="flex flex-col px-4 py-2 gap-6 overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="item" className="text-sm font-medium">
                  Título
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input
                    placeholder="Insira o título"
                    maxLength={64}
                    {...register('item')}
                  />
                  {errors.item && (
                    <span className="text-red-400 text-xs">
                      {errors.item.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <label htmlFor="prioridade" className="text-sm font-medium">
                  Prioridade
                </label>
                <Select
                  onValueChange={(val) =>
                    setValue('prioridade', val as TaskData['prioridade'])
                  }
                  defaultValue={form.getValues().prioridade}
                >
                  <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800">
                    <SelectItem value="Prioridade Alta">Alta</SelectItem>
                    <SelectItem value="Prioridade Média">Média</SelectItem>
                    <SelectItem value="Prioridade Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                {errors.prioridade && (
                  <span className="text-red-400 text-xs">
                    {errors.prioridade.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full gap-3">
                <label htmlFor="tag" className="text-sm font-medium">
                  Etiqueta
                </label>
                <div className="flex flex-wrap h-auto items-center gap-2">
                  {tags?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-center px-5 py-2 h-auto gap-2 rounded-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      <span className="text-xs">{item.name}</span>
                    </div>
                  ))}
                  <Dialog
                    key={tags?.length}
                    open={isTagDialogOpen}
                    onOpenChange={setIsTagDialogOpen}
                  >
                    <PlusIcon
                      className="text-primary cursor-pointer"
                      onClick={() => setIsTagDialogOpen(true)}
                    />
                    <TagDialog
                      onClose={() => setIsTagDialogOpen(false)}
                      task={task}
                      tags={tags || []}
                      setTags={setTags}
                      taskId={Number(task.tarefa_id)}
                    />
                  </Dialog>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </label>
                <TextareaUpperFirstWord
                  rows={9}
                  placeholder="Insira a descrição"
                  {...register('descricao')}
                />
              </div>

              <div className="flex flex-col w-full gap-3">
                <label htmlFor="checklist" className="text-sm font-medium">
                  Checklist
                </label>
                <TaskChecklist task={task} />
              </div>
            </div>
          </div>
        </FormProvider>

        <DialogFooter className="flex relative p-4">
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant={'outline'}
          >
            Excluir
          </Button>
          <Button onClick={form.handleSubmit(handleRegister)}>Salvar</Button>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza disso?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação excluirá a Tarefa.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteTask(Number(task.tarefa_id))}
                >
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
