'use client'

import { useState } from 'react'
import { useBoard } from '@/hooks/queries/use-board'
import { toast } from 'sonner'

interface RenameColumnInputProps {
  id: number
  initialValue: string
  position: number
  onFinish?: () => void
}

export function RenameColumnInput({
  id,
  initialValue,
  position,
  onFinish,
}: RenameColumnInputProps) {
  const [value, setValue] = useState(initialValue)
  const { updateTaskColumn } = useBoard()

  function save() {
    const title = value.trim()
    if (!title) {
      toast.error('O título não pode estar vazio')
      return
    }

    onFinish?.()

    updateTaskColumn.mutate(
      { id, title, position },
      {
        onError: () => {
          toast.error('Erro ao renomear coluna')
        },
      },
    )
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      save()
    } else if (e.key === 'Escape') {
      onFinish?.()
    }
  }

  return (
    <input
      autoFocus
      className="bg-black rounded outline-none w-full px-2 py-1 text-sm text-white"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={handleKeyDown}
      maxLength={24}
    />
  )
}
