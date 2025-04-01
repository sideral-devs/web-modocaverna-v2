'use client'
import { PostCard } from '@/components/community/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { SiInstagram } from '@icons-pack/react-simple-icons'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Linkedin, Pen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useState } from 'react'
import { EditProfileDialog } from './edit-profile-dialog'

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [isOpen, setIsOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const response = await api.get('/posts/user/' + id)
      return response.data as PostDTO
    },
    enabled: !!id,
  })

  const { data: user, refetch } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: async () => {
      const response = await api.get(`/perfil-comunidade/show/` + id)
      return response.data as UserProfile
    },
    enabled: !!id,
  })

  return (
    <div>
      <div className="grid grid-cols-1 xl:flex gap-6">
        <div className="h-fit xl:min-w-[390px] relative rounded-lg border overflow-hidden">
          {user && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Pen
                  size={16}
                  className="absolute top-2 right-2 cursor-pointer"
                />
              </DialogTrigger>
              <EditProfileDialog
                profile={user}
                refetch={refetch}
                setIsOpen={setIsOpen}
              />
            </Dialog>
          )}

          <div className="h-32 bg-muted">
            <Image
              src={
                user?.banner
                  ? env.NEXT_PUBLIC_PROD_URL + user?.banner
                  : '/images/bg.webp'
              }
              alt="Cover image"
              width={600}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col xl:items-center relative px-4 pb-4">
            <div className="absolute -top-12 left-4 xl:left-1/2 xl:-translate-x-1/2">
              <div className="rounded-full relative border-4 border-background overflow-hidden h-20 w-20">
                {user ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={
                        user.foto_perfil
                          ? `${env.NEXT_PUBLIC_PROD_URL}${user.foto_perfil}`
                          : undefined
                      }
                    />
                    <AvatarFallback className="uppercase">
                      {user.nickname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Skeleton className="absolute inset-0 rounded-full" />
                )}
              </div>
            </div>
            {user ? (
              <div className="flex flex-col w-full xl:items-center pt-10 gap-4">
                <div className="flex flex-col xl:max-w-60  gap-4">
                  <h2 className="text-xl font-semibold xl:text-center">
                    {user.nickname}
                  </h2>
                  <p className="text-xs xl:text-sm text-zinc-400 xl:text-center">
                    {user.biography || (
                      <span className="text-[10px] text-zinc-600">
                        Sem descrição
                      </span>
                    )}
                  </p>
                </div>
                {user.biography && (user.instagram || user.linkedin) && (
                  <div className="w-full h-[1px] bg-border mt-4" />
                )}

                <div className="flex flex-col w-full p-4 gap-6">
                  {user.instagram && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <SiInstagram className="h-4 w-4 mr-2" />
                        <Link
                          href={`${user.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Instagram
                        </Link>
                      </div>
                      <ArrowUpRight className="text-primary w-5 h-5" />
                    </div>
                  )}
                  {user.linkedin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2" />
                        <Link
                          href={`${user.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          linkedin
                        </Link>
                      </div>
                      <ArrowUpRight className="text-primary w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full xl: items-center pt-10 gap-4"></div>
            )}
          </div>
        </div>

        <div className="w-full flex-1 border rounded-lg overflow-hidden">
          {data ? (
            <Tabs defaultValue="general" className="w-full ">
              <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
                <TabsTrigger
                  value="general"
                  className="p-4 relative data-[state=active]:bg-transparent group"
                >
                  Geral
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
                <TabsTrigger
                  value="experiences"
                  className="p-4 relative data-[state=active]:bg-transparent group"
                >
                  Experiências
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
                <TabsTrigger
                  value="indications"
                  className="p-4 relative data-[state=active]:bg-transparent group"
                >
                  Indicações
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
                <TabsTrigger
                  value="opportunities"
                  className="p-4 relative data-[state=active]:bg-transparent group"
                >
                  Oportunidades
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-6 transition-all duration-200" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-0">
                <div>
                  {data.data.length > 0 ? (
                    data.data.map((post) => (
                      <div key={post.id} className="border-b">
                        <PostCard post={post} />
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhum post encontrado
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="experiences" className="mt-0">
                <div>
                  {data.data.filter((post) => post.category === 'Experiência')
                    .length > 0 ? (
                    data.data
                      .filter((post) => post.category === 'Experiência')
                      .map((post) => (
                        <div key={post.id} className="border-b">
                          <PostCard post={post} />
                        </div>
                      ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhum post encontrado
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="indications" className="mt-0">
                <div>
                  {data.data.filter((post) => post.category === 'Indicações')
                    .length > 0 ? (
                    data.data
                      .filter((post) => post.category === 'Indicações')
                      .map((post) => (
                        <div key={post.id} className="border-b">
                          <PostCard post={post} />
                        </div>
                      ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhum post encontrado
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="mt-0">
                <div>
                  {data.data.filter((post) => post.category === 'Oportunidades')
                    .length > 0 ? (
                    data.data
                      .filter((post) => post.category === 'Oportunidades')
                      .map((post) => (
                        <div key={post.id} className="border-b">
                          <PostCard post={post} />
                        </div>
                      ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      Nenhum post encontrado
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
      </div>
    </div>
  )
}
