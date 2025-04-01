'use client'
import { Accordion } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreatingFolder, Folder } from './sidebar-folder'
import { TrashSidebar } from './sidebar-trash'
import { useUser } from '@/hooks/queries/use-user'

type Routes = 'root' | 'trash'

export function NotesSidebar() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [sidebarRoute, setSidebarRoute] = useState<Routes>('root')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const { data: user } = useUser()

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const response = await api.get('/pastas/find')
      return response.data as Folder[]
    },
  })

  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await api.get('/notas/find')
      const data = response.data as Note[]
      return data.filter((n) => !n.deleted_at)
    },
  })

  async function createFolder(name: string) {
    const rollback = folders
    setCreatingFolder(false)
    try {
      const created: Folder = {
        id: crypto.randomUUID(),
        nome: name,
        notas: [],
        fixada: false,
        pasta_pai: null,
      }
      queryClient.setQueryData(['folders'], (old: Folder[]) => [
        ...old,
        created,
      ])

      await api.post('/pastas/store', {
        nome: created.nome,
      })
      queryClient.refetchQueries({ queryKey: ['folders'] })
    } catch (err) {
      queryClient.setQueryData(['folders'], rollback)
      throw err
    }
  }

  async function editFolder({
    id,
    name,
    fixed = false,
  }: {
    id: string
    name: string
    fixed?: boolean
  }) {
    const rollback = folders
    const folder = folders?.find((f) => f.id === id)
    if (!folder) throw new Error('Pasta não existe')
    try {
      const updated: Folder = {
        ...folder,
        nome: name,
        fixada: fixed,
      }
      queryClient.setQueryData(['folders'], (old: Folder[]) =>
        old.map((f) => (f.id === id ? updated : f)),
      )

      await api.put(`/pastas/update/${id}`, {
        nome: updated.nome,
        fixada: updated.fixada,
      })
      queryClient.refetchQueries({ queryKey: ['folders'] })
    } catch (err) {
      queryClient.setQueryData(['folders'], rollback)
      throw err
    }
  }

  async function deleteFolder(id: string) {
    const rollback = folders
    if (!rollback) throw new Error('Pasta não existe')
    try {
      queryClient.setQueryData(['folders'], (old: Folder[]) =>
        old.filter((f) => f.id !== id),
      )
      await api.delete(`/pastas/destroy/${id}`)
      queryClient.refetchQueries({ queryKey: ['folders'] })
    } catch (err) {
      queryClient.setQueryData(['folders'], rollback)
      throw err
    }
  }

  async function createNote(description: string, folderId: string) {
    const rollback = notes

    if (!rollback) return
    try {
      const created: Note = {
        id: crypto.randomUUID(),
        nome: description,
        fixada: false,
        pasta_id: folderId,
        cor: null,
        descricao: description,
      }

      queryClient.setQueryData(['notes'], (old: Note[]) => [...old, created])
      queryClient.setQueryData(['folders'], (old: Folder[]) =>
        old.map((f) =>
          f.id === folderId
            ? {
                ...f,
                notas: [...f.notas, created],
              }
            : f,
        ),
      )

      const inserted = await api.post('/notas/store', {
        nome: created.nome,
        pasta_id: created.pasta_id,
      })
      const insertedNote = inserted.data as Note

      queryClient.setQueryData(['notes'], () => [
        ...rollback,
        { ...insertedNote },
      ])
      queryClient.setQueryData(['folders'], (old: Folder[]) =>
        old.map((f) =>
          f.id === folderId
            ? {
                ...f,
                notas: f.notas.map((nota) =>
                  nota.id === created.id ? insertedNote : nota,
                ),
              }
            : f,
        ),
      )

      queryClient.refetchQueries({ queryKey: ['notes'] })

      router.push('/anotacoes/d/' + insertedNote.id)
    } catch (err) {
      queryClient.setQueryData(['notes'], rollback)
      throw err
    }
  }

  function handleChangeRoute(route: Routes) {
    setSidebarRoute(route)
  }

  return (
    <aside className="flex w-80 h-full items-center bg-black border-r border-l">
      {sidebarRoute === 'root' ? (
        <div className="flex flex-col w-full lg:w-72 lg:max-w-72 h-full">
          <header className="w-full p-5 border-b">
            {folders && notes ? (
              <p className="text-zinc-500">
                {folders.length} pastas • {notes.length} anotações
              </p>
            ) : (
              <Skeleton className="w-48 h-4" />
            )}
          </header>
          <div className="flex flex-col h-full gap-4 p-4 overflow-y-auto scrollbar-minimal">
            <div className="flex flex-col flex-1 gap-2">
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-2"
              >
                {/* <Folder
                  name="Todas"
                  value="all"
                  notes={notes || []}
                  onUpdate={editFolder}
                  onDelete={deleteFolder}
                  createNote={createNote}
                  uneditable
                /> */}

                {folders &&
                  folders.map((folder) => {
                    if (folder.id === user?.id) {
                      return (
                        <Folder
                          key={'folder-' + folder.id}
                          name={folder.nome}
                          value={folder.id}
                          notes={folder.notas}
                          onUpdate={editFolder}
                          onDelete={deleteFolder}
                          createNote={createNote}
                          uneditable
                          addNoteButton
                        />
                      )
                    }
                    return (
                      <Folder
                        key={'folder-' + folder.id}
                        name={folder.nome}
                        value={folder.id}
                        notes={folder.notas}
                        onUpdate={editFolder}
                        onDelete={deleteFolder}
                        createNote={createNote}
                      />
                    )
                  })}
                {creatingFolder && <CreatingFolder onCreate={createFolder} />}
              </Accordion>
            </div>
            <button
              className="flex items-center mx-auto gap-2"
              onClick={() => setCreatingFolder(true)}
            >
              <PlusIcon size={20} className="text-primary" />
              <span className="text-sm text-primary">Adicionar pasta</span>
            </button>
            <div
              className="flex items-center p-3 gap-2 cursor-pointer"
              onClick={() => handleChangeRoute('trash')}
            >
              <Trash2 size={20} />
              <span className="text-sm">Lixeira</span>
            </div>
          </div>
        </div>
      ) : (
        <TrashSidebar onBack={() => handleChangeRoute('root')} />
      )}
    </aside>
  )
}
