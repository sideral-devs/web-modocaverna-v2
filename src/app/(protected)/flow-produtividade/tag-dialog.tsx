'use client'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@radix-ui/react-dialog'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function TagDialog({
  task,
  taskId,
  tags,
  setTags,
  onUpdate,
  onClose,
}: {
  task: Task
  taskId: number
  tags: Tag[]
  setTags: (arg: Tag[]) => void
  onUpdate?: () => void
  onClose?: () => void
}) {
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view')
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(true)

  const { data: allTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await api.get('/task-tickets/find')
      return response.data as Tags[]
    },
  })

  useEffect(() => {
    if (allTickets && taskId) {
      const associatedTickets = allTickets
        .filter((ticket) => ticket.tarefas?.some((t) => t.tarefa_id === taskId))
        .map((ticket) => ticket.id)
      setSelectedTickets(associatedTickets)
    }
  }, [allTickets, taskId])

  const closeTagDialog = () => {
    if (onUpdate) {
      onUpdate()
    }
    queryClient.refetchQueries({ queryKey: ['tasks'] })
    setIsTagDialogOpen(false)
    onClose?.()
  }

  async function createTag(data: { name: string; color: string }) {
    const rollback = tags
    try {
      const res = await api.post('/task-tickets/store', {
        ...data,
        tarefa_id: taskId,
      })
      const returned = res.data as { id: number }
      const id = returned.id
      setTags([
        ...tags,
        {
          ...data,
          id,
        },
      ])
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    } catch (err) {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setTags(rollback)
      console.log(err)
      throw err
    }
  }
  async function saveTagList() {
    const rollback = tags
    try {
      await api.put(`/tarefas/update/${taskId}`, {
        position: task.position,
        card_id: task.card_id,
        prioridade: task.prioridade,
        item: task.item,
        descricao: task.descricao,
        tickets: selectedTickets,
        checked: false,
      })
      setTags(
        allTickets
          ?.filter((ticket) => selectedTickets.includes(ticket.id))
          .map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            color: ticket.color,
          })) || [],
      )
      setMode('view')
      toast.success('Etiquetas salvas com sucesso!')
      closeTagDialog()
      queryClient.invalidateQueries({ queryKey: ['tickets', 'tasks'] })
      queryClient.refetchQueries({ queryKey: ['tasks'] })
    } catch (err) {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setTags(rollback)
      console.log(err)
      throw err
    }
  }

  async function editTag(tag: Tag) {
    const rollback = tags
    try {
      await api.put(`/task-tickets/update/${tag.id}`, {
        ...tag,
        tarefa_id: taskId,
      })
      setTags(tags.map((t) => (t.id === tag.id ? tag : t)))
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    } catch {
      toast.error('Não foi possível fazer isso!')
      setTags(rollback)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    }
  }

  async function deleteTag(tag: Tag) {
    const rollback = tags
    const id = tag.id
    try {
      setTags(tags.filter((t) => t.id !== tag.id))
      await api.delete(`/task-tickets/destroy/${id}`)
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Etiqueta excluída com sucesso!')
    } catch {
      toast.error('Não foi possível excluir a etiqueta!')
      setTags(rollback)
    }
  }

  function handleGoBack() {
    setMode('view')
    setEditingTag(null)
  }

  if (!isTagDialogOpen) {
    return null
  }

  return (
    <>
      {mode === 'view' ? (
        <DialogContent className="max-w-[400px] h-fit max-h-1/2 bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Etiquetas</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col p-4 gap-6 overflow-y-auto">
            <span className="text-sm font-medium text-zinc-400">
              Etiquetas Disponíveis
            </span>
            <div className="flex flex-col w-full gap-3 overflow-y-scroll scrollbar-minimal rounded">
              {allTickets?.map((ticket) => {
                const isChecked = selectedTickets.includes(ticket.id)

                return (
                  <div
                    key={ticket.id}
                    className="flex w-full items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        // Se estava associado e agora está desmarcado, remove
                        if (isChecked) {
                          setSelectedTickets((prev) =>
                            prev.filter((id) => id !== ticket.id),
                          )
                        } else {
                          // Se não estiver marcado, adiciona o ID à lista
                          setSelectedTickets((prev) => [...prev, ticket.id])
                        }
                      }}
                      className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div
                      className="flex flex-1 h-9 items-center px-4 w-30 text-sm rounded"
                      style={{ backgroundColor: ticket.color }}
                    >
                      {ticket.name}
                    </div>
                    <PencilIcon
                      size={14}
                      className="text-zinc-400 cursor-pointer"
                      onClick={() => {
                        setMode('edit')
                        setEditingTag(ticket)
                      }}
                    />
                    <Trash2Icon
                      size={14}
                      className="text-zinc-400 cursor-pointer"
                      onClick={() => {
                        setDeletingTag(ticket)
                        setShowDeleteDialog(true)
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMode('create')}>
                <PlusIcon />
                Criar nova etiqueta
              </Button>
              <Button
                onClick={() => {
                  saveTagList()
                  onClose?.()
                }}
              >
                Salvar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      ) : mode === 'edit' && editingTag ? (
        <EditTag tag={editingTag} editTag={editTag} onBack={handleGoBack} />
      ) : (
        <CreateTag createTag={createTag} onBack={handleGoBack} />
      )}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[500px] bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-zinc-400">
              {`Tem certeza que deseja excluir a etiqueta " ${deletingTag?.name} " ?`}
            </p>
          </div>
          <DialogFooter className="gap-2 p-4">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deletingTag) {
                  deleteTag(deletingTag)
                  setShowDeleteDialog(false)
                }
              }}
              size="sm"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function EditTag({
  tag,
  editTag,
  onBack,
}: {
  tag: Tag
  editTag: (tag: Tag) => Promise<void>
  onBack: () => void
}) {
  const [selectedColor, setSelectedColor] = useState<string>(tag.color)
  const schema = z.object({
    title: z.string().min(1, { message: 'Obrigatório' }),
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: tag.name,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form

  async function handleEditTag(data: { title: string }) {
    try {
      await editTag({ ...tag, name: data.title, color: selectedColor })
      onBack()
    } catch {
      toast.error('Não foi possível editar essa tag')
    }
  }

  return (
    <DialogContent className="max-w-96 max-h-1/2 bg-zinc-900 gap-0 overflow-y-auto">
      <DialogHeader className="relative">
        <ChevronLeft
          onClick={onBack}
          className="absolute top-1/2 bottom-1/2 -translate-y-1/2 left-8 cursor-pointer"
        />
        <DialogTitle>Editar etiqueta</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="w-full px-12 py-8 bg-zinc-950">
          <div
            className="w-full h-9 rounded"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
        <div className="flex flex-1 flex-shrink-0 min-h-0 flex-col px-4 py-8 gap-3 overflow-y-auto">
          <label htmlFor="title" className="text-sm font-medium">
            Título
          </label>
          <div className="flex flex-col w-full gap-2">
            <Input
              placeholder="Insira o título"
              maxLength={64}
              {...register('title')}
            />
            {errors.title && (
              <span className="text-red-400 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>
          <span className="text-sm font-medium">Selecione a cor</span>
          <div className="grid grid-cols-5 gap-2">
            {colorObjects.map((color, index) => (
              <button
                key={color.color + index}
                className="w-full h-8 rounded"
                style={{ backgroundColor: color.color }}
                onClick={() => setSelectedColor(color.color)}
              />
            ))}
          </div>
        </div>
      </FormProvider>
      <DialogFooter className="border-t p-4">
        <Button onClick={handleSubmit(handleEditTag)} loading={isSubmitting}>
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
function CreateTag({
  onBack,
  createTag,
}: {
  onBack: () => void
  createTag: (tag: { name: string; color: string }) => Promise<void>
}) {
  const [selectedColor, setSelectedColor] = useState<string>(
    colorObjects[0].color,
  )
  const schema = z.object({
    title: z.string().min(1, { message: 'Obrigatório' }),
  })

  type RegisterData = z.infer<typeof schema>

  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form

  async function handleCreateTag(data: { title: string }) {
    try {
      await createTag({ name: data.title, color: selectedColor })
      onBack()
    } catch {
      toast.error('Não foi possível editar essa tag')
    }
  }

  return (
    <DialogContent className="max-w-96 max-h-1/2 bg-zinc-900 gap-0 overflow-y-auto">
      <DialogHeader className="relative">
        <ChevronLeft
          onClick={onBack}
          className="absolute top-1/2 bottom-1/2 -translate-y-1/2 left-8 cursor-pointer"
        />
        <DialogTitle>Criar etiqueta</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="w-full px-12 py-8 bg-zinc-950">
          <div
            className="w-full h-9 rounded"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
        <div className="flex flex-1 flex-shrink-0 min-h-0 flex-col px-4 py-8 gap-3 overflow-y-auto">
          <label htmlFor="title" className="text-sm font-medium">
            Título
          </label>
          <div className="flex flex-col w-full gap-2">
            <Input
              placeholder="Insira o título"
              maxLength={64}
              {...register('title')}
            />
            {errors.title && (
              <span className="text-red-400 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>
          <span className="text-sm font-medium">Selecione a cor</span>
          <div className="grid grid-cols-5 gap-2">
            {colorObjects.map((color, index) => (
              <button
                key={color.color + index}
                className="w-full h-8 rounded"
                style={{ backgroundColor: color.color }}
                onClick={() => setSelectedColor(color.color)}
              />
            ))}
          </div>
        </div>
      </FormProvider>
      <DialogFooter className="border-t p-4">
        <Button onClick={handleSubmit(handleCreateTag)} loading={isSubmitting}>
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

const colorObjects = [
  { color: '#0A3C26', textColor: '#FFFFFF' },
  { color: '#725001', textColor: '#FFFFFF' },
  { color: '#621E00', textColor: '#FFFFFF' },
  { color: '#4F100C', textColor: '#FFFFFF' },
  { color: '#261C55', textColor: '#FFFFFF' },
  { color: '#11603E', textColor: '#FFFFFF' },
  { color: '#725001', textColor: '#FFFFFF' },
  { color: '#9C3800', textColor: '#FFFFFF' },
  { color: '#A51F14', textColor: '#FFFFFF' },
  { color: '#4F3EA9', textColor: '#FFFFFF' },
  { color: '#3CC88C', textColor: '#000000' },
  { color: '#DEAA02', textColor: '#000000' },
  { color: '#FE9954', textColor: '#000000' },
  { color: '#F76459', textColor: '#000000' },
  { color: '#9484EE', textColor: '#000000' },
  { color: '#03225E', textColor: '#FFFFFF' },
  { color: '#112A35', textColor: '#FFFFFF' },
  { color: '#273810', textColor: '#FFFFFF' },
  { color: '#401530', textColor: '#FFFFFF' },
  { color: '#725001', textColor: '#FFFFFF' },
  { color: '#0046C6', textColor: '#FFFFFF' },
  { color: '#105B76', textColor: '#FFFFFF' },
  { color: '#26361B', textColor: '#FFFFFF' },
  { color: '#882D66', textColor: '#FFFFFF' },
  { color: '#725001', textColor: '#FFFFFF' },
]
