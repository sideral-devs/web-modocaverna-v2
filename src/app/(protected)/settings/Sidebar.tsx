'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { DollarSign, LayoutDashboard, MenuIcon } from 'lucide-react'
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
    // {
    //   name: 'Histórico Desafio Caverna',
    //   href: '/historico-desafio',
    //   icon: HistoryIcon,
    // },
  ]

  if (!user) return null

  return (
    <>
      <div className="hidden lg:flex flex-col gap-6">
        <div className="flex items-center gap-3 pl-3">
          {user.user_foto && !imageError ? (
            <Avatar className="w-9 h-9 bg-red-500 border border-red-500">
              <AvatarImage
                src={`${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}`}
                onError={() => setImageError(true)}
              />
              <AvatarFallback>
                <div className="flex w-9 h-9 items-center justify-center bg-primary px-3 rounded-xl">
                  <span className="text-2xl">{user.name[0]}</span>
                </div>
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex w-9 h-9 items-center justify-center bg-primary px-3 rounded-xl cursor-pointer">
              <span className="text-2xl">{user.name[0]}</span>
            </div>
          )}
          <span className="text-base">{user.name}</span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-base font-medium pl-3">
            Configurações Gerais
          </span>
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
                  <Icon size={20} />
                  <span className="text-sm font-medium">{navItem.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="flex lg:hidden absolute top-7 h-11 items-center justify-center bg-card px-3 rounded-xl">
              <MenuIcon className="text-primary" />
            </div>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col px-4 py-12 gap-6 bg-zinc-800 overflow-y-auto scrollbar-minimal"
          >
            <SheetHeader className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 pl-3">
                {user.user_foto && !imageError ? (
                  <Avatar className="w-9 h-9 bg-red-500 border border-red-500">
                    <AvatarImage
                      src={`${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}`}
                      onError={() => setImageError(true)}
                    />
                    <AvatarFallback>
                      <div className="flex w-9 h-9 items-center justify-center bg-primary px-3 rounded-xl">
                        <span className="text-2xl">{user.name[0]}</span>
                      </div>
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex w-9 h-9 items-center justify-center bg-primary px-3 rounded-xl cursor-pointer">
                    <span className="text-2xl">{user.name[0]}</span>
                  </div>
                )}
                <span className="text-base">{user.name}</span>
              </div>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <span className="text-base font-medium pl-3">
                Configurações Gerais
              </span>
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
                      <Icon size={20} />
                      <span className="text-sm font-medium">
                        {navItem.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
