'use client'
import { SidebarMenuTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/user-dropdown'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'
import { AlarmClock, MenuIcon, StoreIcon, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { UpgradeDialogTrigger } from './UpgradeDialog'

export function CentralHubHeader() {
  const { data: user } = useUser()
  if (!user) {
    return null
  }
  const dataDeCompra = dayjs(user.data_de_compra)
  const dataMaisSeteDias = dataDeCompra.add(7, 'day')
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
      <div className="flex items-center  gap-3">
        {/** USE CASE DO USUÁRIO TRIAL */}
        {user.plan === 'TRIAL' && (
          <>
            {user.data_de_renovacao &&
            dayjs(user.data_de_renovacao) < dayjs() ? (
              <div className="flex bg-[#503e04]  rounded-xl  px-1 gap-2 items-center justify-center">
                <Link href="settings/plans">
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
                  <UpgradeDialogTrigger>
                    <Button
                      variant="secondary"
                      className="hidden md:flex rounded-xl text-primary"
                    >
                      <Zap
                        fill="#FF3333"
                        color="#FF3333"
                        width={11}
                        height={15}
                      ></Zap>
                      UPGRADE
                    </Button>
                  </UpgradeDialogTrigger>
                </div>
              </div>
            ) : (
              <div className="flex bg-[#503e04] rounded-lg  px-1 gap-2 items-center justify-center">
                <Link href="settings/plans">
                  <div className="flex flex-row md:flex  items-center justify-center px-1 py-2 rounded-xl  text-white">
                    <div className="pl-2">
                      <AlarmClock color="#e9b208" />
                    </div>

                    <div className="flex flex-col pl-4">
                      <div className=" flex flex-row text-normal">
                        <span className="text-normal"> Avaliação gratuita</span>
                        <span className="text-primary pl-1 font-semibold text-normal">
                          {`encerra em ${dayjs(user.data_de_renovacao).diff(
                            dayjs(),
                            'days',
                          )} dias`}
                        </span>
                      </div>
                      <p className="text-xs ">
                        Faça o upgrade para continuar explorando todas as
                        ferramentas.
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="px-2 py-2">
                  <UpgradeDialogTrigger>
                    <Button
                      variant="secondary"
                      className="hidden md:flex rounded-xl text-primary"
                    >
                      <Zap
                        fill="#FF3333"
                        color="#FF3333"
                        width={11}
                        height={15}
                      ></Zap>
                      UPGRADE
                    </Button>
                  </UpgradeDialogTrigger>
                </div>
              </div>
            )}
          </>
        )}
        {/** USE CASE DO USUÁRIO DESAFIO */}
        {user.plan === 'DESAFIO' && (
          <>
            {user.data_de_compra && dataMaisSeteDias >= dayjs() ? (
              <div className="flex bg-[#503e04] rounded-lg  px-1 gap-2 items-center justify-center">
                <Link href="settings/plans">
                  <div className="flex flex-row md:flex  items-center justify-center px-1 py-2 rounded-xl  text-white">
                    <div className="pl-2">
                      <AlarmClock color="#e9b208" />
                    </div>

                    <div className="flex flex-col pl-4">
                      <div className=" flex flex-row text-normal">
                        <span className="text-normal"> Avaliação gratuita</span>
                        <span className="text-primary pl-1 font-semibold text-normal">
                          {`encerra em ${dayjs(dataMaisSeteDias).diff(
                            dayjs(),
                            'days',
                          )} dias`}
                        </span>
                      </div>
                      <p className="text-xs ">
                        Faça o upgrade para continuar explorando todas as
                        ferramentas.
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="px-2 py-2">
                  <UpgradeDialogTrigger>
                    <Button
                      variant="secondary"
                      className="hidden md:flex rounded-xl text-primary"
                    >
                      <Zap
                        fill="#FF3333"
                        color="#FF3333"
                        width={11}
                        height={15}
                      ></Zap>
                      UPGRADE
                    </Button>
                  </UpgradeDialogTrigger>
                </div>
              </div>
            ) : (
              <div className="flex bg-[#503e04]  rounded-lg  px-1 gap-2 items-center justify-center">
                <Link href="settings/plans">
                  <div className="flex flex-row md:flex  items-center justify-center px-1 py-2 rounded-xl  text-white">
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
                <div className="px-2 py-2">
                  <UpgradeDialogTrigger>
                    <Button
                      variant="secondary"
                      className="hidden md:flex rounded-xl text-primary"
                    >
                      <Zap
                        fill="#FF3333"
                        color="#FF3333"
                        width={11}
                        height={15}
                      ></Zap>
                      UPGRADE
                    </Button>
                  </UpgradeDialogTrigger>
                </div>
              </div>
            )}
          </>
        )}
        {/** USE CASE DO USUÁRIO ANUAL, TRIAL , Ticto */}
        {(user.plan === 'ANUAL' ||
          user.plan === 'MENSAL' ||
          user.plan === 'Ticto') && (
          <>
            {user.data_de_renovacao &&
              dayjs(user.data_de_renovacao) < dayjs() && (
                <div className="flex bg-[#503e04]  rounded-lg  px-1 gap-2 items-center justify-center">
                  <Link href="settings/plans">
                    <div className="flex flex-row md:flex  items-center justify-center px-1 py-2 rounded-xl  text-white">
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
                  <div className="px-2 py-2">
                    <UpgradeDialogTrigger>
                      <Button
                        variant="secondary"
                        className="hidden md:flex rounded-xl text-primary"
                      >
                        <Zap
                          fill="#FF3333"
                          color="#FF3333"
                          width={11}
                          height={15}
                        ></Zap>
                        UPGRADE
                      </Button>
                    </UpgradeDialogTrigger>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* <a href="https://redirect.lifs.app/loja-mc" target="_blank"> */}
        <div className="hidden lg:flex h-11 items-center justify-center bg-card px-5 gap-2 rounded-xl">
          <StoreIcon className="text-red-500" size={20} />
          <span className="text-sm">Loja Caverna</span>
          <div className="flex px-1 py-[2px] border border-red-500 rounded-sm">
            <span className="text-[10px] text-red-500">EM BREVE</span>
          </div>
        </div>
        {/* </a> */}
        <UserDropdown />
      </div>
    </header>
  )
}
