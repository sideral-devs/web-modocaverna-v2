'use client'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { useBoard } from '@/hooks/queries/use-board'
import { ColumnContainer } from './task-container'
import CreateColumnDialog from './create-column-dialog'
import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import DefaultLoading from '../ui/loading'
import { createPortal } from 'react-dom'

type PreviewState = { columnId: number; index: number }

export default function Board() {
  const {
    getTasks,
    setColumnsCache,
    setTasksCache,
    reorderTask,
    updateTaskColumn,
    findTaskById,
  } = useBoard()
  const data = getTasks.data ?? []

  const columns = useMemo(
    () => [...data].sort((a, b) => a.position - b.position),
    [data],
  )
  const columnIds = useMemo(() => columns.map((c) => `col-${c.id}`), [columns])

  const colIdToIndex = useMemo(() => {
    const map = new Map<string, number>()
    columns.forEach((c, index) => map.set(`col-${c.id}`, index))
    return map
  }, [columns])

  const taskIdToColumnId = useMemo(() => {
    const map = new Map<string, number>()
    columns.forEach((column) =>
      column.tarefas.forEach((task) =>
        map.set(`task-${task.tarefa_id}`, Number(column.id)),
      ),
    )
    return map
  }, [columns])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  type ActiveType = 'column' | 'task' | null
  const [activeType, setActiveType] = useState<ActiveType>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [overColumnId, setOverColumnId] = useState<number | null>(null)
  const [preview, setPreview] = useState<PreviewState | null>(null)

  function resetDragState() {
    setActiveType(null)
    setActiveTask(null)
    setOverColumnId(null)
    setPreview(null)
  }

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)

    if (id.startsWith('col-')) {
      setActiveType('column')
      setActiveTask(null)
      return
    }

    if (id.startsWith('task-')) {
      setActiveType('task')
      const taskId = Number(id.replace('task-', ''))
      setActiveTask(findTaskById(taskId)?.task ?? null)
      return
    }

    setActiveType(null)
    setActiveTask(null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) {
      setOverColumnId(null)
      setPreview(null)
      return
    }

    const activeId = String(active.id)
    if (!activeId.startsWith('task-')) {
      setOverColumnId(null)
      setPreview(null)
      return
    }

    const fromColumnId = taskIdToColumnId.get(activeId)
    if (!fromColumnId) {
      setOverColumnId(null)
      setPreview(null)
      return
    }

    const overId = String(over.id)
    const overData = over.data.current as
      | { type?: string; columnId?: number; index?: number }
      | undefined

    let toColumnId =
      overData?.columnId ??
      (overId.startsWith('task-')
        ? taskIdToColumnId.get(overId)
        : overId.startsWith('col-drop-')
          ? Number(overId.replace('col-drop-', ''))
          : overId.startsWith('col-')
            ? Number(overId.replace('col-', ''))
            : undefined)

    if (!toColumnId) {
      setOverColumnId(null)
      setPreview(null)
      return
    }

    setOverColumnId(toColumnId)

    if (fromColumnId === toColumnId) {
      setPreview(null)
      return
    }

    const fromCol = columns.find((col) => col.id === fromColumnId)
    const toCol = columns.find((col) => col.id === toColumnId)
    if (!fromCol || !toCol) {
      setPreview(null)
      return
    }

    const fromTasks = [...fromCol.tarefas].sort((a, b) => +a.position - +b.position)
    const toTasks = [...toCol.tarefas].sort((a, b) => +a.position - +b.position)

    const activeTaskIdNum = Number(activeId.replace('task-', ''))
    const fromIndex = fromTasks.findIndex((t) => Number(t.tarefa_id) === activeTaskIdNum)
    if (fromIndex === -1) {
      setPreview(null)
      return
    }

    const overIsTask = overId.startsWith('task-')
    const overIsPlaceholder = overData?.type === 'placeholder'
    let insertAt = toTasks.length

    if (overIsPlaceholder && typeof overData?.index === 'number') {
      insertAt = Math.max(0, Math.min(overData.index, toTasks.length))
    } else if (overIsTask) {
      const overTaskId = Number(overId.replace('task-', ''))
      const overIndex = toTasks.findIndex((t) => Number(t.tarefa_id) === overTaskId)
      if (overIndex >= 0) {
        const activeTop =
          event.active.rect.current.translated?.top ??
          event.active.rect.current.initial?.top ??
          0

        const overMiddle = over.rect.top + over.rect.height / 2
        const isBelow = activeTop > overMiddle
        insertAt = overIndex + (isBelow ? 1 : 0)
      }
    }

    insertAt = Math.max(0, Math.min(insertAt, toTasks.length))

    setPreview({ columnId: toColumnId, index: insertAt })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) {
      resetDragState()
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId.startsWith('col-') && overId.startsWith('col-')) {
      const oldIndex = colIdToIndex.get(activeId)
      const newIndex = colIdToIndex.get(overId)
      resetDragState()
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
        return
      }

      const reordered = arrayMove(columns, oldIndex, newIndex).map((col, idx) => ({
        ...col,
        position: idx + 1,
      }))
      setColumnsCache(reordered)

      const moved = reordered[newIndex]
      updateTaskColumn.mutate({
        id: Number(moved.id),
        title: moved.title,
        position: moved.position,
      })
      return
    }

    if (!activeId.startsWith('task-')) {
      resetDragState()
      return
    }

    const fromColumnId = taskIdToColumnId.get(activeId)
    if (!fromColumnId) {
      resetDragState()
      return
    }

    const overData = over.data.current as
      | { type?: string; columnId?: number; index?: number }
      | undefined

    const overIsTask = overId.startsWith('task-')
    const overIsPlaceholder = overData?.type === 'placeholder'

    let toColumnId =
      overData?.columnId ??
      (overIsTask
        ? taskIdToColumnId.get(overId)
        : overId.startsWith('col-drop-')
          ? Number(overId.replace('col-drop-', ''))
          : overId.startsWith('col-')
            ? Number(overId.replace('col-', ''))
            : undefined)

    if (!toColumnId) {
      resetDragState()
      return
    }

    const fromCol = columns.find((col) => col.id === fromColumnId)
    const toCol = columns.find((col) => col.id === toColumnId)
    if (!fromCol || !toCol) {
      resetDragState()
      return
    }

    const fromTasks = [...fromCol.tarefas].sort((a, b) => +a.position - +b.position)
    const toTasks =
      fromColumnId === toColumnId
        ? fromTasks
        : [...toCol.tarefas].sort((a, b) => +a.position - +b.position)

    const activeTaskIdNum = Number(activeId.replace('task-', ''))
    const fromIndex = fromTasks.findIndex((t) => Number(t.tarefa_id) === activeTaskIdNum)

    if (fromIndex === -1) {
      resetDragState()
      return
    }

    let targetIndex: number
    if (overIsPlaceholder && typeof overData?.index === 'number') {
      targetIndex = Math.max(0, Math.min(overData.index, toTasks.length))
    } else if (overIsTask) {
      const overTaskId = Number(overId.replace('task-', ''))
      const overIndex = toTasks.findIndex((t) => Number(t.tarefa_id) === overTaskId)
      const activeTop =
        event.active.rect.current.translated?.top ??
        event.active.rect.current.initial?.top ??
        0

      const overMiddle = over.rect.top + over.rect.height / 2
      const isBelow = activeTop > overMiddle
      targetIndex = overIndex < 0 ? toTasks.length : overIndex + (isBelow ? 1 : 0)
    } else {
      targetIndex = toTasks.length
    }

    if (fromColumnId === toColumnId) {
      const normalizedTargetIndex = Math.max(
        0,
        Math.min(targetIndex, fromTasks.length - 1),
      )
      const next = arrayMove(fromTasks, fromIndex, normalizedTargetIndex).map(
        (task, idx) => ({
          ...task,
          position: idx + 1,
        }),
      )

      setTasksCache(toColumnId, next)
      reorderTask.mutate({
        tarefa_id: activeTaskIdNum,
        card_id: toColumnId,
        position: normalizedTargetIndex + 1,
      })
      resetDragState()
      return
    }

    const [movedTask] = fromTasks.splice(fromIndex, 1)
    const nextFrom = fromTasks.map((task, idx) => ({
      ...task,
      position: idx + 1,
    }))

    const insertAt = Math.max(0, Math.min(targetIndex, toTasks.length))
    const nextTo = [...toTasks]
    nextTo.splice(insertAt, 0, { ...movedTask, card_id: toColumnId })
    const nextToWithPos = nextTo.map((task, idx) => ({
      ...task,
      position: idx + 1,
    }))

    setTasksCache(fromColumnId, nextFrom)
    setTasksCache(toColumnId, nextToWithPos)

    reorderTask.mutate({
      tarefa_id: activeTaskIdNum,
      card_id: toColumnId,
      position: insertAt + 1,
    })

    resetDragState()
  }

  if (getTasks.isPending) return null

  return (
    <>
      <DefaultLoading visible={updateTaskColumn.isPending || reorderTask.isPending} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
            {columns.map((col) => {
              const numericId = Number(col.id)
              const columnPreview =
                preview && preview.columnId === numericId ? preview : null
              return (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  preview={columnPreview}
                  isDropTarget={activeType === 'task' && overColumnId === numericId}
                />
              )
            })}
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
            document.body,
          )}
      </DndContext>
    </>
  )
}
