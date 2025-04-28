'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { KnowledgeDocument } from '../document'
import { KnowledgeHeader } from '../header'
import { UploadBookNewModalTrigger } from './upload-book-new'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { useUser } from '@/hooks/queries/use-user'

export default function Page() {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<
    'pendente' | 'em_andamento' | 'concluido' | 'desejos'
  >('pendente')
  const queryClient = useQueryClient()
  const { data, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await api.get('/livros/find')
      return response.data as Book[]
    },
  })
  const { data: user } = useUser()
  const userAcess =
    (user?.plan === 'DESAFIO' && user?.isInTrialDesafio) ||
    (user?.plan !== 'DESAFIO' && user?.status_plan === 'ATIVO')

  async function handleRemoveBook(id: number) {
    const rollback = data
    try {
      queryClient.setQueryData(['books'], (old: Book[]) =>
        old.filter((item) => item.id !== id),
      )
      await api.delete(`/livros/destroy/${id}`)
      queryClient.refetchQueries({ queryKey: ['books'] })
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response?.status !== 500 &&
        err.response?.data?.message
      ) {
        toast.error(err.response?.data?.message)
      } else {
        toast.error('Erro inexperado ao atualizar dados do livro!')
      }
      queryClient.setQueryData(['books'], rollback)
    }
  }

  async function handleMoveDocument(id: number, option: string) {
    if (!data) return

    const rollback = data
    try {
      const found = data.find((book) => book.id === id)
      if (!found) return

      const book = {
        titulo: found.titulo,
        autor: found.autor,
        nota_id: found.nota_id,
        status: found.status,
      }

      queryClient.setQueryData(['books'], (old: Book[]) =>
        old.map((book) =>
          book.id === id ? { ...found, status: option } : book,
        ),
      )

      await api.put(`/livros/update/${id}`, {
        book,
        nota_id: null,
        status: option,
      })
      queryClient.refetchQueries({ queryKey: ['books'] })
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response?.status !== 500 &&
        err.response?.data?.message
      ) {
        toast.error(err.response?.data?.message)
      } else {
        toast.error('Erro inexperado ao atualizar dados do livro!')
      }
      queryClient.setQueryData(['books'], rollback)
    }
  }

  const handleOpenEditModal = () => {
    setIsModalUpdateOpen(true)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col max-w-full overflow-x-hidden min-h-screen items-center overflow-y-auto scrollbar-minimal">
        <KnowledgeHeader />
        <section className="flex flex-col w-full max-w-7xl flex-1 px-4 py-14 gap-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Minhas leituras</h1>
            <div className="flex w-full items-center justify-between">
              <p className="text-zinc-400">Gerencie seus livros e artigos</p>
              {userAcess && (
                <UploadBookNewModalTrigger
                  refetch={refetch}
                  mode={'create'}
                  isOpen={isModalCreateOpen}
                  status={selectedTab}
                  onClose={() => setIsModalCreateOpen(false)}
                >
                  <Button onClick={() => setIsModalCreateOpen(true)}>
                    <PlusIcon /> Novo
                  </Button>
                </UploadBookNewModalTrigger>
              )}
            </div>
          </div>
          <Tabs
            defaultValue="pendente"
            value={selectedTab}
            onValueChange={(val) =>
              setSelectedTab(
                val as 'pendente' | 'em_andamento' | 'concluido' | 'desejos',
              )
            }
          >
            <TabsList className="w-full border-b">
              <TabsTrigger
                value="desejos"
                className="p-4 relative data-[state=active]:bg-transparent group"
              >
                Lista de desejos
                <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
              </TabsTrigger>
              <TabsTrigger
                value="pendente"
                className="p-4 relative data-[state=active]:bg-transparent group"
              >
                Minha Biblioteca
                <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
              </TabsTrigger>
              <TabsTrigger
                value="em_andamento"
                className="p-4 relative data-[state=active]:bg-transparent group"
              >
                Em andamento
                <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
              </TabsTrigger>
              <TabsTrigger
                value="concluido"
                className="p-4 relative data-[state=active]:bg-transparent group"
              >
                Concluído
                <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value={'desejos'} key={'desejos'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full py-8 px-4 gap-4">
                {data &&
                  data
                    .filter((item) => item.status === 'desejos')
                    .map((item, index) => (
                      <KnowledgeDocument
                        id={item.id}
                        key={item.id + index}
                        title={item.titulo}
                        type={item.is_ebook ? 'ebook' : 'livro'}
                        status="desejos"
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={userAcess}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onRemove={handleRemoveBook}
                        onEdit={() => handleOpenEditModal()}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
                        editModal={
                          <UploadBookNewModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            bookData={item}
                            mode="edit"
                            refetch={refetch}
                          />
                        }
                      />
                    ))}
              </div>
            </TabsContent>

            <TabsContent value={'pendente'} key={'pendente'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full py-8 px-4 gap-4">
                {data &&
                  data
                    .filter((item) => item.status !== 'desejos')
                    .map((item) => (
                      <KnowledgeDocument
                        id={item.id}
                        key={item.id}
                        title={item.titulo}
                        type={item.is_ebook ? 'ebook' : 'livro'}
                        status={item.status}
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={userAcess}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onRemove={handleRemoveBook}
                        onEdit={() => handleOpenEditModal()}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
                        editModal={
                          <UploadBookNewModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            bookData={item}
                            mode="edit"
                            refetch={refetch}
                          />
                        }
                      />
                    ))}
              </div>
            </TabsContent>

            <TabsContent value={'em_andamento'} key={'em_andamento'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full py-8 px-4 gap-4">
                {data &&
                  data
                    .filter((item) => item.status === 'em_andamento')
                    .map((item) => (
                      <KnowledgeDocument
                        id={item.id}
                        key={item.id}
                        title={item.titulo}
                        type={item.is_ebook ? 'ebook' : 'livro'}
                        status="em_andamento"
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={userAcess}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onRemove={handleRemoveBook}
                        onEdit={() => handleOpenEditModal()}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
                        editModal={
                          <UploadBookNewModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            bookData={item}
                            mode="edit"
                            refetch={refetch}
                          />
                        }
                      />
                    ))}
              </div>
            </TabsContent>

            <TabsContent value={'concluido'} key={'concluido'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full py-8 px-4 gap-4">
                {data &&
                  data
                    .filter((item) => item.status === 'concluido')
                    .map((item) => (
                      <KnowledgeDocument
                        id={item.id}
                        key={item.id}
                        title={item.titulo}
                        type={item.is_ebook ? 'ebook' : 'livro'}
                        status="concluido"
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={userAcess}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onRemove={handleRemoveBook}
                        onEdit={() => handleOpenEditModal()}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
                        editModal={
                          <UploadBookNewModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            bookData={item}
                            mode="edit"
                            refetch={refetch}
                          />
                        }
                      />
                    ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </ProtectedRoute>
  )
}
const OPTIONS = [
  {
    label: 'Pendente',
    value: 'pendente',
    color: 'bg-red-500',
  },
  {
    label: 'Em andamento',
    value: 'em_andamento',
    color: 'bg-yellow-500',
  },
  {
    label: 'Concluído',
    value: 'concluido',
    color: 'bg-green-500',
  },
]
