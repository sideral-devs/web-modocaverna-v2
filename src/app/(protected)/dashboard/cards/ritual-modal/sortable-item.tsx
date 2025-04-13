import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

export function SortableItem({
  index,
  id,
  text,
  onRemove,
  disabled,
}: {
  index: number
  id: string
  text: string
  onRemove: () => void
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex w-full items-center py-6 gap-4"
    >
      {disabled || (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} className="text-zinc-400" />
        </div>
      )}
      <div className="w-4 h-4 flex items-center justify-center bg-zinc-700 rounded">
        <span className="text-[10px]">{index}</span>
      </div>
      <span className="flex-1 text-sm capitalize">{text}</span>

      <Trash2
        className="h-4 w-4 text-zinc-400 cursor-pointer"
        onClick={onRemove}
      />
    </li>
  )
}
