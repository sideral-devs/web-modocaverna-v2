'use client'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Edit, GripHorizontal, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS, Transform } from '@dnd-kit/utilities'
import { Button } from '../ui/button'
import { EditTaskDialog } from './edit-task-dialog'

interface TaskProps {
  task: Task
}

export default function TaskCard({ task }: TaskProps) {
  const [selectPriorityOpen, setSelectPriorityOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.tarefa_id}`,
  })

  const t: Transform | null = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(t),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col p-3 gap-3 bg-zinc-700 rounded-xl">


      <div className="flex w-full items-center justify-between">
        <div className='flex items-center gap-2'>
          <Popover open={selectPriorityOpen} onOpenChange={setSelectPriorityOpen}>
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

          <EditTaskDialog task={task}>
            <Button size="sm" className='w-6 h-6' variant="ghost">
              <Edit size={17} />
            </Button>
          </EditTaskDialog>
        </div>
        <GripHorizontal
          className="text-zinc-500 hover:text-zinc-400 cursor-grab"
          {...attributes}
          {...listeners}
        />
      </div>

      {task.task_tickets && task.task_tickets.length > 0 && (
        <div className="flex flex-wrap py-2 w-full gap-2">
          {task.task_tickets?.map((tag) => (
            <div
              key={tag.id}
              className={`rounded-full text-xs font-medium text-white transition-all duration-300 overflow-hidden ${isExpanded ? 'px-2 py-1' : 'w-3 h-3'
                } flex items-center justify-center`}
              style={{
                backgroundColor: tag.color,
                minWidth: isExpanded ? '' : '2.75rem',
              }}
              onClick={(e) => {
                setIsExpanded(!isExpanded)
                e.stopPropagation()
              }}
            >
              <span
                className={`whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'
                  } transition-opacity duration-300`}
              >
                {tag.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="w-full whitespace-pre-wrap text-sm line-clamp-2">
        {task.item}
      </p>

      {task.checklists && task.checklists.length > 0 && (
        <div className="flex flex-row items-end justify-end w-full p-2 gap-1">
          {task.checklists?.map((checklist, index) => {
            const total = checklist.subtasks.length
            const done = checklist.subtasks.filter(
              (sub) => !!Number(sub.checked),
            ).length

            return (
              <div key={checklist.id}>
                {checklist.subtasks.length > 0 && (
                  <div className='flex items-center gap-2'>
                    <ListChecks width={20} height={20} />
                    <span key={index} className="text-sm text-white">
                      {done}/{total}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
