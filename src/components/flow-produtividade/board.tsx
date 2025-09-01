'use client'

import {
  DndContext,
  DragEndEvent,
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
import { useMemo } from 'react'
import { useBoard } from '@/hooks/queries/use-board'
import { ColumnContainer } from './task-container'
import CreateColumnDialog from './create-column-dialog'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import DefaultLoading from '../ui/loading'

export default function Board() {
  const { getTasks, setColumnsCache, updateTaskColumn } = useBoard()
  const data = getTasks.data ?? []

  const columns = useMemo(() => [...data].sort((a, b) => a.position - b.position), [data])

  const itemIds = useMemo(() => columns.map((c) => String(c.id)), [columns])

  const idToIndex = useMemo(() => {
    const m = new Map<string, number>()
    columns.forEach((c, i) => m.set(String(c.id), i))
    return m
  }, [columns])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = idToIndex.get(String(active.id))!
    const newIndex = idToIndex.get(String(over.id))!

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
  }

  if (getTasks.isPending) {
    return;
  }


  return (
    <>
      <DefaultLoading visible={updateTaskColumn.isPending} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
          <div className="flex w-full gap-5 overflow-x-auto overflow-y-hidden scrollbar-minimal">
            {columns.map((col) => (
              <ColumnContainer key={col.id} column={col} />
            ))}
            <CreateColumnDialog />
          </div>
        </SortableContext>
      </DndContext>
    </>
  )
}
