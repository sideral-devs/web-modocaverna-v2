import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import dayjs from 'dayjs'

export default function EditableObjectiveItem({
  item,
  index,
  isEditing,
  selectedYear,
  onSave,
}: {
  item: { valor: string; checked: boolean }
  index: number
  isEditing: boolean
  selectedYear: string
  onSave: (index: number, newValue: string, checked: boolean) => void
}) {
  const [editedValue, setEditedValue] = useState(item.valor)
  const [editedChecked, setEditedChecked] = useState(item.checked)
  const handleSave = () => {
    if (
      editedValue.trim() !== item.valor.trim() ||
      editedChecked !== item.checked
    ) {
      onSave(index, editedValue, editedChecked)
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        defaultChecked={editedChecked}
        onCheckedChange={() => {
          setEditedChecked(!editedChecked)
        }}
        onBlur={handleSave}
        disabled={Number(selectedYear) < dayjs().year()}
      />
      {isEditing ? (
        <>
          <div className="flex bg-zinc-700 p-[2px] rounded-lg">
            <input
              type="text"
              className="bg-transparent text-sm"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              autoFocus
              onBlur={handleSave}
            />
          </div>
          {/* <p className="text-xs text-zinc-400 ml-2">&quot;Enter&quot;</p> */}
        </>
      ) : (
        <div className="w-[70%] bg-zinc-700 p-[2px] rounded-lg truncate">
          <span className="p-2">{item.valor}</span>
        </div>
      )}
    </div>
  )
}
