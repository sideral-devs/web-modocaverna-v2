import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import dayjs from 'dayjs'

export default function EditableObjectiveItem({
  item,
  index,
  handleCheckGoal,
  selectedYear,
  onSave,
}: {
  item: { valor: string; checked: boolean }
  index: number
  handleCheckGoal: (index: number, checked: boolean) => void
  selectedYear: string
  onSave: (index: number, newValue: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(item.valor)

  const handleSave = () => {
    if (editedValue.trim()) {
      onSave(index, editedValue) // Chama a função de salvar
    }
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        defaultChecked={item.checked}
        onCheckedChange={(val) => {
          const checked = val.valueOf() === true || false
          handleCheckGoal(index, checked)
        }}
        disabled={Number(selectedYear) < dayjs().year()}
      />
      {isEditing ? (
        <input
          type="text"
          className="bg-transparent text-sm border-b border-zinc-300 "
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            }
          }}
          autoFocus
        />
      ) : (
        <span
          className="cursor-pointer truncate max-w-[80%]"
          onClick={() => setIsEditing(true)}
        >
          {item.valor}
        </span>
      )}
    </div>
  )
}
