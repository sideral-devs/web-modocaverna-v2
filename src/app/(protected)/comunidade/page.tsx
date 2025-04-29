'use client'
import { CreatePostForm } from '@/components/community/create-post-form'
import { PostCard } from '@/components/community/post-card'
import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { env } from '@/lib/env'
import { PinIcon } from 'lucide-react'

function MockPostCard({ content }: { content: string }) {
  return (
    <Card className="border-x-0 rounded-none shadow-none bg-transparent relative">
      <CardContent className="p-4 pb-12">
        <div
          className="appearance-none p-0 m-0 border-none bg-transparent w-full text-left cursor-inherit"
          tabIndex={-1}
          style={{ all: 'unset', width: '100%', display: 'block' }}
          aria-label="Abrir post"
        >
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage
                src={`${env.NEXT_PUBLIC_PROD_URL}/storage/68004cb1d2407.webp`}
              />
              <AvatarFallback className="uppercase">C</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-3 w-full">
                <div className="flex items-center gap-3 text-sm">
                  Capitão Caverna
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <PinIcon size={16} />
                    Fixado
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-base whitespace-pre-wrap">
                  <p>{content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const queryClient = useQueryClient()
  const [currentTab, setCurrentTab] = useState('Geral')
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

    if (page >= data.last_page) return

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
    <UpgradeModalTrigger>
      <div className="flex flex-col w-full flex-1 items-center">
        <div className="flex flex-col w-full flex-1 sm:border rounded-lg">
          {data ? <CreatePostForm /> : <Skeleton className="w-full h-12" />}

          {data ? (
            <div>
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="md:w-full overflow-x-scroll no-scrollbar"
              >
                <TabsList className="w-full grid grid-cols-4 rounded-none border-b overflow-x-scroll no-scrollbar">
                  <TabsTrigger
                    value="Geral"
                    className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                  >
                    Geral
                    <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="Experiência"
                    className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                  >
                    Experiências
                    <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="Indicações"
                    className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                  >
                    Indicações
                    <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="Oportunidades"
                    className="p-4 min-w-24 relative data-[state=active]:bg-transparent group"
                  >
                    Oportunidades
                    <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Geral" className="mt-0">
                  <div className="divide-y">
                    <MockPostCard
                      content={`👊 Bem-vindo à Comunidade Alcateia.
Aqui você vê tudo o que está acontecendo.
Mas ao postar, escolha a aba certa.
Organização é disciplina. Disciplina é transformação. 🔺🐺`}
                    />
                    {data.data.map((post) => (
                      <PostCard post={post} key={post.id} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="Experiência" className="mt-0">
                  <div className="divide-y">
                    <MockPostCard
                      content={`🔥 Sua jornada fortalece a Alcateia.
Compartilhe como você aplica o Modo Caverna na vida real:
hábitos, rotinas, vitórias e renascimentos.
Sua transformação acende o caminho para outros Cavernosos.`}
                    />
                    {data.data
                      .filter((post) => post.category === 'Experiência')
                      .map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="Indicações" className="mt-0">
                  <div className="divide-y">
                    <MockPostCard
                      content={`📚 Descobriu algo que elevou sua mente ou sua rotina?
Compartilhe aqui: livros, conteúdos e ferramentas.
O que fortalece um, fortalece toda a Alcateia. 🔺🐺`}
                    />
                    {data.data
                      .filter((post) => post.category === 'Indicações')
                      .map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="Oportunidades" className="mt-0">
                  <div className="divide-y">
                    <MockPostCard
                      content={`🚀 A Caverna é solo fértil para novas alianças.
Aqui você divulga vagas, projetos, parcerias, collabs e freelas.
Se busca talentos, convoque. 
Se oferece valor, apresente suas habilidades.
A Alcateia prospera quando cada lobo fortalece o outro. 🔺🐺`}
                    />
                    {data.data
                      .filter((post) => post.category === 'Oportunidades')
                      .map((post) => (
                        <PostCard key={post.id} post={post} />
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
        {data &&
          data.data.length > 0 &&
          (currentTab === 'Geral' ||
            data.data.filter((post) => post.category === currentTab).length >
              0) &&
          page < data.last_page && (
            <Button
              variant="outline"
              onClick={loadMore}
              className="mt-6"
              disabled={buttonLoading}
            >
              Carregar mais
            </Button>
          )}
      </div>
    </UpgradeModalTrigger>
  )
}
