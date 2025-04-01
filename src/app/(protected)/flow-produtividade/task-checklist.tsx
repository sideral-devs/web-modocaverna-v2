'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export function TaskChecklist({ task }: { task: Task }) {
  const queryClient = useQueryClient()
  const [checklist, setChecklist] = useState(
    task.checklists && task.checklists.length > 0 ? task.checklists[0] : null,
  )
  const [editingId, setEditingId] = useState<number | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  async function createChecklist() {
    try {
      const created = {
        name: 'CHECKLIST',
        tarefa_id: Number(task.tarefa_id),
        subtasks: [],
      }
      setChecklist({ ...created, id: Math.random() * 1000 })
      const res = await api.post('/task-checklists/store', created)
      const data = res.data as { data: { id: number } }

      setChecklist({ ...created, id: data.data.id })
      return { ...created, id: data.data.id }
    } catch (err) {
      setChecklist(null)
      throw err
    }
  }

  async function createSubtask() {
    let tempChecklist = checklist
    if (!checklist) {
      try {
        const createdChecklist = await createChecklist()
        tempChecklist = createdChecklist
      } catch {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }

    if (!tempChecklist) return
    const rollback = tempChecklist

    try {
      const created = {
        checklist_id: tempChecklist.id,
        name: 'Sem título',
        checked: '0',
      }
      const randomId = Math.random() * 1000

      setChecklist({
        ...rollback,
        subtasks: [...rollback.subtasks, { ...created, id: randomId }],
      })
      const res = await api.post(`/task-subtasks/store`, created)
      const data = res.data as { data: { id: number } }

      setChecklist({
        ...tempChecklist,
        subtasks: [...rollback.subtasks, { ...created, id: data.data.id }],
      })

      queryClient.refetchQueries({ queryKey: ['tasks'] })
    } catch {
      setChecklist(rollback)
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleEdit({
    id,
    name,
    checked,
  }: {
    id: number
    name: string
    checked: boolean
  }) {
    if (!checklist) return
    const rollback = checklist
    try {
      setChecklist({
        ...checklist,
        subtasks: checklist.subtasks.map((st) =>
          st.id === id ? { ...st, name, checked: checked ? '1' : '0' } : st,
        ),
      })

      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        if (!name) return
        await api
          .put(`/task-subtasks/update/${id}`, {
            name,
            checked,
            checklist_id: checklist.id,
          })
          .catch(() => {
            toast.error('Algo deu errado. Tente novamente.')
            setChecklist(rollback)
          })

        queryClient.refetchQueries({ queryKey: ['tasks'] })
      }, 600)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setChecklist(rollback)
    }
  }

  async function handleDeleteSubtask(taskId: number) {
    if (!checklist) return
    const rollback = checklist
    try {
      setChecklist({
        ...checklist,
        subtasks: checklist.subtasks.filter((st) => st.id !== taskId),
      })

      await api.delete(`/task-subtasks/destroy/${taskId}`)

      queryClient.refetchQueries({ queryKey: ['tasks'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setChecklist(rollback)
    }
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex w-full items-center gap-3">
        <span className="text-xs text-zinc-400">
          {checklist && checklist.subtasks.length > 0
            ? (
                (checklist?.subtasks.filter(
                  (subtask) => !!Number(subtask.checked),
                ).length /
                  checklist.subtasks.length) *
                100
              ).toFixed(0)
            : 0}
          %
        </span>
        <div className="w-full h-1 bg-zinc-700">
          {checklist && checklist.subtasks.length > 0 && (
            <motion.div
              className="flex h-1 bg-primary"
              initial={{
                width: '0%',
              }}
              animate={{
                width:
                  (checklist?.subtasks.filter(
                    (subtask) => !!Number(subtask.checked),
                  ).length /
                    checklist.subtasks.length) *
                    100 +
                  '%',
                transition: {
                  duration: 0.5,
                },
              }}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col py-6 gap-4">
        {checklist &&
          checklist.subtasks.map((sub) => (
            <div
              key={sub.id}
              className="flex w-full items-center gap-3 text-sm text-zinc-400"
            >
              <Checkbox
                checked={!!Number(sub.checked)}
                onCheckedChange={(val) => {
                  const checked = val.valueOf() === true || false
                  handleEdit({ ...sub, checked })
                }}
              />
              <div className="flex w-full justify-between">
                {editingId === sub.id ? (
                  <input
                    autoFocus
                    className="py-1 bg-transparent outline-border outline-1 w-full"
                    value={sub.name}
                    maxLength={24}
                    onChange={(e) => {
                      handleEdit({
                        id: sub.id,
                        name: e.target.value,
                        checked: !!Number(sub.checked),
                      })
                    }}
                    onBlur={() => {
                      setEditingId(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      setEditingId(null)
                    }}
                  />
                ) : (
                  <>
                    <span
                      className={
                        Number(sub.checked) ? 'line-through p-1' : 'p-1'
                      }
                      onClick={() => setEditingId(sub.id)}
                    >
                      {sub.name}
                    </span>
                    <XIcon
                      size={14}
                      className="text-zinc-600 cursor-pointer"
                      onClick={() => handleDeleteSubtask(sub.id)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      <Button
        variant="secondary"
        className="w-fit px-6"
        onClick={createSubtask}
      >
        Adicionar um item
      </Button>
    </div>
  )
}
