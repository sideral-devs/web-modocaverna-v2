'use client'
import { SidebarMenuTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/user-dropdown'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import {
  CheckIcon,
  DollarSign,
  MenuIcon,
  ZapIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { UpgradeDialogExpiredTrial } from '../UpgradeDialogExpiredTrial'

export function DesafioDashboardHeader() {
  const { data: user } = useUser()
  const router = useRouter()

  async function handleUpgradeUser() {
    try {
      await api.post('/desafio-start-trial')

      router.replace('/dashboard')
    } catch {
      toast.error('Não foi possível fazer isso')
    }
  }

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
      {user.desafio_started_trial ? (
        <div className="flex max-w-sm lg:max-w-[600px] bg-card rounded-lg px-4 py-2 gap-3 items-center justify-center">
          <Link href="settings/plans" prefetch={false}>
            <div className="flex w-full items-center justify-center text-white">
              {/* <div className="pl-2">
                    <AlarmClock color="#e9b208" />
                  </div> */}
              <div className="flex flex-col">
                <div>
                  <span className="text-green-600">
                    Seu acesso ao Desafio Caverna continua ativo.
                  </span>
                </div>
                <p className="text-xs">
                  O teste do Plano Cavernoso com ferramentas extras terminou.
                </p>
                <span className="text-xs text-yellow-500">
                  Quer manter os recursos avançados? Aproveite o desconto!
                </span>
              </div>
            </div>
          </Link>
          <div className="flex">
            <UpgradeDialogExpiredTrial>
              <Button
                className="flex rounded-xl text-[10px] pulsating-shadow lg:max-w-32 gap-1 px-2"
                size="sm"
              >
                <ZapIcon className="fill-white" size={16} />
                <span className="w-full break-words whitespace-normal text-[10px] uppercase">
                  Fazer upgrade com desconto
                </span>
              </Button>
            </UpgradeDialogExpiredTrial>
          </div>
        </div>
      ) : (
        <div className="flex max-w-sm lg:max-w-[600px] bg-card rounded-lg px-4 py-2 gap-3 items-center justify-center">
          <Link href="settings/plans" prefetch={false}>
            <div className="flex w-full items-center justify-center gap-4">
              <div className="flex flex-col w-7 h-7 items-center justify-center bg-white rounded-full">
                <CheckIcon
                  className="text-primary"
                  size={16}
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-red-600">
                  Desbloqueie 7 dias grátis na Central Caverna
                </span>
                <p className="text-xs opacity-60">
                  Teste a Central Caverna gratuitamente por tempo limitado
                </p>
              </div>
            </div>
          </Link>
          <div className="flex">
            <Button
              className="flex rounded-xl text-[10px]  text-primary pulsating-shadow lg:max-w-32 gap-1 px-2"
              size="sm"
              variant="secondary"
              onClick={handleUpgradeUser}
            >
              <ZapIcon className="fill-primary" strokeWidth={0} size={16} />
              <span className="w-full break-words whitespace-normal text-[10px] uppercase">
                Ativar Acesso
              </span>
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Link href="/indique-e-ganhe">
          <div className="hidden lg:flex h-11 items-center group hover:bg-green-500 justify-center bg-card px-5 gap-2 rounded-xl">
            <DollarSign
              className="text-green-500 group-hover:text-white"
              size={20}
            />
            <span className="text-sm">Indique e Ganhe</span>
          </div>
        </Link>
        <UserDropdown />
      </div>
    </header>
  )
}
