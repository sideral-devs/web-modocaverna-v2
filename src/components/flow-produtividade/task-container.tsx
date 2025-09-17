import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EllipsisIcon, GripHorizontal, PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS, Transform } from '@dnd-kit/utilities'
import TaskCard from './task-card'
import { useBoard } from '@/hooks/queries/use-board'
import DefaultLoading from '../ui/loading'
import { useDroppable } from '@dnd-kit/core'
import { DeleteColumnButton } from './task-delete-column'
import { RenameColumnInput } from './task-container-rename'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ColumnContainerProps {
  column: TaskList
  preview: { columnId: number; index: number } | null
  isDropTarget: boolean
}

export function ColumnContainer({ column, preview, isDropTarget }: ColumnContainerProps) {
  const [editMode, setEditMode] = useState(false)
  const { reorderTask, createTask } = useBoard()
  const columnId = Number(column.id)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `col-${column.id}`,
    disabled: editMode,
    data: { type: 'column', columnId },
  })

  const t: Transform | null = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(t),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const tasks = useMemo(
    () => [...column.tarefas].sort((a, b) => Number(a.position) - Number(b.position)),
    [column],
  )

  const placeholderIndex = useMemo(() => {
    if (!preview || preview.columnId !== columnId) return null
    return Math.max(0, Math.min(preview.index, tasks.length))
  }, [columnId, preview, tasks])

  const placeholderId = `task-placeholder-${columnId}`

  const taskIds = useMemo(() => {
    const ids = tasks.map((task) => `task-${task.tarefa_id}`)
    if (placeholderIndex === null) return ids
    const next = [...ids]
    next.splice(placeholderIndex, 0, placeholderId)
    return next
  }, [placeholderId, placeholderIndex, tasks])

  const tasksById = useMemo(() => {
    const map = new Map<string, Task>()
    tasks.forEach((task) => map.set(`task-${task.tarefa_id}`, task))
    return map
  }, [tasks])

  const { setNodeRef: setDropAreaRef } = useDroppable({ id: `col-${column.id}` })

  return (
    <>
      <DefaultLoading visible={reorderTask.isPending} />

      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col w-72 shrink-0 h-fit max-h-[38rem] p-1 border rounded-2xl bg-zinc-900"
      >
        <div className="flex items-center justify-between p-2 gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="truncate">{!editMode && column.title}</span>
            {editMode && (
              <RenameColumnInput
                id={columnId}
                initialValue={column.title}
                position={column.position}
                onFinish={() => setEditMode(false)}
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
                <DeleteColumnButton columnId={columnId} />
              </PopoverContent>
            </Popover>
          </div>

          <GripHorizontal
            className="text-zinc-500 hover:text-zinc-400 cursor-grab"
            {...attributes}
            {...listeners}
          />
        </div>

        <div
          ref={setDropAreaRef}
          className={cn(
            'flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto scrollbar-minimal',
            isDropTarget ? 'rounded-xl outline outline-1 outline-primary/40 bg-zinc-800/60' : '',
          )}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {taskIds.map((taskId) => {
              if (taskId === placeholderId && placeholderIndex !== null) {
                return (
                  <TaskPlaceholder
                    key={taskId}
                    columnId={columnId}
                    index={placeholderIndex}
                  />
                )
              }

              const task = tasksById.get(taskId)
              if (!task) return null

              return <TaskCard key={taskId} task={task} columnId={columnId} />
            })}
          </SortableContext>
        </div>

        <button
          onClick={() =>
            createTask.mutate({
              card_id: columnId,
              item: `Nova Tarefa`,
              prioridade: 'Prioridade Média',
              descricao: null,
              index: 0,
              position: 0,
            })
          }
          className="flex items-center p-2 gap-2 text-sm text-primary"
        >
          <PlusIcon />
          Adicionar um card
        </button>
      </div>
    </>
  )
}

interface TaskPlaceholderProps {
  columnId: number
  index: number
}

function TaskPlaceholder({ columnId, index }: TaskPlaceholderProps) {
  const { setNodeRef, transform, transition, isOver } = useSortable({
    id: `task-placeholder-${columnId}`,
    data: { type: 'placeholder', columnId, index },
    disabled: true,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'h-20 min-h-[4.5rem] rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 transition-colors',
        isOver ? 'border-primary/70 bg-primary/10' : '',
      )}
    />
  )
}
