'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { KnowledgeDocument } from './document'

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<
    'pendente' | 'em_andamento' | 'concluido' | 'desejos'
  >('pendente')
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await api.get('/livros/find')
      return response.data as Book[]
    },
  })

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

  return (
    <ProtectedRoute>
      <div className="flex flex-col max-w-full overflow-x-hidden min-h-screen items-center overflow-y-auto scrollbar-minimal">
        <section className="flex flex-col w-full max-w-7xl flex-1 px-4 py-14 gap-10">
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
                        status={item.status}
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={true}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
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
                        status="em_andamento"
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={true}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
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
                        status="concluido"
                        author={item.autor || 'Autor • Nome do autor'}
                        userAcess={true}
                        src={item.capa}
                        acessEbookLink={item.is_ebook ? item.link : null}
                        onMoveTo={handleMoveDocument}
                        options={OPTIONS}
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
