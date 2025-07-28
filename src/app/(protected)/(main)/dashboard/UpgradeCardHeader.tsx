'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'
import { AlarmClock, Zap, ZapIcon } from 'lucide-react'
import Link from 'next/link'
import { UpgradeDialogDuringSevenDays } from './dialogs/UpgradeDialogDuringSevenDays'
import { UpgradeDialogExpired } from './UpgradeDialogExpired'
import { UpgradeDialogExpiredTrial } from './UpgradeDialogExpiredTrial'

export function UpgradeCardHeader() {
  const { data: user } = useUser()

  if (!user) {
    return null
  }

  const purchaseDate = dayjs(user.data_de_compra)
  const nextSevenDays = purchaseDate.add(7, 'day')
  // const remainingHours = dayjs(nextSevenDays).diff(dayjs(), 'hour')
  // const remainingDays = Math.ceil(remainingHours / 24)
  const remainingHoursTrial = dayjs(user.data_de_renovacao).diff(
    dayjs(),
    'hour',
  )
  const remainingDaysTrial = Math.ceil(remainingHoursTrial / 24)

  return (
    <div className="flex items-center gap-2">
      {/** USE CASE DO USUÁRIO TRIAL */}
      {user.plan === 'TRIAL' &&
        (user.status_plan === 'EXPIRADO' ? (
          <div className="flex md:flex-row bg-[#503e04]  rounded-xl  px-1 gap-2 items-center justify-center">
            <Link href="/settings/plans" prefetch={false}>
              <div className="flex flex-row md:flex  items-center justify-center px-1 py-2 rounded-xl  text-white">
                <div className="flex flex-col pl-4">
                  <div>
                    <span className="text-normal">Assine o</span>
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
          <div className="flex max-w-sm lg:max-w-[600px] bg-card rounded-lg px-4 py-2 gap-3 items-center justify-center">
            <Link href="settings/plans" prefetch={false}>
              <div className="flex w-full items-center justify-center text-white">
                {/* <div className="pl-2">
                    <AlarmClock color="#e9b208" />
                  </div> */}

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-row text-normal">
                    <span className="text-green-600">
                      Seu acesso ao Desafio Caverna está ativo por 1 ano
                    </span>
                  </div>
                  <p className="text-[10px]">
                    Durante os primeiros 7 dias, você testa o Plano Cavernoso
                    completo.
                  </p>
                  {/* <span className="text-[10px] text-yellow-500">
                    Faltam {remainingDays} dia(s) para decidir
                  </span> */}
                </div>
              </div>
            </Link>
            <div className="flex">
              <UpgradeDialogDuringSevenDays>
                <Button
                  className="flex rounded-xl text-[10px] pulsating-shadow lg:max-w-32 gap-1 px-2"
                  size="sm"
                >
                  <ZapIcon className="fill-white" size={16} />
                  <span className="w-full break-words whitespace-normal text-[10px] uppercase">
                    Fazer upgrade com desconto
                  </span>
                </Button>
              </UpgradeDialogDuringSevenDays>
            </div>
          </div>
        ) : (
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
  )
}
