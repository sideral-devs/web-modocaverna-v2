
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export function useBoard() {
  const queryClient = useQueryClient()

  const getTasks = useQuery({
    queryKey: ['task-lists'],
    queryFn: async () => {
      const response = await api.get('/task-cards/all')
      return response.data as TaskList[]
    },
    refetchOnWindowFocus: false,
    staleTime: 10_000,
  })

  function setColumnsCache(next: TaskList[]) {
    queryClient.setQueryData<TaskList[]>(['task-lists'], next)
  }

  const createTaskColumn = useMutation({
    mutationFn: async (data: { title: string }) => {
      const res = await api.post('/task-cards/store', {
        ...data,
        position: getTasks.data?.length ?? 0,
      })
      return res.data?.data as TaskList
    },
    onSuccess: (newCol) => {
      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
        old ? [...old, newCol] : [newCol],
      )
    },
  })

  const updateTaskColumn = useMutation({
    mutationFn: async (data: { id: number; title: string; position: number }) => {
      const res = await api.put(`/task-cards/update/${data.id}`, data)
      return res.data as TaskList
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previous = queryClient.getQueryData<TaskList[]>(['task-lists'])
      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['task-lists'], ctx.previous)
      }
      toast.error('Falha ao atualizar coluna')
    },

    onSuccess: (serverCol) => {
      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
        old
          ? old.map((col) =>
            col.id === serverCol.id ? { ...col, ...serverCol } : col,
          )
          : old,
      )
    },
  })

  const deleteTaskColumn = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/task-cards/destroy/${id}`)
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previous = queryClient.getQueryData<TaskList[]>(['task-lists'])
      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
        old ? old.filter((col) => col.id !== id) : [],
      )
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['task-lists'], ctx.previous)
      toast.error('Falha ao apagar a coluna')
    },
  })

  const createTask = useMutation({
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
        position: data.position + 1,
      })
      return res.data as Task
    },

    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previous = queryClient.getQueryData<TaskList[]>(['task-lists'])

      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
        old
          ? old.map((col) =>
            col.id === newTask.card_id
              ? {
                ...col,
                tarefas: [
                  ...col.tarefas,
                  {
                    tarefa_id: crypto.randomUUID(),
                    ...newTask,
                    checked: true,
                  },
                ],
              }
              : col,
          )
          : old,
      )

      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['task-lists'], ctx.previous)
      toast.error('Falha ao criar a tarefa')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] })
    },
  })

  const reorderTask = useMutation({
    mutationFn: async (d: { tarefa_id: number; position: number; card_id: number }) => {
      await api.patch(`/tarefas/reorder/${d.tarefa_id}`, {
        position: d.position,
        taskcard_id: d.card_id,
      })
      return d
    },

    onMutate: async (d) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previous = queryClient.getQueryData<TaskList[]>(['task-lists'])

      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) => {
        if (!old) return old

        const next = old.map(col => ({ ...col, tarefas: [...col.tarefas] }))

        const fromCol = next.find(c => c.tarefas.some(t => Number(t.tarefa_id) === d.tarefa_id))
        const toCol = next.find(c => c.id === d.card_id) || fromCol
        if (!fromCol || !toCol) return old

        const idxFrom = fromCol.tarefas.findIndex(t => Number(t.tarefa_id) === d.tarefa_id)
        if (idxFrom === -1) return old

        const [moved] = fromCol.tarefas.splice(idxFrom, 1)
        moved.card_id = d.card_id

        const insertAt = Math.max(0, Math.min(d.position - 1, toCol.tarefas.length))
        toCol.tarefas.splice(insertAt, 0, moved)

        fromCol.tarefas = fromCol.tarefas.map((t, i) => ({ ...t, position: i + 1 }))
        toCol.tarefas = toCol.tarefas.map((t, i) => ({ ...t, position: i + 1 }))

        return next
      })

      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['task-lists'], ctx.previous)
      toast.error('Falha ao reordenar/mover tarefa')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] })
    },
  })


  const updateTask = useMutation({
    mutationFn: (t: Task) =>
      api.put(`/tarefas/update/${t.tarefa_id}`, {
        ...t,
        checked: false,
        ...(t.task_tickets?.length && { tickets: t.task_tickets.map((tk) => tk.id) }),
      }),

    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previous = queryClient.getQueryData<TaskList[]>(['task-lists'])

      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
        old
          ? old.map((col) =>
            col.id === updated.card_id
              ? {
                ...col,
                tarefas: col.tarefas.map((t) =>
                  t.tarefa_id === updated.tarefa_id ? { ...t, ...updated } : t,
                ),
              }
              : col,
          )
          : old,
      )

      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['task-lists'], ctx.previous)
      toast.error('Falha ao atualizar tarefa')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] })
    },
  })

  const deleteTask = useMutation({
    mutationFn: (id: number) => api.delete(`/tarefas/destroy/${id}`),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['task-lists'] })
      const previous = queryClient.getQueryData<TaskList[]>(['task-lists'])

      queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
        old
          ? old.map((col) => ({
            ...col,
            tarefas: col.tarefas.filter((t) => t.tarefa_id !== id),
          }))
          : old,
      )

      return { previous }
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['task-lists'], ctx.previous)
      toast.error('Falha ao apagar a tarefa')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] })
    },
  })

  function setTasksCache(cardId: number, next: Task[]) {
    queryClient.setQueryData<TaskList[]>(['task-lists'], (old) =>
      old
        ? old.map((col) =>
          col.id === cardId ? { ...col, tarefas: next } : col,
        )
        : old,
    )
  }

  function findTaskById(taskId: number) {
    const taskLists = queryClient.getQueryData<TaskList[]>(['task-lists'])
    if (!taskLists) return null

    for (const col of taskLists) {
      const task = col.tarefas.find((t) => Number(t.tarefa_id) === taskId)
      if (task) {
        return { task, column: col }
      }
    }

    return null
  }

  return {
    getTasks,
    setColumnsCache,
    createTaskColumn,
    updateTaskColumn,
    deleteTaskColumn,
    createTask,
    setTasksCache,
    findTaskById,
    reorderTask,
    updateTask,
    deleteTask,
  }
}
