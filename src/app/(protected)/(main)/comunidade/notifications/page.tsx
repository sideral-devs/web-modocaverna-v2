'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { formatTimeAgo } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function NotificationsPage() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/post-notifications/user')
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] })
      return res.data as NotificationDTO
    },
  })

  return (
    <div className="flex flex-col w-full flex-1 sm:border rounded-lg">
      <div className="border-b">
        {data ? (
          <div className="flex items-center p-4 gap-2">
            <h1 className="text-xl">Notificações</h1>
            <p className="text-xl text-zinc-400">{data.total}</p>
          </div>
        ) : (
          <div className="p-4">
            <Skeleton className="w-36 h-6" />
          </div>
        )}
      </div>

      <div className="divide-y">
        {data
          ? data.data.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-muted/50">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-0.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`${env.NEXT_PUBLIC_PROD_URL}${notification?.sender?.foto_perfil}`}
                        />
                        <AvatarFallback>
                          {notification.sender.nickname?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm xl:text-base">
                        <Link
                          href={`/comunidade/profile/${notification.sender.id}`}
                          className="text-primary"
                        >
                          {notification.sender.nickname}
                        </Link>{' '}
                        <Link href={`/comunidade/post/${notification.post_id}`}>
                          {notification.message.split(' ').slice(1).join(' ')}
                        </Link>
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-10">
                      {formatTimeAgo(notification.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          : Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex flex-col w-full p-4">
                <Skeleton className="w-1/3 h-3" />
              </div>
            ))}
      </div>
    </div>
  )
}
