'use client'
import { CreatePostForm } from '@/components/community/create-post-form'
import { PostCard } from '@/components/community/post-card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: post, refetch } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/posts/show/${id}`)
      return response.data as Post
    },
    enabled: !!id,
  })

  const { data: comments } = useQuery({
    queryKey: ['replies', id],
    queryFn: async () => {
      const response = await api.get(`/posts/show/${id}/comments`)
      return response.data as PostDTO
    },
    enabled: !!id,
  })

  function onPostUpdate(post: Post) {
    queryClient.setQueryData(['post', id], post)
    refetch()
  }

  useEffect(() => {
    if (post && !post.user_viewed) {
      api
        .post('/post-interactions/store', {
          post_id: String(post.id),
          interaction: 'VIEW',
        })
        .catch(() => {
          // Nada...
        })
    }
  }, [post])

  return (
    <div className="sm:border rounded-lg">
      <div>
        <div className="p-4 flex items-center gap-6">
          <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        </div>
      </div>

      {post ? (
        <PostCard post={post} updatePosts={onPostUpdate} />
      ) : (
        <Skeleton className="w-full h-2" />
      )}

      <CreatePostForm replyToId={id} placeholder="Digite sua resposta" />

      {comments && (
        <div className="divide-y">
          {comments.data.map((reply) => (
            <div key={reply.id}>
              <PostCard post={reply} isReply />

              {/* Nested replies */}
              {/* {nestedReplies[reply.id]?.map((nestedReply) => (
                <PostCard key={nestedReply.id} post={nestedReply} isReply />
              ))} */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
