'use client'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Ellipsis, FolderIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function Note({ descricao, id, nome, ...props }: Note) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [text, setText] = useState(nome)

  const queryClient = useQueryClient()
  const router = useRouter()
  const pathName = usePathname()
  const noteHref = `/anotacoes/d/${id}`
  const active = pathName.includes(noteHref)

  async function handleEditNote() {
    try {
      setEditMode(false)
      await api.put(`/notas/update/${id}`, {
        ...props,
        cor: '#FF0000', // Obrigatório pela API
        nome: text,
      })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setPopoverOpen(false)
    }
  }

  async function handleDeleteNote() {
    try {
      await api.delete(`/notas/destroy/${id}`)
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })

      if (active) {
        router.replace('/anotacoes')
      }
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setPopoverOpen(false)
    }
  }

  if (editMode) {
    return (
      <div className="border-0 p-0 rounded-xl">
        <div className="flex relative items-center p-3 gap-2">
          <input
            className="bg-transparent text-sm transition-all duration-200"
            autoFocus
            value={text}
            onBlur={() => {
              handleEditNote()
            }}
            onChange={(e) => {
              setText(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              handleEditNote()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <Link
      href={noteHref}
      className="flex items-center pr-3 gap-2 rounded group/note py-2 transition-all duration-150"
    >
      <div
        className={cn(
          'w-1 h-1 bg-primary rounded',
          active ? 'opacity-100' : 'opacity-0',
        )}
      />
      <span
        className={cn(
          'text-sm flex-1 line-clamp-1',
          active
            ? 'text-primary transition-all duration-150'
            : 'group-hover/note:brightness-125 text-zinc-500',
        )}
      >
        {text || descricao}
      </span>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Ellipsis
            size={20}
            className="text-zinc-500 opacity-0 group-hover/note:opacity-100"
          />
        </PopoverTrigger>
        <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
          <button
            onClick={() => {
              setPopoverOpen(false)
              setEditMode(true)
            }}
            className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
          >
            Renomear
          </button>
          <button
            onClick={handleDeleteNote}
            className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
          >
            Apagar
          </button>
        </PopoverContent>
      </Popover>
    </Link>
  )
}

export function Folder({
  name,
  value,
  notes,
  onUpdate,
  onDelete,
  createNote,
  uneditable,
  addNoteButton,
}: {
  name: string
  value: string
  notes: Note[]
  onUpdate: ({
    id,
    name,
    fixed,
  }: {
    id: string
    name: string
    fixed: boolean
  }) => Promise<void>
  onDelete: (id: string) => Promise<void>
  createNote: (description: string, folderId: string) => Promise<void>
  uneditable?: boolean
  addNoteButton?: boolean
}) {
  const [creatingNote, setCreatingNote] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [text, setText] = useState(name)

  async function handleEditFolder() {
    try {
      setEditMode(false)
      await onUpdate({ id: value, name: text, fixed: false })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleDeleteFolder() {
    try {
      await onDelete(value)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  if (editMode) {
    return (
      <div className="border-0 p-0 rounded-xl">
        <div className="flex relative items-center p-3 gap-2">
          <FolderIcon size={20} />
          <input
            className="bg-transparent text-sm transition-all duration-200"
            autoFocus
            value={text}
            onBlur={() => {
              handleEditFolder()
            }}
            onChange={(e) => {
              setText(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              handleEditFolder()
            }}
          />
        </div>
      </div>
    )
  }

  if (creatingNote) {
    return (
      <div className="border-0 p-0 rounded-xl">
        <div className="flex relative items-center p-3 gap-4 group bg-zinc-800 text-zinc-500 rounded">
          <ChevronDown size={20} className="rotate-180" />
          <span className="text-sm transition-all duration-200">{name}</span>
        </div>
        <div className="flex flex-col py-4 pl-8 gap-3">
          {notes.map((note) => (
            <Note key={'note-' + note.id} {...note} />
          ))}

          <CreatingNote
            folderId={value}
            onCreate={createNote}
            setCreatingNote={setCreatingNote}
          />
        </div>
      </div>
    )
  }

  return (
    <AccordionItem className="border-0 p-0 rounded-xl" value={value}>
      <AccordionTrigger
        className="flex relative items-center p-3 gap-2 group data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-500 rounded"
        noIcon
      >
        <FolderIcon size={20} className="group-data-[state=open]:opacity-0" />
        <ChevronDown
          size={20}
          className="absolute opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180 transition-all duration-200"
        />

        <span className="text-sm group-data-[state=open]:translate-x-2 transition-all duration-200">
          {name}
        </span>

        {uneditable ? (
          addNoteButton ? (
            <div className="flex absolute right-3 items-center gap-3 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-200">
              <PlusIcon
                size={20}
                className="text-primary"
                onClick={() => setCreatingNote(true)}
              />
            </div>
          ) : null
        ) : (
          <div className="flex absolute right-3 items-center gap-3 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-200">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Ellipsis size={20} className="text-zinc-500" />
              </PopoverTrigger>
              <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
                <button
                  onClick={() => {
                    setPopoverOpen(false)
                    setEditMode(true)
                  }}
                  className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                >
                  Renomear
                </button>
                <button
                  onClick={handleDeleteFolder}
                  className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                >
                  Apagar
                </button>
              </PopoverContent>
            </Popover>
            <PlusIcon
              size={20}
              className="text-primary"
              onClick={() => setCreatingNote(true)}
            />
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col py-4 pl-8 gap-3">
        {notes.map((note) => (
          <Note key={'note-' + note.id} {...note} />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export function CreatingFolder({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>
}) {
  const [value, setValue] = useState('')

  async function handleCreate() {
    try {
      await onCreate(value)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <div className="flex relative items-center p-3 gap-2 ">
      <FolderIcon size={20} />
      <input
        autoFocus
        className="bg-transparent text-sm"
        onBlur={() => {
          handleCreate()
        }}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return
          handleCreate()
        }}
      />
    </div>
  )
}
function CreatingNote({
  folderId,
  onCreate,
  setCreatingNote,
}: {
  folderId: string
  onCreate: (description: string, folderId: string) => Promise<void>
  setCreatingNote: (arg: boolean) => void
}) {
  const [value, setValue] = useState('')

  async function handleCreate() {
    setCreatingNote(false)
    try {
      await onCreate(value, folderId)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <div className="flex relative items-center p-3 gap-2 ">
      <div className="flex items-center pr-3 gap-2 rounded group/note py-2 transition-all duration-150">
        <div className={cn('w-1 h-1 bg-primary rounded opacity-0')} />
        <input
          autoFocus
          className={cn(
            'bg-transparent text-sm flex-1 line-clamp-1 text-zinc-500',
          )}
          onBlur={() => {
            handleCreate()
          }}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            handleCreate()
          }}
        />
      </div>
    </div>
  )
}
