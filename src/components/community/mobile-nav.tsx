'use client'

import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Bell, Home, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNav() {
  const pathname = usePathname()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const response = await api.get('/post-notifications/not-read/user')
      const numNotifications = response.data.total

      return numNotifications
    },
  })

  const navItems = [
    {
      name: 'Início',
      href: '/comunidade',
      icon: Home,
    },
    {
      name: 'Notificações',
      href: '/comunidade/notifications',
      icon: Bell,
      showBadge: true,
    },
    {
      name: 'Perfil',
      href: '/comunidade/profile',
      icon: User,
    },
  ]

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 h-14 border-t bg-zinc-900">
      <nav className="grid grid-cols-3 flex-1 w-full p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/comunidade'
              ? pathname === '/comunidade'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-xl',
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'fill-white' : '')} />

              {item.showBadge && !isLoading && notifications > 0 && (
                <Badge className="absolute w-[5px] p-2 h-[10px] rounded-full top-0 left-[48%]  bg-red-500 text-white flex justify-center text-[10px]">
                  {notifications}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
