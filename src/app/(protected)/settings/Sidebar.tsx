'use client'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { DollarSign, HistoryIcon, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [imageError, setImageError] = useState(false)

  const { data: user } = useUser()

  const navItems = [
    {
      name: 'Informações da conta',
      href: '/settings/account',
      icon: LayoutDashboard,
    },
    {
      name: 'Planos e upgrade',
      href: '/settings/plans',
      icon: DollarSign,
    },
    {
      name: 'Histórico Desafio Caverna',
      href: '/historico-desafio',
      icon: HistoryIcon,
    },
  ]

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        {user.user_foto && !imageError ? (
          <Image
            src={`${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}`}
            width={36}
            height={36}
            className="rounded-xl"
            objectFit="cover"
            objectPosition="center"
            alt="Foto do usuário"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex w-9 h-9 items-center justify-center bg-primary px-3 rounded-xl cursor-pointer">
            <span className="text-2xl">{user.name[0]}</span>
          </div>
        )}
        <span className="text-xs">{user.name}</span>
      </div>
      <div className="flex flex-col gap-4">
        <span>Configuração geral</span>
        {navItems.map((navItem, index) => {
          const active = navItem.href === pathname
          const Icon = navItem.icon
          return (
            <Link key={index} href={navItem.href}>
              <div
                className={cn(
                  'flex items-center p-3 gap-3 text-zinc-500 rounded-xl',
                  active && 'bg-red-900 text-red-100',
                )}
              >
                <Icon size={16} />
                <span className="text-xs font-semibold">{navItem.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
