import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EllipsisIcon, GripHorizontal, PlusIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, PointerSensor, closestCorners, useSensor, useSensors, } from '@dnd-kit/core'
import { CSS, Transform } from '@dnd-kit/utilities'
import TaskCard from './task-card'
import { useBoard } from '@/hooks/queries/use-board'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { DeleteColumnButton } from './task-delete-column'
import { RenameColumnInput } from './task-container-rename'

export const dynamic = 'force-dynamic'

interface ColumnContainerProps {
  column: TaskList
}

export function ColumnContainer({ column }: ColumnContainerProps) {
  const [editMode, setEditMode] = useState(false)
  const { reorderTask, setTasksCache, createTask } = useBoard()

  /////// Sortable da coluna
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(column.id),
    disabled: editMode,
  })

  const t: Transform | null = transform
    ? { ...transform, scaleX: 1, scaleY: 1 }
    : null


  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(t),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }




  /////// Dnd das taks cards
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const tasks = useMemo(
    () => [...column.tarefas].sort((a, b) => Number(a.position) - Number(b.position)),
    [column],
  )

  const itemIds = useMemo(
    () => tasks.map((t) => String(t.tarefa_id)),
    [tasks],
  )

  const idToIndex = useMemo(() => {
    const m = new Map<string, number>()
    tasks.forEach((t, i) => m.set(String(t.tarefa_id), i))
    return m
  }, [tasks])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = idToIndex.get(String(active.id))!
    const newIndex = idToIndex.get(String(over.id))!

    const reordered = arrayMove(tasks, oldIndex, newIndex).map((t, idx) => ({
      ...t,
      position: idx + 1,
    }))

    setTasksCache(Number(column.id), reordered)

    const moved = reordered[newIndex]

    reorderTask.mutate({
      tarefa_id: Number(moved.tarefa_id),
      card_id: Number(moved.card_id),
      position: Number(moved.position),
    })
  }



  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col w-72 shrink-0 h-fit max-h-[38rem] p-1 border rounded-2xl bg-zinc-900"
    >
      <div className="flex items-center justify-between p-2 gap-2 text-xs text-zinc-400">
        <div className='flex items-center gap-2'>
          <span className="truncate">{!editMode && column.title}</span>
          {editMode && (
            <RenameColumnInput
              id={Number(column.id)}
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
              <DeleteColumnButton columnId={Number(column.id)} />
            </PopoverContent>
          </Popover>

        </div>
        <GripHorizontal
          className="text-zinc-500 hover:text-zinc-400 cursor-grab"
          {...attributes}
          {...listeners}
        />

      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto scrollbar-minimal">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.tarefa_id} task={task} />
            ))}
          </SortableContext>
        </DndContext>

      </div>

      <button onClick={() => createTask.mutate({
        card_id: Number(column.id),
        item: `Nova Tarefa`,
        prioridade: 'Prioridade Média',
        descricao: null,
        index: 0,
        position: 0,
      })} className="flex items-center p-2 gap-2 text-sm text-primary">
        <PlusIcon />
        Adicionar um card
      </button>
    </div>
  )
}
