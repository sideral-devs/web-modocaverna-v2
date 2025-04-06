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
import { UploadVideoModalTrigger } from './upload-video'
import { useState } from 'react'

export default function Page() {
  const queryClient = useQueryClient()
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<
    'pendente' | 'em_andamento' | 'concluido' | 'desejos'
  >('pendente')
  // const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const { data, refetch } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get('/videos/find')
      return response.data as Video[]
    },
  })

  async function handleRemoveVideo(id: number) {
    const rollback = data
    try {
      queryClient.setQueryData(['videos'], (old: Video[]) =>
        old.filter((item) => item.id !== id),
      )
      await api.delete(`/videos/destroy/${id}`)
      queryClient.refetchQueries({ queryKey: ['videos'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.setQueryData(['videos'], rollback)
    }
  }

  async function handleMoveVideo(id: number, option: string) {
    if (!data) return

    const rollback = data
    try {
      const found = data.find((video) => video.id === id)
      if (!found) return

      const video = {
        titulo: found.titulo,
        status: found.status,
        link: found.link,
        categorias: found.categorias,
      }

      queryClient.setQueryData(['videos'], (old: Video[]) =>
        old.map((video) =>
          video.id === id ? { ...found, status: option } : video,
        ),
      )

      await api.put(`/videos/update/${id}`, { ...video, status: option })
      queryClient.refetchQueries({ queryKey: ['videos'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.setQueryData(['videos'], rollback)
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
            <h1 className="text-2xl font-semibold">Meus vídeos</h1>
            <div className="flex w-full items-center justify-between">
              <p className="text-zinc-400">
                Gerencie todos os vídeos do seu interesse
              </p>
              <UploadVideoModalTrigger
                refetch={refetch}
                mode={'create'}
                isOpen={isModalCreateOpen}
                status={selectedTab}
                onClose={() => setIsModalCreateOpen(false)}
              >
                <Button onClick={() => setIsModalCreateOpen(true)}>
                  <PlusIcon /> Novo
                </Button>
              </UploadVideoModalTrigger>
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
                Minha Videoteca
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
                    .map((item) => (
                      <KnowledgeDocument
                        key={item.id}
                        id={item.id}
                        title={item.titulo}
                        author={item.link || ''}
                        type="video"
                        status="desejos"
                        src={item.capa}
                        onRemove={handleRemoveVideo}
                        onMoveTo={handleMoveVideo}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadVideoModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            videoData={item}
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
                        key={item.id}
                        id={item.id}
                        title={item.titulo}
                        author={item.link || ''}
                        type="video"
                        status="em_andamento"
                        src={item.capa}
                        onRemove={handleRemoveVideo}
                        onMoveTo={handleMoveVideo}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadVideoModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            videoData={item}
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
                        key={item.id}
                        id={item.id}
                        title={item.titulo}
                        author={item.link || ''}
                        type="video"
                        status={item.status}
                        src={item.capa}
                        onRemove={handleRemoveVideo}
                        onMoveTo={handleMoveVideo}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadVideoModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            videoData={item}
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
                        key={item.id}
                        id={item.id}
                        title={item.titulo}
                        author={item.link || ''}
                        type="video"
                        status="concluido"
                        src={item.capa}
                        onRemove={handleRemoveVideo}
                        onMoveTo={handleMoveVideo}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadVideoModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            videoData={item}
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
