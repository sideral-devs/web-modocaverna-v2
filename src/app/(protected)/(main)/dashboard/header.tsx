'use client'
import { SidebarMenuTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/user-dropdown'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'
import {
  AlarmClock,
  MenuIcon,
  MessageCircleQuestion,
  StoreIcon,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UpgradeDialogDuringSevenDays } from './UpgradeDialogDuringSevenDays'
import { UpgradeDialogExpired } from './UpgradeDialogExpired'
import { UpgradeDialogExpiredTrial } from './UpgradeDialogExpiredTrial'

export function CentralHubHeader({
  setTab,
}: {
  setTab: (arg: string) => void
}) {
  const { data: user } = useUser()
  const router = useRouter()

  if (!user) {
    return null
  }

  const purchaseDate = dayjs(user.data_de_compra)
  const nextSevenDays = purchaseDate.add(7, 'day')
  const remainingHours = dayjs(nextSevenDays).diff(dayjs(), 'hour')
  const remainingDays = Math.ceil(remainingHours / 24)
  const remainingHoursTrial = dayjs(user.data_de_renovacao).diff(
    dayjs(),
    'hour',
  )
  const remainingDaysTrial = Math.ceil(remainingHoursTrial / 24)

  return (
    <header className="flex w-full max-w-8xl items-center justify-between px-5">
      <div className="hidden lg:flex items-center gap-2">
        <Link
          href="/dashboard?to=central-caverna"
          onClick={() => setTab('central-caverna')}
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
      <div className="flex items-center gap-2">
        {/** USE CASE DO USUÁRIO TRIAL */}
        {user.plan === 'TRIAL' &&
          (user.status_plan === 'EXPIRADO' ? (
            <div className="flex md:flex-row bg-[#503e04]  rounded-xl  px-1 gap-2 items-center justify-center">
              <Link href="/settings/plans" prefetch={false}>
                <div className="flex flex-row md:flex  items-center justify-center px-1 py-2 rounded-xl  text-white">
                  <div className="flex flex-col pl-4">
                    <div>
                      <span className="text-normal"> Assine o</span>
                      <span className="text-normal text-primary">
                        {' '}
                        Plano Cavernoso{' '}
                      </span>
                    </div>

                    <p className="text-[10px]">
                      Acesso Ilimitado a todas as ferramentas do sistema
                    </p>
                  </div>
                </div>
              </Link>
              <div className="px-2 py-2">
                <UpgradeDialogExpiredTrial>
                  <Button
                    variant="secondary"
                    className="hidden md:flex rounded-xl text-primary pulsating-shadow"
                  >
                    <Zap
                      fill="#FF3333"
                      color="#FF3333"
                      width={11}
                      height={15}
                    ></Zap>
                    UPGRADE
                  </Button>
                </UpgradeDialogExpiredTrial>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row bg-[#503e04] rounded-lg  px-1 gap-2 items-center justify-center">
              <Link href="settings/plans" prefetch={false}>
                <div className="flex flex-row md:flex  items-center justify-center p-2 md:py-2 rounded-xl  text-white">
                  <div className="md:pl-2">
                    <AlarmClock color="#e9b208" />
                  </div>

                  <div className="flex flex-col pl-4">
                    <div className="flex flex-row text-normal">
                      <span className="text-xs lg:text-base text-normal">
                        Avaliação gratuita
                      </span>
                      <span className="text-xs lg:text-base text-primary pl-1 font-semibold text-normal">
                        {`encerra em ${remainingDaysTrial} dia${remainingDaysTrial > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <p className="hidden lg:block text-xs">
                      Faça o upgrade para continuar explorando todas as
                      ferramentas.
                    </p>
                  </div>
                </div>
              </Link>
              <div className="hidden md:block px-2 py-2">
                <UpgradeDialogDuringSevenDays>
                  <Button
                    variant="secondary"
                    className="rounded-xl text-primary pulsating-shadow"
                  >
                    <Zap
                      fill="#FF3333"
                      color="#FF3333"
                      width={11}
                      height={15}
                    ></Zap>
                    UPGRADE
                  </Button>
                </UpgradeDialogDuringSevenDays>
              </div>
              <div className="block md:hidden px-2 pb-4">
                <Link href="settings/plans" prefetch={false}>
                  <Button
                    variant="secondary"
                    className=" rounded-xl text-primary pulsating-shadow"
                  >
                    <Zap
                      fill="#FF3333"
                      color="#FF3333"
                      width={11}
                      height={15}
                    ></Zap>
                    UPGRADE
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        {/** USE CASE DO USUÁRIO DESAFIO */}
        {user.plan === 'DESAFIO' &&
          (user.data_de_compra && nextSevenDays.isAfter(dayjs()) ? (
            <div className="flex flex-col max-w-sm lg:max-w-xl bg-card rounded-lg px-6 py-2 gap-2 items-center justify-center">
              <Link href="settings/plans" prefetch={false}>
                <div className="flex w-full items-center justify-center text-white">
                  {/* <div className="pl-2">
                    <AlarmClock color="#e9b208" />
                  </div> */}

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row text-normal">
                      <span className="text-normal text-green-600">
                        ✅ Seu acesso ao Modo Caverna está ativo por 1 ano
                      </span>
                    </div>
                    <p className="text-sm">
                      Durante os primeiros 7 dias, você testa tudo do plano
                      Cavernoso com acesso total e pode fazer o upgrade com
                      desconto exclusivo.
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex w-full items-center justify-between">
                <span className="text-normal text-yellow-500">
                  ⏳ Faltam {remainingDays} dia(s) para decidir
                </span>
                <UpgradeDialogDuringSevenDays>
                  <Button
                    variant="secondary"
                    className="hidden md:flex rounded-xl text-primary pulsating-shadow"
                    size="sm"
                  >
                    Fazer upgrade com desconto
                  </Button>
                </UpgradeDialogDuringSevenDays>
              </div>
            </div>
          ) : (
            <div className="flex flex-col max-w-sm lg:max-w-lg bg-card rounded-lg px-6 py-2 gap-2 items-center justify-center">
              <Link href="settings/plans" prefetch={false}>
                <div className="flex w-full items-center justify-center text-white">
                  {/* <div className="pl-2">
                    <AlarmClock color="#e9b208" />
                  </div> */}
                  <div className="flex flex-col">
                    <div>
                      <span className="md:text-normal text-green-600">
                        ✅ Seu acesso ao Modo Caverna continua ativo
                      </span>
                    </div>
                    <p className="text-xs md:text-sm">
                      O período de teste do plano Cavernoso terminou. Mas o
                      desconto especial do upgrade ainda está disponível por
                      tempo limitado.
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex w-full items-center justify-end">
                <UpgradeDialogExpiredTrial>
                  <Button
                    className="flex rounded-xl text-xs md:text-normal pulsating-shadow"
                    size="sm"
                  >
                    Fazer upgrade com desconto
                  </Button>
                </UpgradeDialogExpiredTrial>
              </div>
            </div>
          ))}
        {/** USE CASE DO USUÁRIO ANUAL, TRIAL , Ticto */}
        {(user.plan === 'ANUAL' ||
          user.plan === 'MENSAL' ||
          user.plan === 'Ticto') && (
          <>
            {user.data_de_renovacao &&
              dayjs(user.data_de_renovacao) < dayjs() && (
                <div className="flex flex-col md:flex-row bg-[#503e04]  rounded-lg  px-1 gap-2 items-center justify-center">
                  <Link href="settings/plans" prefetch={false}>
                    <div className="flex flex-row  items-center justify-center px-1 py-2 rounded-xl  text-white">
                      <div className="pl-2">
                        <AlarmClock color="#e9b208" />
                      </div>
                      <div className="flex flex-col pl-4">
                        <div>
                          <span className="text-normal"> Assine o</span>
                          <span className="text-normal text-primary">
                            {' '}
                            Plano Cavernoso{' '}
                          </span>
                        </div>
                        <p className="text-xs">
                          Acesso Ilimitado a todas as ferramentas do sistema
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="block md:hidden pb-2">
                    <Link href="settings/plans" prefetch>
                      <Button
                        variant="secondary"
                        className="flex rounded-xl text-xs md:text-normal text-primary pulsating-shadow"
                      >
                        <Zap
                          fill="#FF3333"
                          color="#FF3333"
                          width={11}
                          height={15}
                        ></Zap>
                        UPGRADE
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden md:block px-2 pb-2 md:py-2">
                    <UpgradeDialogExpired>
                      <Button
                        variant="secondary"
                        className="flex rounded-xl text-xs md:text-normal text-primary pulsating-shadow"
                      >
                        <Zap
                          fill="#FF3333"
                          color="#FF3333"
                          width={11}
                          height={15}
                        ></Zap>
                        UPGRADE
                      </Button>
                    </UpgradeDialogExpired>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="hidden lg:flex h-11 items-center group justify-center px-5 gap-2 rounded-xl transition-all duration-200 hover:bg-white/90"
          onClick={() => {
            setTab('central-caverna')
            router.replace('/dashboard?startTour=true')
          }}
        >
          <MessageCircleQuestion className="text-primary" />
        </Button>
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
