/* eslint-disable camelcase */
'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Modifier } from '@dnd-kit/core'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EllipsisIcon, GripHorizontal, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import { CreateColumnDialog } from './create-column-dialog'
import { EditTaskDialog } from './edit-task-dialog'

export const dynamic = 'force-dynamic'

interface TaskProps {
  task: Task
  deleteTask: (id: number) => Promise<void>
  updateTask: (task: Task) => Promise<void>
}

interface ColumnContainerProps {
  column: TaskList
  tasks: Task[]
  deleteColumn: (id: number) => void
  updateColumn: (id: number, data: { title: string; position: number }) => void
  createTask: (card_id: number) => void
  deleteTask: (id: number) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  reorderTask: ({
    tarefa_id,
    position,
    card_id,
  }: {
    tarefa_id: number
    position: number
    card_id: number
  }) => Promise<void>
}

export function Board() {
  const queryClient = useQueryClient()
  const [activeColumn, setActiveColumn] = useState<TaskList | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
  )

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const debounceTaskRef = useRef<NodeJS.Timeout | null>(null)
  const [isColumnDragging, setIsColumnDragging] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  const preventMultiDrag: Modifier = ({ transform }) => {
    return transform
  }

  const { data: columnsFn } = useQuery({
    queryKey: ['task-lists'],
    queryFn: async () => {
      const response = await api.get('/task-cards/show')
      return response.data as TaskList[]
    },
  })

  const { mutateAsync: createColumnFn } = useMutation({
    mutationFn: async (data: { title: string }) => {
      const res = await api.post('/task-cards/store', {
        ...data,
        position: columnsFn?.length || 0,
      })
      return res.data?.data as { title: string; position: number; id: number }
    },
    onMutate: async (col) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })

      const tempId = crypto.randomUUID()
      const optimisticCol = { id: tempId, ...col }

      queryClient.setQueryData(['task-lists'], (data: Task[]) => {
        return [...data, { ...optimisticCol, tarefas: [] }]
      })

      return { tempId }
    },
    onSuccess: (saved, _, context) => {
      queryClient.setQueryData(['task-lists'], (old: TaskList[]) => {
        return old.map((col) =>
          col.id === context?.tempId ? { ...col, id: saved.id } : col,
        )
      })
    },
  })

  // const { mutateAsync: updateColumnFn } = useMutation({
  //   mutationFn: async (data: {
  //     id: number
  //     title: string
  //     position: number
  //   }) => {
  //     await api.put(`/task-cards/update/${data.id}`, {
  //       id: data.id,
  //       title: data.title,
  //       position: data.position + 1,
  //     })
  //   },
  //   onMutate: updateColumnState,
  // })
  const { mutateAsync: updateColumnFn } = useMutation({
    mutationFn: async (data: {
      id: number
      title: string
      position: number
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await api.put(`/task-cards/update/${data.id}`, {
        id: data.id,
        title: data.title,
        position: data.position + 1,
      })
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previousColumns = queryClient.getQueryData(['task-lists'])
      // Atualização otimista
      queryClient.setQueryData(['task-lists'], (old: TaskList[] = []) => {
        const newColumns = [...old]
        const movedColumn = newColumns.find((col) => col.id === newData.id)
        if (movedColumn) {
          // Remove da posição atual
          newColumns.splice(newColumns.indexOf(movedColumn), 1)
          // Insere na nova posição
          newColumns.splice(newData.position, 0, {
            ...movedColumn,
            position: newData.position,
          })
          // Atualiza posições de todas as colunas
          return newColumns.map((col, index) => ({
            ...col,
            position: index,
          }))
        }
        return newColumns
      })

      return { previousColumns }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] })
      toast.error('Falha ao mover a coluna')
    },
    onSettled: () => {
      setIsColumnDragging(false)
      queryClient.invalidateQueries({ queryKey: ['task-lists'] })
    },
  })

  const { mutateAsync: deleteColumnFn } = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/task-cards/destroy/${id}`)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })

      queryClient.setQueryData(['task-lists'], (data: TaskList[]) => {
        return data.filter((col) => col.id !== id)
      })

      queryClient.setQueryData(['tasks'], (data: Task[]) => {
        return data.filter((task) => task.card_id !== id)
      })

      return { id }
    },
  })

  const { data: tasksFn } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/tarefas/find')
      return response.data as Task[]
    },
  })

  const { mutateAsync: createTaskFn } = useMutation({
    mutationFn: async (data: {
      item: string
      descricao: string | null
      index: number
      position: number
      card_id: number
      prioridade: Task['prioridade']
    }) => {
      const res = await api.post('/tarefas/store', {
        ...data,
        checked: true,
        position: data.position, // Garantir que a posição seja enviada
      })
      return res.data as Task
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Calcula a nova posição baseada nas tarefas existentes nesta coluna
      const currentTasks = queryClient.getQueryData<Task[]>(['tasks']) || []
      const tasksInColumn = currentTasks.filter(
        (task) => Number(task.card_id) === Number(newTask.card_id),
      )
      const newPosition = tasksInColumn.length

      const tempId = crypto.randomUUID()
      const optimisticTask = {
        ...newTask,
        tarefa_id: tempId,
        position: newPosition, // Usa a posição calculada
        checklists: [],
        task_tickets: [],
      }

      // Atualiza o cache com a nova tarefa
      queryClient.setQueryData(['tasks'], (old: Task[] = []) => [
        ...old,
        optimisticTask,
      ])

      return { tempId, cardId: newTask.card_id }
    },
    onSuccess: (savedTask, _, context) => {
      // Atualiza o cache substituindo a tarefa temporária pela real
      queryClient.setQueryData(['tasks'], (old: Task[] = []) =>
        old.map((task) =>
          task.tarefa_id === context?.tempId
            ? { ...task, ...savedTask } // Mantém todos os dados do backend
            : task,
        ),
      )

      // Força uma atualização adicional para garantir a sincronização
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (_, __, context) => {
      // Remove a tarefa otimista em caso de erro
      queryClient.setQueryData(['tasks'], (old: Task[] = []) =>
        old.filter((task) => task.tarefa_id !== context?.tempId),
      )
      toast.error('Falha ao criar a tarefa')
    },
  })
  const { mutateAsync: reorderTaskFn } = useMutation({
    mutationFn: async (data: {
      tarefa_id: number
      position: number
      card_id: number
    }) => {
      await api.patch(`/tarefas/reorder/${data.tarefa_id}`, {
        position: data.position,
        taskcard_id: data.card_id,
      })
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      // Atualização otimista
      queryClient.setQueryData(['tasks'], (old: Task[] = []) =>
        old.map((task) =>
          task.tarefa_id === newOrder.tarefa_id
            ? {
                ...task,
                position: newOrder.position,
                card_id: newOrder.card_id,
              }
            : task,
        ),
      )
    },
    onError: () => {
      toast.error('Falha ao reordenar tarefa')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
  const { mutateAsync: updateTaskFn } = useMutation({
    mutationFn: async (data: Task) => {
      await api.put(`/tarefas/update/${data.tarefa_id}`, {
        ...data,
        checked: false,
      })
      queryClient.refetchQueries({ queryKey: ['tasks'] })
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      const optimisticData = { ...data }

      queryClient.setQueryData(['tasks'], (data: Task[]) => {
        return data.map((task) =>
          task.tarefa_id === optimisticData.tarefa_id
            ? {
                ...task,
                item: optimisticData.item,
                descricao: optimisticData.descricao,
              }
            : task,
        )
      })

      return { id: optimisticData.tarefa_id }
    },
  })

  const { mutateAsync: deleteTaskFn } = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tarefas/destroy/${id}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const orderedCols = useMemo(() => {
    const ordered =
      columnsFn?.sort((a, b) => Number(a.position) - Number(b.position)) || []
    return ordered
  }, [columnsFn])

  function updateColumnState(data: {
    id: number
    title: string
    position: number
  }) {
    queryClient.cancelQueries({ queryKey: ['task-lists'] })

    const optimisticData = { ...data }

    queryClient.setQueryData(['task-lists'], (data: TaskList[]) => {
      return data.map((col) =>
        col.id === optimisticData.id
          ? {
              ...col,
              title: optimisticData.title,
              position: optimisticData.position,
            }
          : col,
      )
    })

    return { id: optimisticData.id }
  }

  async function handleDeleteColumn(id: number) {
    try {
      await deleteColumnFn(id)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleUpdateColumn(
    id: number,
    data: { title: string; position: number },
  ) {
    try {
      const updated = {
        id,
        title: data.title,
        position: Number(data.position),
      }
      updateColumnState(updated)

      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        if (!data.title) return
        await updateColumnFn(updated)
      }, 1000)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }
  async function handleCreateTask(cardId: number) {
    if (!columnsFn || !tasksFn) return

    try {
      const columnIndex = columnsFn.findIndex(
        (col) => Number(col.id) === Number(cardId),
      )
      if (columnIndex === -1) return

      await createTaskFn({
        card_id: cardId,
        item: `Nova Tarefa`,
        prioridade: 'Prioridade Média',
        descricao: null,
        index: 0,
        position: 0,
      })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }
  useEffect(() => {}, [tasksFn])

  async function deleteTask(id: number) {
    await deleteTaskFn(id)
  }

  async function updateTask(task: Task) {
    if (debounceTaskRef.current) clearTimeout(debounceTaskRef.current)
    debounceTaskRef.current = setTimeout(async () => {
      await updateTaskFn({
        ...task,
      })
    }, 1000)
  }

  // function onDragStart(event: DragStartEvent) {
  //   if (event.active.data.current?.type === 'Column') {
  //     setActiveColumn(event.active.data.current.column)
  //     return
  //   }
  //   if (event.active.data.current?.type === 'Task') {
  //     setActiveTask(event.active.data.current.task)
  //   }
  // }
  function onDragEnd(event: DragEndEvent) {
    if (!columnsFn || !tasksFn) return
    setActiveColumn(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    // Lógica para colunas
    if (
      active.data.current?.type === 'Column' &&
      over.data.current?.type === 'Column'
    ) {
      const activeId = active.id
      const overId = over.id

      if (activeId === overId) {
        setActiveColumn(null)
        return
      }

      const activeIndex = columnsFn.findIndex((col) => col.id === activeId)
      const overIndex = columnsFn.findIndex((col) => col.id === overId)

      if (activeIndex === -1 || overIndex === -1) return

      // Chamada única para API
      updateColumnFn({
        id: Number(activeId),
        title: columnsFn[activeIndex].title,
        position: overIndex,
      })

      setActiveColumn(null)
      return
    }

    // Lógica para tarefas
    if (active.data.current?.type === 'Task') {
      const activeTask = tasksFn.find((t) => t.tarefa_id === active.id)
      if (!activeTask) return

      let newCardId = activeTask.card_id
      let newPosition = activeTask.position

      if (over.data.current?.type === 'Task') {
        const overTask = tasksFn.find((t) => t.tarefa_id === over.id)
        if (overTask) {
          newCardId = overTask.card_id
          newPosition = overTask.position
        }
      } else if (over.data.current?.type === 'Column') {
        newCardId = Number(over.id)
        newPosition = tasksFn.filter((t) => t.card_id === newCardId).length
      }

      // Atualização otimista consistente
      const newTasks = tasksFn.map((task) =>
        task.tarefa_id === active.id
          ? { ...task, card_id: newCardId, position: newPosition }
          : task,
      )

      queryClient.setQueryData(['tasks'], newTasks)
      reorderTaskFn({
        tarefa_id: Number(active.id),
        position: Number(newPosition),
        card_id: Number(newCardId),
      })
    }
  }

  if (!columnsFn || !tasksFn) {
    return <Skeleton className="w-full h-2" />
  }

  return (
    <div className="flex w-full overflow-x-auto overflow-y-hidden scrollbar-minimal">
      <DndContext
        sensors={sensors}
        onDragStart={(event) => {
          if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
            setIsColumnDragging(true)
          }
          if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task)
            setIsReordering(true)
          }
        }}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setIsColumnDragging(false)
          setIsReordering(false)
          setActiveColumn(null)
          setActiveTask(null)
        }}
        modifiers={
          isReordering || isColumnDragging ? [preventMultiDrag] : undefined
        }
      >
        <div className="flex gap-4">
          <SortableContext items={orderedCols.map((col) => String(col.id))}>
            {orderedCols.map((col) => {
              // Filtrar e ordenar tarefas para esta coluna
              const columnTasks = tasksFn
                .filter((task) => String(task.card_id) === String(col.id))
                .sort((a, b) => Number(a.position) - Number(b.position)) // Ordenar por position ao invés de index

              return (
                <ColumnContainer
                  key={`column-${col.id}`} // Key mais explícita
                  column={col}
                  deleteColumn={handleDeleteColumn}
                  updateColumn={handleUpdateColumn}
                  createTask={handleCreateTask}
                  tasks={columnTasks}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  reorderTask={reorderTaskFn}
                />
              )
            })}
          </SortableContext>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-72 h-14 justify-start bg-zinc-800 rounded-2xl focus-visible:ring-0 focus:ring-0">
                <PlusIcon />
                Nova lista
              </Button>
            </DialogTrigger>
            {/* @ts-expect-error Valid type */}
            <CreateColumnDialog createColumn={createColumnFn} />
          </Dialog>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={handleDeleteColumn}
                updateColumn={handleUpdateColumn}
                createTask={handleCreateTask}
                tasks={tasksFn.filter(
                  (task) => String(task.card_id) === String(activeColumn.id),
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
                reorderTask={reorderTaskFn}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                reorderTask={reorderTaskFn}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  )
}

interface TaskProps {
  task: Task
  updateTask: (task: Task) => Promise<void>
  deleteTask: (taskId: number) => Promise<void>
  reorderTask: ({
    tarefa_id,
    position,
    card_id,
  }: {
    tarefa_id: number
    position: number
    card_id: number
  }) => Promise<void>
}

function TaskCard({ task, updateTask, deleteTask, reorderTask }: TaskProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.tarefa_id,
    data: { type: 'Task', task },
  })
  const [isOpen, setIsOpen] = useState(false)
  const [selectPriorityOpen, setSelectPriorityOpen] = useState(false)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  async function handleUpdateTask(updatedTask: Task) {
    if (
      updatedTask.position !== undefined ||
      updatedTask.card_id !== undefined
    ) {
      // Se envolve position/card_id, usa reorder
      await reorderTask({
        tarefa_id: Number(updatedTask.tarefa_id),
        position: Number(updatedTask.position) || 0,
        card_id: Number(updatedTask.card_id) || Number(task.card_id),
      })
    } else {
      // Caso contrário, usa update normal
      await updateTask(updatedTask)
    }
  }

  async function handleDeleteTask() {
    try {
      await deleteTask(Number(task.tarefa_id))
    } catch {
      toast.error('Não foi possível fazer isso')
    }
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 p-2.5 h-[4.5rem] min-h-[4.5rem] items-center flex flex-left rounded-xl border-2 border-primary cursor-grab relative"
      />
    )
  }

  return (
    <>
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className="flex flex-col p-3 gap-3 bg-zinc-700 rounded-xl cursor-pointer"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <div className="flex w-full items-center justify-between">
          <Popover
            open={selectPriorityOpen}
            onOpenChange={setSelectPriorityOpen}
          >
            <span
              className={cn(
                'flex w-fit px-2 py-1 rounded uppercase text-[0.5rem] cursor-pointer',
                task.prioridade === 'Prioridade Alta'
                  ? `text-white-400 bg-red-900`
                  : task.prioridade === 'Prioridade Média'
                    ? 'text-white-400 bg-yellow-700'
                    : 'text-white-400 bg-green-700',
              )}
              onClick={(e) => {
                e.stopPropagation()
                setSelectPriorityOpen(true)
              }}
            >
              {task.prioridade}
            </span>

            <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
              {['Prioridade Alta', 'Prioridade Média', 'Prioridade Baixa'].map(
                (item, _i) => (
                  <button
                    key={_i}
                    className="w-full px-2 py-1 rounded hover:bg-zinc-700"
                    onClick={() =>
                      handleUpdateTask({
                        ...task,
                        prioridade: item as Task['prioridade'],
                      })
                    }
                  >
                    <span
                      className={cn(
                        'flex w-fit px-1 py-[2px] text-[10px] rounded',
                        item === 'Prioridade Alta'
                          ? `text-red-200 bg-red-900`
                          : item === 'Prioridade Média'
                            ? 'text-yellow-400 bg-yellow-700'
                            : 'text-zinc-600 bg-zinc-200',
                      )}
                    >
                      {item}
                    </span>
                  </button>
                ),
              )}
            </PopoverContent>
          </Popover>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <GripHorizontal className="text-zinc-500 hover:text-zinc-400" />
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
              <button
                className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmDeleteDialogOpen(true)
                }}
              >
                Excluir
              </button>
            </ContextMenuContent>
          </ContextMenu>
        </div>
        <p className="w-full whitespace-pre-wrap text-sm line-clamp-2">
          {task.item}
        </p>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <EditTaskDialog
          task={task}
          updateTask={updateTask}
          setIsOpen={setIsOpen}
        />
      </Dialog>
      <AlertDialog
        open={confirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
      >
        <AlertDialogContent className="p-0">
          <div className="flex flex-col w-[80%] p-7 gap-6">
            <div className="flex flex-col gap-3">
              <AlertDialogTitle className="text-lg">
                Tem certeza que deseja excluir essa tarefa?
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogFooter className="p-4 border-t">
            <AlertDialogCancel asChild>
              <Button variant="ghost">Cancelar</Button>
            </AlertDialogCancel>
            <Button onClick={handleDeleteTask}>Excluir</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
  reorderTask,
}: ColumnContainerProps) {
  const [editMode, setEditMode] = useState(false)
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.tarefa_id)
  }, [tasks])
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: 'Column', column },
      disabled: editMode,
    })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col w-72 h-fit max-h-[38rem] p-1 border rounded-2xl"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-2 text-xs text-zinc-400"
      >
        <span className="truncate">{!editMode && column.title}</span>
        {editMode && (
          <input
            autoFocus
            className="bg-black rounded outline-none w-full"
            value={column.title}
            maxLength={24}
            onChange={(e) =>
              updateColumn(Number(column.id), {
                ...column,
                title: e.target.value,
              })
            }
            onBlur={() => {
              setEditMode(false)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              setEditMode(false)
            }}
          />
        )}
        <Popover>
          <PopoverTrigger asChild>
            <EllipsisIcon />
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
            <button
              onClick={() => setEditMode(true)}
              className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
            >
              Renomear
            </button>
            <button
              onClick={() => deleteColumn(Number(column.id))}
              className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
            >
              Apagar
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto scrollbar-minimal">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.tarefa_id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              reorderTask={reorderTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => {
          createTask(Number(column.id))
        }}
        className="flex items-center p-2 gap-2 text-sm text-primary"
      >
        <PlusIcon />
        Adicionar um card
      </button>
    </div>
  )
}
