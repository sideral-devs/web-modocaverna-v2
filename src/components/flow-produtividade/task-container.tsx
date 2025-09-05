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

export const dynamic = 'force-dynamic'

interface ColumnContainerProps {
  column: TaskList
}

export function ColumnContainer({ column }: ColumnContainerProps) {
  const [editMode, setEditMode] = useState(false)
  const { reorderTask, createTask } = useBoard()

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

  const taskIds = useMemo(() => tasks.map(t => `task-${t.tarefa_id}`), [tasks])

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

        <div
          ref={setDropAreaRef}
          className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto scrollbar-minimal"
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.tarefa_id} task={task} />
            ))}
          </SortableContext>
        </div>

        <button
          onClick={() =>
            createTask.mutate({
              card_id: Number(column.id),
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
