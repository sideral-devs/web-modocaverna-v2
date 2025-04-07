'use client'

import { api } from '@/lib/api'
import { ThumbsUp } from 'lucide-react'

import { useState } from 'react'
import { toast } from 'sonner'

export function LikeButton({
  likes,
  userLiked,
  lessonId,
}: {
  likes: number
  userLiked: boolean
  lessonId: string
}) {
  const [liked, setLiked] = useState(userLiked)
  const [likeCount, setLikeCount] = useState(likes)

  async function handleClick() {
    const hasLiked = !liked
    const likesRollback = likeCount
    const likedRollback = liked

    try {
      setLiked(hasLiked)
      if (hasLiked) {
        setLikeCount((prev) => prev + 1)
      } else {
        setLikeCount((prev) => prev - 1)
      }

      await api.post('/aula-feedbacks/store', {
        aula_id: lessonId,
        status: hasLiked ? 'like' : 'dislike',
      })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setLikeCount(likesRollback)
      setLiked(likedRollback)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex h-10  3 items-center px-4 gap-2 bg-secondary  rounded-full text-zinc-500"
    >
      {liked ? (
        <ThumbsUp size={24} className="text-green-500 mb-1" />
      ) : (
        <ThumbsUp size={24} className="text-white mb-1" />
      )}
      <span className="text-sm text-white">{likeCount}</span>
    </button>
  )
}
