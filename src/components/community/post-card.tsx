'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { cn, formatTimeAgo } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Ellipsis, MessageSquareMore, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { CategoryText } from './category-text'

interface PostCardProps {
  post: Post
  isReply?: boolean
  updatePosts?: (post: Post) => void
}

export function PostCard({
  post,
  isReply = false,
  updatePosts,
}: PostCardProps) {
  const queryClient = useQueryClient()
  const [liked, setLiked] = useState(post.user_likeed)
  const [likeCount, setLikeCount] = useState(post.likes)
  const { data: user } = useUser()
  const router = useRouter()

  const { data: author } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get(`/perfil-comunidade/user`)
      return response.data as UserProfile
    },
  })

  function handleDestroyPost() {
    try {
      api.delete(`/posts/destroy/${post.id}`).then(() => {
        toast.success('Post deletado com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      })
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Não foi possível excluir o post.')
      }
    }
  }

  async function handleLike() {
    const likesRollback = likeCount
    const likedRollback = liked

    try {
      setLiked(!liked)
      if (liked) {
        setLikeCount((prev) => prev - 1)
        await api.delete(`/post-interactions/destroy/${String(post.id)}/LIKE`)
      } else {
        setLikeCount((prev) => prev + 1)

        await api.post('/post-interactions/store', {
          post_id: String(post.id),
          interaction: 'LIKE',
          // interaction: liked ? 'UNLIKE' : 'LIKE',
        })
        if (!post.user_viewed) {
          await api.post('/post-interactions/store', {
            post_id: String(post.id),
            interaction: 'VIEW',
            // interaction: liked ? 'UNLIKE' : 'LIKE',
          })
        }
      }
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setLikeCount(likesRollback)
      setLiked(likedRollback)
    }
  }

  async function handleChangeCategory(category: Post['category']) {
    try {
      await api.put('/posts/update/' + post.id, {
        content: post.content,
        midia: post.midia || undefined,
        category,
      })

      if (updatePosts) {
        updatePosts({ ...post, category })
      }
    } catch (err) {
      console.log(err)
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <Card
      onClick={(e) => {
        const target = e.target as HTMLElement
        const isInteractive =
          target.closest('a') ||
          target.closest('button') ||
          target.closest('svg') ||
          target.closest('img')
        if (!isInteractive) {
          router.push(`/comunidade/post/${post.id}`)
        }
      }}
      className={cn(
        'border-x-0 rounded-none shadow-none bg-transparent relative cursor-pointer',
        isReply ? 'ml-12 border-t-0' : '',
      )}
    >
      <CardContent className="p-4">
        <div
          className="appearance-none p-0 m-0 border-none bg-transparent w-full text-left cursor-inherit"
          tabIndex={-1}
          style={{ all: 'unset', width: '100%', display: 'block' }}
          aria-label="Abrir post"
        >
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage
                src={
                  post.author?.foto_perfil
                    ? `${env.NEXT_PUBLIC_PROD_URL}${post.author.foto_perfil}`
                    : ''
                }
              />
              <AvatarFallback className="uppercase">
                {post.author?.nickname.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-3 w-full">
                <div className="flex items-center gap-3 text-sm">
                  <Link
                    href={`/comunidade/profile/${post.author?.id}`}
                    className="hover:underline"
                  >
                    {post.author?.nickname}
                  </Link>
                  <span className="text-muted-foreground">
                    {formatTimeAgo(post.created_at)}
                  </span>
                </div>
                {(post.perfil_id === author?.id || user?.plan === 'ADMIN') && (
                  <div className="flex gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Ellipsis
                          size={20}
                          className="text-zinc-500 cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-52 p-1 bg-zinc-800 rounded-lg text-xs"
                      >
                        {/* <button
                      onClick={handleDestroyPost}
                      className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                    >
                      Editar
                    </button> */}

                        <button
                          onClick={handleDestroyPost}
                          className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          Excluir
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <div className="text-base whitespace-pre-wrap">
                  {post.content.split(/(\s+)/).map((word, i) => {
                    const isUrl = /^https?:\/\/\S+$/.test(word)
                    return isUrl ? (
                      <Link
                        key={i}
                        href={word}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline break-all"
                      >
                        {word}
                      </Link>
                    ) : (
                      word
                    )
                  })}
                </div>
              </div>
              <div className="mt-3">
                {post.midia &&
                  Array.isArray(post.midia) &&
                  post.midia.length > 0 &&
                  post.midia.map((src) => (
                    <Image
                      key={src}
                      src={env.NEXT_PUBLIC_PROD_URL + src}
                      alt="Imagem enviada"
                      width={400}
                      height={300}
                      className="h-[32rem] w-auto min-w-96 object-cover rounded"
                    />
                  ))}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-8 text-muted-foreground mt-6">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Image
                      src={'/icons/views.svg'}
                      alt="views"
                      width={16}
                      height={16}
                    />
                    {post.views}
                  </div>

                  <button
                    className={cn(
                      'flex items-center gap-1 hover:text-red-500',
                      liked ? 'text-red-500' : 'text-muted-foreground',
                    )}
                    onClick={handleLike}
                  >
                    <ThumbsUp
                      className="h-4 w-4"
                      fill={liked ? 'currentColor' : 'none'}
                    />
                    <span className="text-xs">{likeCount}</span>
                  </button>
                  <Link href={`/comunidade/post/${post.id}`}>
                    <div className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                      <MessageSquareMore className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </div>
                  </Link>
                </div>
                <div className="flex items-end justify-items-start">
                  {user?.plan === 'ADMIN' ? (
                    <Popover>
                      <PopoverTrigger>
                        <CategoryText category={post.category} />
                      </PopoverTrigger>
                      <PopoverContent className="w-[140px] p-1">
                        {['Experiência', 'Indicações', 'Oportunidades']
                          .filter((item) => item !== post.category)
                          .map((item, i) => (
                            <PopoverClose key={i}>
                              <p
                                className="p-1.5 text-sm hover:bg-zinc-700 rounded cursor-pointer"
                                onClick={() =>
                                  handleChangeCategory(item as Post['category'])
                                }
                              >
                                {item}
                              </p>
                            </PopoverClose>
                          ))}
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <CategoryText category={post.category} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* {post.category && (
        <CategoryText
          className="absolute right-3 top-3"
          category={post.category}
        />
      )} */}
    </Card>
  )
}
