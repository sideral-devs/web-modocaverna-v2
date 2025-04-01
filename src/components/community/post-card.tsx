'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { cn, formatTimeAgo } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Ellipsis, MessageSquareMore, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { CategoryText } from './category-text'
import { AxiosError } from 'axios'
import { useUser } from '@/hooks/queries/use-user'

interface PostCardProps {
  post: Post
  isReply?: boolean
}

export function PostCard({ post, isReply = false }: PostCardProps) {
  const queryClient = useQueryClient()
  const [liked, setLiked] = useState(post.user_likeed)
  const [likeCount, setLikeCount] = useState(post.likes)
  const { data: user } = useUser()

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
        toast.error('Não foi possível deletar o post.')
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

      queryClient.invalidateQueries({ queryKey: ['posts'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setLikeCount(likesRollback)
      setLiked(likedRollback)
    }
  }

  return (
    <Card
      className={cn(
        'border-x-0 rounded-none shadow-none bg-transparent relative',
        isReply ? 'ml-12 border-t-0' : '',
      )}
    >
      <CardContent className="p-4">
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
              <Link
                href={`/comunidade/post/${post.id}`}
                className="text-base whitespace-pre-wrap"
              >
                {post.content}
              </Link>
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
                    className="w-full h-auto"
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
                <CategoryText category={post.category} />
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
