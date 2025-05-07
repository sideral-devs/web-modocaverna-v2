'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/api'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { EllipsisIcon, XIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

function SortableSubtask({
  sub,
  editingId,
  setEditingId,
  updateChecklist,
  handleEditText,
  handleDeleteSubtask,
}: {
  sub: Checklist['subtasks'][number]
  editingId: number | null
  setEditingId: (id: number | null) => void
  updateChecklist: ({
    id,
    name,
    checked,
  }: Checklist['subtasks'][number]) => void
  handleEditText: (data: { id: number; name: string; checked: boolean }) => void
  handleDeleteSubtask: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sub.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      className="flex w-full items-center gap-3 text-sm text-zinc-400"
      style={style}
    >
      <EllipsisIcon {...attributes} {...listeners} />
      <Checkbox
        checked={!!Number(sub.checked)}
        onCheckedChange={(val) => {
          const checked = val.valueOf() === true || false
          updateChecklist({ ...sub, checked })
        }}
      />
      <div className="flex w-full justify-between">
        {editingId === sub.id ? (
          <input
            autoFocus
            className="py-1 bg-transparent outline-border outline-1 w-full"
            value={sub.name}
            onChange={(e) => {
              handleEditText({
                id: sub.id,
                name: e.target.value,
                checked: !!Number(sub.checked),
              })
            }}
            onBlur={() => {
              updateChecklist(sub)
              setEditingId(null)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              updateChecklist(sub)
              setEditingId(null)
            }}
          />
        ) : (
          <>
            <span
              className={Number(sub.checked) ? 'line-through p-1' : 'p-1'}
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
  )
}

export function TaskChecklist({ task }: { task: Task }) {
  const queryClient = useQueryClient()
  const [checklist, setChecklist] = useState(
    task.checklists && task.checklists.length > 0 ? task.checklists[0] : null,
  )
  const [editingId, setEditingId] = useState<number | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const [subtasksOrder, setSubtasksOrder] = useState(
    checklist?.subtasks
      .sort((a, b) => a.position - b.position)
      .map((sub) => sub.id) ?? [],
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setSubtasksOrder((items) => {
        const oldIndex = items.indexOf(active.id as number)
        const newIndex = items.indexOf(over?.id as number)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        const reordered = newOrder.map((id) =>
          checklist?.subtasks.find((s) => s.id === id),
        )

        api
          .put(
            '/task-subtasks/reorder',
            reordered.map((i, idx) => ({ ...i, position: idx })),
          )
          .then(() => {
            queryClient.refetchQueries({ queryKey: ['tasks'] })
          })
          .catch(() => {
            const lastOrder = arrayMove(items, newIndex, oldIndex)
            setSubtasksOrder(lastOrder)
          })

        return newOrder
      })
    }
  }

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
        checked: false,
        position: tempChecklist.subtasks.length,
      }
      const randomId = Math.random() * 1000

      setChecklist({
        ...rollback,
        subtasks: [...rollback.subtasks, { ...created, id: randomId }],
      })
      setSubtasksOrder((order) => [...order, randomId])
      const res = await api.post(`/task-subtasks/store`, created)
      const data = res.data as { data: { id: number } }

      setChecklist({
        ...tempChecklist,
        subtasks: [...rollback.subtasks, { ...created, id: data.data.id }],
      })

      setSubtasksOrder((order) => [
        ...order.filter((id) => id !== randomId),
        data.data.id,
      ])

      queryClient.refetchQueries({ queryKey: ['tasks'] })
    } catch {
      setChecklist(rollback)
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  function handleEditText({
    id,
    name,
    checked,
  }: {
    id: number
    name: string
    checked: boolean
  }) {
    if (!checklist) return

    setChecklist({
      ...checklist,
      subtasks: checklist.subtasks.map((st) =>
        st.id === id ? { ...st, name, checked } : st,
      ),
    })
  }

  async function updateChecklist({
    id,
    name,
    checked,
    position,
  }: Checklist['subtasks'][number]) {
    if (!checklist) return
    const rollback = checklist

    try {
      setChecklist({
        ...checklist,
        subtasks: checklist.subtasks.map((st) =>
          st.id === id
            ? {
                id,
                position,
                name: name || 'Sem título',
                checked,
              }
            : st,
        ),
      })

      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        await api
          .put(`/task-subtasks/update/${id}`, {
            name: name || 'Sem título',
            checked,
            checklist_id: checklist.id,
            position,
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
      setSubtasksOrder((order) => order.filter((id) => id !== taskId))

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
        {checklist && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={subtasksOrder}
              strategy={verticalListSortingStrategy}
            >
              {subtasksOrder.map((id) => {
                const sub = checklist.subtasks.find((s) => s.id === id)
                if (!sub) return null
                return (
                  <SortableSubtask
                    key={sub.id}
                    sub={sub}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    updateChecklist={updateChecklist}
                    handleEditText={handleEditText}
                    handleDeleteSubtask={handleDeleteSubtask}
                  />
                )
              })}
            </SortableContext>
          </DndContext>
        )}
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
