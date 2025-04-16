'use client'
import { AffiliateChart } from '@/components/charts/affiliate-chart'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { formatMoney } from '@/lib/utils'
import { useAffiliateStore } from '@/store/affiliate-store'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowUpRight,
  CircleDollarSignIcon,
  FileOutputIcon,
  GlobeIcon,
  LucideIcon,
  MapIcon,
  Settings,
  TrophyIcon,
  Users,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AffiliateCodeDialogTrigger } from './dialogs/affiliate-code'
import { CommissionPlanDialogTrigger } from './dialogs/commission-plan'
import { PlateDialogTrigger } from './dialogs/plate'
import { PublicMapDialogTrigger } from './dialogs/public-map'
import { AffiliatesHeader } from './header'
import { TutorialAffiliateDialogTrigger } from './tutorial-affilate'

const DigitalMarketing = dynamic(
  () => import('../members-area/sell-strategy'),
  {
    loading: () => <Skeleton className="w-full h-96" />,
  },
)

export default function Page() {
  const { code: affiliateCode } = useAffiliateStore()

  const { data } = useQuery({
    queryKey: ['indication', affiliateCode],
    queryFn: async () => {
      const response = await api.get('/indique/show/' + affiliateCode)
      return response.data as AffiliateDTO
    },
    enabled: !!affiliateCode,
  })

  return (
    <ProtectedRoute level="non-trial">
      {/* <UpgradeModalTrigger> */}
      <TutorialAffiliateDialogTrigger />
      <div className="flex flex-col w-full min-h-screen items-center gap-8 md:gap-16 overflow-y-auto scrollbar-minimal">
        <AffiliatesHeader />
        <section className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-8xl gap-6 p-4">
          <div className="flex flex-col gap-3">
            <Card className="flex flex-col w-full h-96 py-8 px-7">
              {data ? (
                <div className="flex flex-col w-full h-full flex-1 gap-3">
                  <div className="flex flex-row items-center justify-between h-auto w-full  px-2 py-2">
                    <span className="text-xs md:text-base text-zinc-400 font-semibold">
                      Vendas nos{' '}
                      <span className="text-white">últimos 7 dias</span>
                    </span>
                    <AffiliateCodeDialogTrigger code={affiliateCode}>
                      <Settings
                        size={20}
                        className="text-zinc-400 cursor-pointer"
                      />
                    </AffiliateCodeDialogTrigger>
                  </div>

                  <AffiliateChart
                    className="flex-1 max-w-full max-h-full overflow-hidden"
                    data={data.valoresUltimosSeteDias}
                  />
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <span className="text-xs md:text-base text-zinc-400 font-semibold">
                    Vendas nos{' '}
                    <span className="text-white">últimos 7 dias</span>
                  </span>
                  <div className="flex flex-col flex-1 items-center justify-center gap-3">
                    <h2 className="text-xl font-semibold">
                      Métricas Afiliação
                    </h2>
                    <p className="w-80 text-zinc-400 text-sm text-center tracking-wide">
                      Para visualizar seu desempenho adicione o seu código de
                      afiliação.
                    </p>
                    <AffiliateCodeDialogTrigger code={affiliateCode}>
                      <Button className="mt-5" size="sm">
                        Inserir código
                      </Button>
                    </AffiliateCodeDialogTrigger>
                  </div>
                </div>
              )}
            </Card>
            <div className="hidden md:grid grid-cols-4 flex-1 gap-2">
              <Card className="flex flex-col min-h-24 justify-center py-4 px-5 gap-4">
                <p className="font-semibold text-sm text-emerald-400">Hoje</p>
                <span className="font-semibold">
                  {formatMoney(data?.valorHoje || 0)}
                </span>
              </Card>
              <Card className="flex flex-col min-h-24 justify-center py-4 px-5 gap-4">
                <p className="font-semibold text-sm text-yellow-400">Ontem</p>
                <span className="font-semibold">
                  {formatMoney(data?.valorOntem || 0)}
                </span>
              </Card>
              <Card className="flex flex-col min-h-24 justify-center py-4 px-5 gap-4">
                <p className="font-semibold text-sm text-emerald-400">
                  Mês atual
                </p>
                <span className="font-semibold">
                  {formatMoney(data?.valorMesAtual || 0)}
                </span>
              </Card>
              <Card className="flex flex-col min-h-24 justify-center py-4 px-5 gap-4">
                <p className="font-semibold text-sm text-emerald-400">Total</p>
                <span className="font-semibold truncate">
                  {formatMoney(data?.valorTotal || 0)}
                </span>
              </Card>
            </div>
            <Card className="flex flex-col md:hidden items-center py-6 gap-6 bg-zinc-900">
              <span className="flex px-4 py-2 rounded-full border text-[10px] uppercase">
                Vendas
              </span>
              <Table>
                <TableBody>
                  <TableRow className="border-b">
                    <TableCell className="text-zinc-400 py-7 text-xs">
                      Hoje
                    </TableCell>
                    <TableCell className="text-right text-sm p-7">
                      {formatMoney(data?.valorHoje || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="text-zinc-400 py-7 text-xs">
                      Ontem
                    </TableCell>
                    <TableCell className="text-right text-sm p-7">
                      {formatMoney(data?.valorOntem || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="text-zinc-400 py-7 text-xs">
                      Mês atual
                    </TableCell>
                    <TableCell className="text-right text-sm p-7">
                      {formatMoney(data?.valorMesAtual || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="text-zinc-400 py-7 text-xs">
                      Total
                    </TableCell>
                    <TableCell className="text-right text-sm p-7">
                      {formatMoney(data?.valorTotal || 0, 'K')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
          <div className="grid grid-cols-2 grid-rows-3 gap-2">
            <CommissionPlanDialogTrigger>
              <Card className="flex flex-col w-full h-24 md:h-40 items-start justify-center p-4 md:p-8 gap-6 relative cursor-pointer">
                <CircleDollarSignIcon className="scale-75 md:scale-100 text-primary" />
                <p className="text-xs md:text-base font-semibold truncate">
                  Solicite a sua Afiliação
                </p>
              </Card>
            </CommissionPlanDialogTrigger>
            {/* <LeadFluxDialogTrigger>
              <Card className="flex flex-col w-full h-24 md:h-40 items-start justify-center p-4 md:p-8 gap-6 relative cursor-pointer">
                <Users className="scale-75 md:scale-100 text-primary" />
                <p className="text-xs md:text-base font-semibold truncate">
                  Grupo no Whatsapp
                </p>
              </Card>
            </LeadFluxDialogTrigger> */}
            <AffiliateDashLink
              icon={Users}
              title="Grupo no Whatsapp"
              href="https://chat.whatsapp.com/F7KQFLZUTD59m5D7ou8udY"
            />
            <PublicMapDialogTrigger>
              <Card className="flex flex-col w-full h-24 md:h-40 items-start justify-center p-4 md:p-8 gap-6 relative cursor-pointer">
                <MapIcon className="scale-75 md:scale-100 text-primary" />
                <p className="text-xs md:text-base font-semibold truncate">
                  Mapa do Público Alvo
                </p>
              </Card>
            </PublicMapDialogTrigger>
            <AffiliateDashLink
              icon={FileOutputIcon}
              title="Materiais de Divulgação"
              href="https://redirect.lifs.app/drive-af-cc"
            />
            <PlateDialogTrigger>
              <Card className="flex flex-col w-full h-24 md:h-40 items-start justify-center p-4 md:p-8 gap-6 relative cursor-pointer">
                <TrophyIcon className="scale-75 md:scale-100 text-primary" />
                <p className="text-xs md:text-base font-semibold truncate">
                  Placas de Reconhecimento
                </p>
              </Card>
            </PlateDialogTrigger>
            <AffiliateDashLink
              icon={GlobeIcon}
              title="Suporte para o afiliado"
              href="https://api.whatsapp.com/send?phone=557382446098"
            />
          </div>
        </section>
        {/* <div className="w-full h-1 bg-zinc-800" /> */}
        {/* <section className="flex flex-col w-full max-w-8xl gap-6 p-4">
          <h2 className="text-xl font-semibold">Confira as transmissões</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 relative">
            <div className="flex flex-col h-[275px] p-4 gap-4 bg-zinc-900 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-semibold">
                  Assista novamente
                </span>
                <span className="px-2 py-1 bg-zinc-700 rounded text-[10px]">
                  TRANSMITIDO
                </span>
              </div>
              <div className="flex flex-col flex-1 max-w-96 justify-center px-12 gap-4">
                <VideoIcon fill="#A0A0A9" strokeWidth={0} />
                <h3 className="text-xl font-semibold">
                  Live de Introdução as vendas no WhatsApp
                </h3>
                <div className="flex items-center gap-2">
                  <PersonStandingIcon size={20} />
                  <span className="font-semibold text-xs text-zinc-400">
                    Maria Juliah
                  </span>
                </div>
              </div>
              <Link href="#" className="ml-auto">
                <Button className="block" size="sm">
                  Assistir novamente
                </Button>
              </Link>
            </div>
            <div className="flex flex-col h-[275px] p-4 gap-4 bg-zinc-900 rounded-xl">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 font-semibold">
                    Assista novamente
                  </span>
                  <span className="flex items-center px-2 py-1 bg-cyan-700 rounded text-[10px] text-cyan-400 gap-1">
                    <AlarmClockIcon size={14} />
                    TRANSMITIDO
                  </span>
                </div>
                <span className="px-2 py-1 bg-primary rounded text-[10px]">
                  LIVE
                </span>
              </div>
              <div className="flex flex-col flex-1 max-w-96 justify-center px-12 gap-4">
                <VideoIcon fill="#A0A0A9" strokeWidth={0} />
                <h3 className="text-xl font-semibold">
                  Live de Introdução as vendas no WhatsApp
                </h3>
                <div className="flex items-center gap-2">
                  <PersonStandingIcon size={20} />
                  <span className="font-semibold text-xs text-zinc-400">
                    Maria Juliah
                  </span>
                </div>
              </div>
              <Link href="#" className="ml-auto">
                <Button className="block" size="sm" variant="success">
                  Reservar vaga
                </Button>
              </Link>
            </div>
            <div className="hidden md:block absolute w-[2px] h-[18px] top-1/2 right-1/2 bottom-1/2 left-1/2 bg-zinc-600" />
          </div>
        </section> */}
        <div className="w-full h-1 bg-zinc-800" />
        <section className="flex flex-col w-full max-w-8xl gap-6 p-4 pb-32">
          <h2 className="text-xl font-semibold">Estratégias de vendas</h2>
          <DigitalMarketing />
        </section>
      </div>
      {/* </UpgradeModalTrigger> */}
    </ProtectedRoute>
  )
}

function AffiliateDashLink({
  icon,
  title,
  href,
}: {
  icon: LucideIcon
  title: string
  href: string
}) {
  const Icon = icon

  return (
    <Link href={href} target="_blank">
      <Card className="flex flex-col w-full h-24 md:h-40 items-start justify-center p-4 md:p-8 gap-6 relative cursor-pointer">
        <Icon className="scale-75 md:scale-100 text-primary" />
        <p className="text-xs md:text-base font-semibold truncate">{title}</p>

        <ArrowUpRight className="hidden md:block absolute top-6 right-4" />
      </Card>
    </Link>
  )
}
