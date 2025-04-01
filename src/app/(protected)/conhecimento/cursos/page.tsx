'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { KnowledgeDocument } from '../document'
import { KnowledgeHeader } from '../header'
import { UploadCourseModalTrigger } from './upload-course'
import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Page() {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<
    'pendente' | 'em_andamento' | 'concluido' | 'desejos'
  >('pendente')
  const queryClient = useQueryClient()

  const { data, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get('/cursos/find')
      return response.data as Course[]
    },
  })

  async function handleRemoveCourse(id: number) {
    const rollback = data
    try {
      queryClient.setQueryData(['courses'], (old: Course[]) =>
        old.filter((item) => item.id !== id),
      )
      await api.delete(`/cursos/destroy/${id}`)
      queryClient.refetchQueries({ queryKey: ['courses'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.setQueryData(['courses'], rollback)
    }
  }

  async function handleMoveCourse(id: number, option: string) {
    if (!data) return

    const rollback = data
    try {
      const found = data.find((course) => course.id === id)
      if (!found) return

      const course = {
        titulo: found.titulo,
        status: found.status,
        link: found.link,
        categorias: found.categorias,
      }

      queryClient.setQueryData(['courses'], (old: Course[]) =>
        old.map((course) =>
          course.id === id ? { ...found, status: option } : course,
        ),
      )

      await api.put(`/cursos/update/${id}`, { ...course, status: option })
      queryClient.refetchQueries({ queryKey: ['courses'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.setQueryData(['courses'], rollback)
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
            <h1 className="text-2xl font-semibold">Meus cursos</h1>
            <div className="flex w-full items-center justify-between">
              <p className="text-zinc-400">
                Gerencie todos os cursos de seu interesse
              </p>
              <UploadCourseModalTrigger
                refetch={refetch}
                mode={'create'}
                isOpen={isModalCreateOpen}
                status={selectedTab}
                onClose={() => setIsModalCreateOpen(false)}
              >
                <Button onClick={() => setIsModalCreateOpen(true)}>
                  <PlusIcon /> Novo
                </Button>
              </UploadCourseModalTrigger>
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
                Meus Cursos
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
                        type="curso"
                        status="desejos"
                        author={item.link || 'Link'}
                        src={item.capa}
                        onRemove={handleRemoveCourse}
                        onMoveTo={handleMoveCourse}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadCourseModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            courseData={item}
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
                        type="curso"
                        status={item.status}
                        author={item.link || 'Link'}
                        src={item.capa}
                        onRemove={handleRemoveCourse}
                        onMoveTo={handleMoveCourse}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadCourseModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            courseData={item}
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
                        type="curso"
                        status="em_andamento"
                        author={item.link || 'Link'}
                        src={item.capa}
                        onRemove={handleRemoveCourse}
                        onMoveTo={handleMoveCourse}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadCourseModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            courseData={item}
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
                        type="curso"
                        status="concluido"
                        author={item.link || 'Link'}
                        src={item.capa}
                        onRemove={handleRemoveCourse}
                        onMoveTo={handleMoveCourse}
                        options={OPTIONS}
                        onEdit={() => handleOpenEditModal()}
                        editModal={
                          <UploadCourseModalTrigger
                            isOpen={isModalUpdateOpen}
                            onClose={() => setIsModalUpdateOpen(false)}
                            courseData={item}
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
