'use client'
import { CreatePostForm } from '@/components/community/create-post-form'
import { PostCard } from '@/components/community/post-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function HomePage() {
  const queryClient = useQueryClient()
  const [buttonLoading, setButtonLoading] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/posts')

      setPage(1)
      return res.data as PostDTO
    },
  })

  async function loadMore() {
    if (!data || isLoading) return

    setButtonLoading(true)
    try {
      const nextPage = page + 1
      const res = await api.get('/posts', {
        params: { page: nextPage },
      })

      queryClient.setQueryData(['posts'], (oldData: PostDTO) => ({
        ...oldData,
        data: [...oldData.data, ...res.data.data],
      }))
      setPage(nextPage)
    } catch (err) {
      console.error(err)
      toast.error('Não foi possível fazer isso')
    } finally {
      setButtonLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full flex-1 items-center">
      <div className="flex flex-col w-full flex-1 sm:border rounded-lg">
        {data ? <CreatePostForm /> : <Skeleton className="w-full h-12" />}

        {data ? (
          <div>
            <Tabs
              defaultValue="general"
              className="md:w-full overflow-x-scroll no-scrollbar"
            >
              <TabsList className="w-full grid grid-cols-4 rounded-none border-b overflow-x-scroll no-scrollbar">
                <TabsTrigger
                  value="general"
                  className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                >
                  Geral
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
                <TabsTrigger
                  value="experiences"
                  className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                >
                  Experiências
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
                <TabsTrigger
                  value="indications"
                  className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                >
                  Indicações
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
                <TabsTrigger
                  value="opportunities"
                  className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                >
                  Oportunidades
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0">
                <div>
                  {data.data.map((post) => (
                    <div key={post.id} className="border-b">
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="experiences" className="mt-0">
                <div>
                  {data.data
                    .filter((post) => post.category === 'Experiência')
                    .map((post) => (
                      <div key={post.id} className="border-b">
                        <PostCard post={post} />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="indications" className="mt-0">
                <div>
                  {data.data
                    .filter((post) => post.category === 'Indicações')
                    .map((post) => (
                      <div key={post.id} className="border-b">
                        <PostCard post={post} />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="mt-0">
                <div>
                  {data.data
                    .filter((post) => post.category === 'Oportunidades')
                    .map((post) => (
                      <div key={post.id} className="border-b">
                        <PostCard post={post} />
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col flex-1 p-4 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex w-full gap-3">
                <Skeleton className="w-[60px] h-[60px] rounded-full" />
                <div className="flex flex-1 w-full flex-col py-2 gap-3">
                  <Skeleton className="w-1/2 h-2" />
                  <Skeleton className="w-full h-2.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        variant="outline"
        onClick={loadMore}
        className="mt-6"
        disabled={buttonLoading}
      >
        Carregar mais
      </Button>
    </div>
  )
}
