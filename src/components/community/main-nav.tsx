'use client'

import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Bell, Home, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export function MainNav() {
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
    <div className="flex flex-col h-full">
      <nav className="space-y-2 mb-8">
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
                'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-xl relative',
                isActive ? 'border' : 'hover:bg-secondary/50',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.showBadge && !isLoading && notifications > 0 && (
                <Badge className="absolute top-auto bottom-auto right-3 bg-red-500 h-5 text-xs w-7">
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
