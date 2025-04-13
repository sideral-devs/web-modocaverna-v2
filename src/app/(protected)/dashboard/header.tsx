'use client'
import { SidebarMenuTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/user-dropdown'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'
import { AlarmClock, MenuIcon, StoreIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { UpgradeDialogTrigger } from './UpgradeDialog'

export function CentralHubHeader() {
  const { data: user } = useUser()
  if (!user) {
    return null
  }
  return (
    <header className="flex w-full max-w-8xl items-center justify-between px-5">
      <div className="hidden lg:flex items-center gap-3">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
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
      <div className="flex items-center gap-3">
        {user.plan === 'TRIAL' && (
          <Link href="settings/plans">
            {(() => {
              const remaining = dayjs(user.data_de_renovacao).diff(
                dayjs(),
                'days',
              )
              return remaining > 1 ? (
                <div className="hidden md:flex h-11 items-center justify-center px-5 gap-2 rounded-xl bg-[#713F12] text-[#F9CB15]">
                  <AlarmClock size={20} />
                  <span className="text-sm">
                    {(() => {
                      const remaining = dayjs(user.data_de_renovacao).diff(
                        dayjs(),
                        'days',
                      )
                      return remaining > 1
                        ? ` Sua Avaliação encerra em ${remaining} dias`
                        : `${remaining} dia`
                    })()}
                  </span>
                </div>
              ) : (
                <div className="hidden md:flex h-11 items-center justify-center px-5 gap-2 rounded-xl bg-[#713F12] text-[#F9CB15]">
                  <AlarmClock size={20} />
                  <span className="text-sm">
                    Renove seu acesso clicando aqui!
                  </span>
                </div>
              )
            })()}
          </Link>
        )}
        {user.plan === 'TRIAL' && (
          <UpgradeDialogTrigger>
            <Button
              variant="secondary"
              className="hidden md:flex rounded-xl text-primary"
            >
              Upgrade
            </Button>
          </UpgradeDialogTrigger>
        )}
        {user.plan === 'DESAFIO' && (
          <Link href="settings/plans">
            {(() => {
              const remaining = dayjs(user.data_de_renovacao).diff(
                dayjs(),
                'days',
              )
              return remaining > 1 ? (
                <div className="hidden md:flex h-11 items-center justify-center px-5 gap-2 rounded-xl bg-[#713F12] text-[#F9CB15]">
                  <AlarmClock size={20} />
                  <span className="text-sm">
                    {(() => {
                      const remaining = dayjs(user.data_de_renovacao).diff(
                        dayjs(),
                        'days',
                      )
                      return remaining > 1
                        ? ` Sua avaliação encerra em ${remaining} dias`
                        : ` Sua avaliação encerra em ${remaining} dia`
                    })()}
                  </span>
                </div>
              ) : (
                <div className="hidden md:flex h-11 items-center justify-center px-5 gap-2 rounded-xl bg-[#713F12] text-[#F9CB15]">
                  <AlarmClock size={20} />
                  <span className="text-sm">
                    Renove seu acesso clicando aqui!
                  </span>
                </div>
              )
            })()}
          </Link>
        )}
        {user.plan === 'DESAFIO' && (
          <UpgradeDialogTrigger>
            <Button
              variant="secondary"
              className="hidden md:flex rounded-xl text-primary"
            >
              Upgrade
            </Button>
          </UpgradeDialogTrigger>
        )}
        {/* <div className="hidden lg:flex h-11 items-center justify-center bg-card px-5 pl-1 gap-2 rounded-xl">
          <div className="flex items-center justify-center w-9 h-9 border border-zinc-700 rounded-[10px]">
            <Image
              src={'/icons/cave_store.svg'}
              width={20}
              height={20}
              alt="Troféu"
            />
          </div>
          <span className="text-sm">Cave Store</span>
          <div className="flex px-1 py-[2px] border border-red-500 rounded-sm">
            <span className="text-[10px] text-red-500">EM BREVE</span>
          </div>
        </div> */}
        <a href="https://www.sejacaverna.com" target="_blank">
          <div className="hidden lg:flex h-11 items-center justify-center bg-card px-5 gap-2 rounded-xl">
            <StoreIcon className="text-red-500" size={20} />
            <span className="text-sm">Loja Caverna</span>
            <div className="flex px-1 py-[2px] border border-red-500 rounded-sm">
              <span className="text-[10px] text-red-500">EM BREVE</span>
            </div>
          </div>
        </a>
        <UserDropdown />
      </div>
    </header>
  )
}
