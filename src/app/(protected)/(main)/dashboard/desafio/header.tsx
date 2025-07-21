'use client'
import { SidebarMenuTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/user-dropdown'
import { useUser } from '@/hooks/queries/use-user'
import { DollarSign, MenuIcon, StoreIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { UpgradeCardHeader } from '../UpgradeCardHeader'
import { AffiliateDialogTrigger } from '../dialogs/AffiliateDialog'

export function DesafioDashboardHeader() {
  const { data: user } = useUser()

  if (!user) {
    return null
  }

  return (
    <header className="flex w-full max-w-8xl items-center justify-between px-5">
      <div className="hidden lg:flex items-center gap-2">
        <Link href="/dashboard/desafio/members-area">
          <div className="flex h-11 items-center justify-center px-3 rounded-xl">
            <Image
              src={'/icons/logo-completo.svg'}
              alt="Logo"
              width={130}
              height={40}
            />
          </div>
        </Link>
      </div>
      <SidebarMenuTrigger>
        <div className="flex lg:hidden h-11 items-center justify-center bg-card px-3 rounded-xl">
          <MenuIcon className="text-primary" />
        </div>
      </SidebarMenuTrigger>
      <UpgradeCardHeader />
      <div className="flex items-center gap-2">
        <AffiliateDialogTrigger>
          <Button
            variant="outline"
            className="hidden lg:flex h-11 items-center group justify-center px-5 gap-2 rounded-xl transition-all duration-200"
          >
            <DollarSign className="text-primary" />
          </Button>
        </AffiliateDialogTrigger>
        <Link href="https://redirect.lifs.app/loja-mc" target="_blank">
          <div className="hidden lg:flex h-11 items-center group hover:bg-red-500 justify-center bg-card px-5 gap-2 rounded-xl">
            <StoreIcon
              className="text-red-500 group-hover:text-white"
              size={20}
            />
            <span className="text-sm">Loja Caverna</span>
          </div>
        </Link>
        <UserDropdown />
      </div>
    </header>
  )
}
