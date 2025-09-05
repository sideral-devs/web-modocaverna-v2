'use client'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { useBoard } from '@/hooks/queries/use-board'
import { ColumnContainer } from './task-container'
import CreateColumnDialog from './create-column-dialog'
import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import DefaultLoading from '../ui/loading'
import { createPortal } from 'react-dom'


export default function Board() {
  const { getTasks, setColumnsCache, setTasksCache, reorderTask, updateTaskColumn, findTaskById } = useBoard()
  const data = getTasks.data ?? []

  const columns = useMemo(() => [...data].sort((a, b) => a.position - b.position), [data])
  const columnIds = useMemo(() => columns.map(c => `col-${c.id}`), [columns])

  const colIdToIndex = useMemo(() => {
    const m = new Map<string, number>()
    columns.forEach((c, i) => m.set(`col-${c.id}`, i))
    return m
  }, [columns])

  const taskIdToColumnId = useMemo(() => {
    const m = new Map<string, number>()
    columns.forEach(c => c.tarefas.forEach(t => m.set(`task-${t.tarefa_id}`, Number(c.id))))
    return m
  }, [columns])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  type ActiveType = 'column' | 'task' | null
  const [activeType, setActiveType] = useState<ActiveType>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  function handleDragStart(e: DragStartEvent) {
    const id = String(e.active.id)
    if (id.startsWith('col-')) {
      setActiveType('column')
      setActiveTask(null)
    } else if (id.startsWith('task-')) {
      setActiveType('task')
      const n = Number(id.replace('task-', ''))
      setActiveTask(findTaskById(n)?.task ?? null)
    } else {
      setActiveType(null)
      setActiveTask(null)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveType(null)
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId.startsWith('col-') && overId.startsWith('col-')) {
      const oldIndex = colIdToIndex.get(activeId)!
      const newIndex = colIdToIndex.get(overId)!
      if (oldIndex === newIndex) return

      const reordered = arrayMove(columns, oldIndex, newIndex).map((col, idx) => ({
        ...col, position: idx + 1,
      }))
      setColumnsCache(reordered)

      const moved = reordered[newIndex]
      updateTaskColumn.mutate({ id: Number(moved.id), title: moved.title, position: moved.position })
      return
    }

    if (!activeId.startsWith('task-')) return

    const fromColumnId = taskIdToColumnId.get(activeId)
    if (!fromColumnId) return

    const overIsTask = overId.startsWith('task-')
    const toColumnId = overIsTask
      ? taskIdToColumnId.get(overId)
      : (overId.startsWith('col-drop-') ? Number(overId.replace('col-drop-', '')) : undefined)

    if (!toColumnId) return

    const fromCol = columns.find(c => c.id === fromColumnId)!
    const toCol = columns.find(c => c.id === toColumnId)!

    const fromTasks = [...fromCol.tarefas].sort((a, b) => +a.position - +b.position)
    const toTasks = (fromColumnId === toColumnId)
      ? fromTasks
      : [...toCol.tarefas].sort((a, b) => +a.position - +b.position)

    const activeTaskIdNum = Number(activeId.replace('task-', ''))
    const fromIndex = fromTasks.findIndex(t => Number(t.tarefa_id) === activeTaskIdNum)
    const toIndex = overIsTask
      ? toTasks.findIndex(t => Number(t.tarefa_id) === Number(overId.replace('task-', '')))
      : toTasks.length

    if (fromIndex === -1) return

    if (fromColumnId === toColumnId) {
      const next = arrayMove(fromTasks, fromIndex, toIndex).map((t, idx) => ({ ...t, position: idx + 1 }))
      setTasksCache(toColumnId, next)
      reorderTask.mutate({ tarefa_id: activeTaskIdNum, card_id: toColumnId, position: toIndex + 1 })
      return
    }

    const [movedTask] = fromTasks.splice(fromIndex, 1)
    const nextFrom = fromTasks.map((t, idx) => ({ ...t, position: idx + 1 }))

    const insertAt = Math.max(0, Math.min(toIndex, toTasks.length))
    const nextTo = [...toTasks]
    nextTo.splice(insertAt, 0, { ...movedTask, card_id: toColumnId })
    const nextToWithPos = nextTo.map((t, idx) => ({ ...t, position: idx + 1 }))

    setTasksCache(fromColumnId, nextFrom)
    setTasksCache(toColumnId, nextToWithPos)

    reorderTask.mutate({ tarefa_id: activeTaskIdNum, card_id: toColumnId, position: insertAt + 1 })
  }

  if (getTasks.isPending) return null

  return (
    <>
      <DefaultLoading visible={updateTaskColumn.isPending || reorderTask.isPending} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.BeforeDragging } }}
        modifiers={
          activeType === 'column'
            ? [restrictToHorizontalAxis]
            : activeType === 'task'
              ? [restrictToWindowEdges]
              : undefined
        }
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <div className="flex w-full gap-5 overflow-x-auto overflow-y-hidden scrollbar-minimal">
            {columns.map((col) => (
              <ColumnContainer key={col.id} column={col} />
            ))}
            <CreateColumnDialog />
          </div>
        </SortableContext>

        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              {activeType === 'task' && activeTask ? (
                <div className="pointer-events-none select-none w-72 rounded-xl bg-zinc-700 p-3 shadow-2xl">
                  <span className="mb-2 inline-block rounded bg-yellow-700 px-2 py-1 text-[10px] uppercase">
                    {activeTask.prioridade}
                  </span>
                  <p className="text-sm">{activeTask.item}</p>
                </div>
              ) : activeType === 'column' ? (
                <div className="w-72 rounded-2xl border bg-zinc-900 p-3 shadow-2xl opacity-90">
                  <div className="h-5 w-24 rounded bg-zinc-700" />
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </>
  )
}

