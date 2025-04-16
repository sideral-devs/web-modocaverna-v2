'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Note, Folder } from '@/types/type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDown,
  ChevronLeft,
  Ellipsis,
  FolderIcon,
  NotebookTextIcon,
  Trash2,
} from 'lucide-react'

import { toast } from 'sonner'

export function TrashSidebar({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient()
  const { data: deletedFolders, isFetched: isFetchedFolders } = useQuery({
    queryKey: ['folders-deleted'],
    queryFn: async () => {
      const response = await api.get('/pastas/trashed')
      const data = response.data as Folder[]
      return data.filter((n) => !!n.deleted_at)
    },
  })

  const { data: deletedNotes, isFetched: isFetchedNote } = useQuery({
    queryKey: ['notes-deleted'],
    queryFn: async () => {
      const response = await api.get('/notas/trashed')
      const data = response.data as Note[]
      return data.filter((n) => !!n.deleted_at)
    },
  })
  const deletedFolderIds = new Set(deletedFolders?.map((f) => f.id))
  const notesWithoutFolder = deletedNotes?.filter((note) => {
    return !deletedFolderIds.has(note.pasta_id)
  })

  async function obliterateFolder(id: string) {
    const rollback = deletedFolders
    const folder = deletedFolders?.find((f) => f.id === id)
    if (!folder) throw new Error('Pasta não existe')
    try {
      queryClient.setQueryData(['folders-deleted'], (old: Folder[]) =>
        old.filter((f) => f.id !== id),
      )
      await api.delete(`/pastas/obliterate/${id}`)
      queryClient.refetchQueries({ queryKey: ['folders-deleted'] })
      queryClient.refetchQueries({ queryKey: ['folders'] })
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      queryClient.refetchQueries({ queryKey: ['notes'] })
    } catch (err) {
      queryClient.setQueryData(['folders-deleted'], rollback)
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      throw err
    }
  }

  async function restoreFolder(id: string) {
    const rollback = deletedFolders
    const folder = deletedFolders?.find((f) => f.id === id)
    if (!folder) throw new Error('Pasta não existe')
    try {
      queryClient.setQueryData(['folders-deleted'], (old: Folder[]) =>
        old.filter((f) => f.id !== id),
      )
      await api.patch(`/pastas/restore/${id}`)
      queryClient.refetchQueries({ queryKey: ['folders-deleted'] })
      queryClient.refetchQueries({ queryKey: ['folders'] })
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      queryClient.refetchQueries({ queryKey: ['notes'] })
    } catch (err) {
      queryClient.setQueryData(['folders-deleted'], rollback)
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      throw err
    }
  }

  async function restoreNote(id: string) {
    try {
      queryClient.setQueryData(['folders-deleted'], (old: Note[]) =>
        old.filter((f) => f.id !== id),
      )
      await api.patch(`/notas/restore/${id}`)
      queryClient.refetchQueries({ queryKey: ['folders-deleted'] })
      queryClient.refetchQueries({ queryKey: ['folders'] })
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      queryClient.refetchQueries({ queryKey: ['notes'] })
    } catch (err) {
      queryClient.refetchQueries({ queryKey: ['folders-deleted'] })
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      throw err
    }
  }

  async function obliterateNote(id: string) {
    const rollback = deletedFolders
    try {
      queryClient.setQueryData(['folders-deleted'], (old: Folder[]) =>
        old.map((f) => ({
          ...f,
          notas: f.notas.filter((n) => n.id !== id),
        })),
      )
      await api.delete(`/notas/obliterate/${id}`)
      queryClient.refetchQueries({ queryKey: ['folders-deleted'] })
      queryClient.refetchQueries({ queryKey: ['folders'] })
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      queryClient.refetchQueries({ queryKey: ['notes'] })
    } catch (err) {
      queryClient.setQueryData(['folders-deleted'], rollback)
      queryClient.refetchQueries({ queryKey: ['notes-deleted'] })
      throw err
    }
  }

  return (
    <div className="flex flex-col w-full max-w-72 h-full px-2 py-4 border-l">
      <div
        className="flex items-center p-3 gap-2 cursor-pointer text-zinc-500"
        onClick={onBack}
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Retornar</span>
      </div>
      {!isFetchedFolders && (
        <div className="flex flex-col py-8 gap-4">
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-[85%] h-3" />
          <Skeleton className="w-[85%] h-3" />
          <Skeleton className="w-[85%] h-3" />
        </div>
      )}
      {isFetchedFolders &&
        ((deletedFolders && deletedFolders?.length === 0) || !deletedFolders) &&
        isFetchedNote &&
        ((notesWithoutFolder && notesWithoutFolder?.length === 0) ||
          !notesWithoutFolder) && (
          <div className="flex flex-col flex-1 items-center justify-center gap-3">
            <Trash2 size={20} className="text-zinc-500" />
            <span className="text-zinc-500 text-sm">
              Não há notas excluídas
            </span>
          </div>
        )}
      {((deletedFolders && deletedFolders?.length > 0) ||
        (notesWithoutFolder && notesWithoutFolder?.length > 0)) && (
        <div className="flex flex-col h-full gap-4 p-4 overflow-y-auto scrollbar-minimal">
          <div className="flex flex-col flex-1 gap-2">
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-2"
            >
              {deletedFolders?.map((folder) => (
                <DeletedFolder
                  key={folder.id}
                  folder={folder}
                  onDelete={obliterateFolder}
                  onRestore={restoreFolder}
                  onRestoreNote={restoreNote}
                  onDeleteNote={obliterateNote}
                />
              ))}
              {notesWithoutFolder?.map((note) => {
                return (
                  <DeletedNotes
                    key={note.id}
                    note={note}
                    onDeleteNote={obliterateNote}
                    onRestoreNote={restoreNote}
                  />
                )
              })}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  )
}

function DeletedFolder({
  folder,
  onDelete,
  onRestore,
  onRestoreNote,
  onDeleteNote,
}: {
  folder: Folder
  onDelete: (id: string) => Promise<void>
  onRestore: (id: string) => Promise<void>
  onRestoreNote: (id: string) => Promise<void>
  onDeleteNote: (id: string) => Promise<void>
}) {
  async function handleDeleteFolder() {
    try {
      await onDelete(folder.id)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleRestoreFolder() {
    try {
      await onRestore(folder.id)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleRestoreNote(noteId: string) {
    try {
      await onRestoreNote(noteId)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleDeleteNote(noteId: string) {
    try {
      await onDeleteNote(noteId)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <AccordionItem
      className="border-0 p-0 rounded-xl"
      value={folder.id}
      key={folder.id}
    >
      <AccordionTrigger
        className="flex relative items-center p-3 gap-2 group data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-500 rounded"
        noIcon
      >
        <FolderIcon size={20} className="group-data-[state=open]:opacity-0" />
        <ChevronDown
          size={20}
          className="absolute opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180 transition-all duration-200"
        />

        <span className="text-sm text-zinc-400 italic group-data-[state=open]:translate-x-2 transition-all duration-200">
          {folder.nome}
        </span>

        <div className="flex absolute right-3 items-center gap-3 opacity-0 group-data-[state=open]:opacity-100 transition-all duration-200">
          <Popover>
            <PopoverTrigger asChild>
              <Ellipsis size={20} className="text-zinc-500" />
            </PopoverTrigger>
            <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
              <button
                onClick={handleRestoreFolder}
                className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
              >
                Restaurar
              </button>
              <button
                onClick={handleDeleteFolder}
                className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
              >
                Excluir da lixeira
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col py-4 pl-8 gap-3">
        {folder.notas.map((note) => (
          <div
            key={note.id}
            className="flex relative items-center pr-3 gap-2 rounded group/note py-2 transition-all duration-150"
          >
            <NotebookTextIcon size={20} />
            <span
              className={cn(
                'text-sm flex-1 line-clamp-1',
                'group-hover/note:brightness-125 text-zinc-500',
              )}
            >
              {note.descricao || note.nome}
            </span>
            <div className="flex absolute right-3 items-center gap-3 opacity-0 group-hover/note:opacity-100 transition-all duration-200">
              <Popover>
                <PopoverTrigger asChild>
                  <Ellipsis
                    size={20}
                    className="text-zinc-500 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-52 p-1 bg-zinc-800 rounded-lg text-xs"
                >
                  <button
                    onClick={() => handleRestoreNote(note.id)}
                    className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                  >
                    Excluir da lixeira
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

function DeletedNotes({
  note,
  onDeleteNote,
  onRestoreNote,
}: {
  note: Note
  onRestoreNote: (id: string) => Promise<void>
  onDeleteNote: (id: string) => Promise<void>
}) {
  async function handleDeleteNote() {
    try {
      await onDeleteNote(note.id)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  async function handleRestoreNote() {
    try {
      await onRestoreNote(note.id)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <div className="flex relative items-center p-3 gap-2 group data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-500 rounded">
      <NotebookTextIcon size={20} className="" />

      <span className="text-sm text-zinc-400 italic group-data-[state=open]:translate-x-2 transition-all duration-200">
        {note.nome}
      </span>

      <div className="flex absolute right-3 items-center gap-3  group-data-[state=open]:opacity-100 transition-all duration-200">
        <Popover>
          <PopoverTrigger asChild>
            <Ellipsis size={20} className="text-zinc-500 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-52 p-1 bg-zinc-800 rounded-lg text-xs"
          >
            <button
              onClick={handleRestoreNote}
              className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
            >
              Restaurar
            </button>
            <button
              onClick={handleDeleteNote}
              className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
            >
              Excluir da lixeira
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
