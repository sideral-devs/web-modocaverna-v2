'use client'
import { FinanceChart } from '@/components/charts/finance-chart'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { formatMoney } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { DollarSign } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  totalPaid,
  totalReceived,
  totalToPay,
  totalToReceive,
} from '../../financeiro/utils'

export default function FinanceCard() {
  const [walletMessages, setWalletMessage] = useState('')
  const today = dayjs().format('YYYY-MM-DD')
  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }
  const messagesWallet = [
    'Você não tem transações para hoje.',
    'Nenhuma transação registrada para hoje.',
    'Sem movimentações financeiras registradas hoje.',
    'Não há registros para hoje. Registre novas transações.',
    'Nada registrado para hoje. Adicione suas transações.',
  ]
  useEffect(() => {
    setWalletMessage(getMessageForTime(messagesWallet))
    setInterval(() => {
      setWalletMessage(getMessageForTime(messagesWallet))
    }, 1200000)
  }, [])

  const { data: transactions } = useQuery({
    queryKey: ['transactions', today],
    queryFn: async () => {
      const response = await api.get('/datatables/financeiro-transacoes', {
        params: {
          date_field: 'data',
          date_start: today,
          date_end: today,
          sortby_keyword: 'data',
        },
      })
      return response.data as Transaction[]
    },
  })
  const totalReceivedAmount = useMemo(
    () => totalReceived(transactions || []),
    [transactions],
  )
  const totalPaidAmount = useMemo(
    () => totalPaid(transactions || []),
    [transactions],
  )
  const totalToReceiveAmount = useMemo(
    () => totalToReceive(transactions || []),
    [transactions],
  )
  const totalToPayAmount = useMemo(
    () => totalToPay(transactions || []),
    [transactions],
  )

  if (!transactions) {
    return <Skeleton className="flex flex-col w-full flex-1 min-h-[300px]" />
  }
  if (transactions?.length === 0) {
    return (
      <Card className="flex flex-col w-full flex-1 min-h-[300px] p-4 gap-4 relative overflow-hidden">
        <CardHeader className="flex absolute left-0 right-0 px-4 justify-between">
          <div className="flex w-fit items-center px-3 py-2 gap-[6px] border border-emerald-400 rounded-full">
            <DollarSign className="text-emerald-400" size={12} />
            <span className="text-[10px] text-emerald-400 font-semibold">
              MINHAS FINANÇAS
            </span>
          </div>
          <span className="flex py-2 px-6 border rounded-full text-xs">
            Hoje
          </span>
        </CardHeader>
        <div className="flex flex-row items-center justify-center flex-1 gap-4 w-full mt-10 pl-2">
          <Image
            src="/images/empty-states/empty_wallet.png"
            alt="Nenhum objetivo encontrado"
            width={100}
            height={110}
            className="opacity-50"
          />
          <div className="flex flex-col gap-4 w-[40dvh]">
            <p className="text-center text-[13px] text-zinc-500">
              {walletMessages}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-auto">
          <Link href={'/financeiro'}>
            <Button size="sm">Ver Finanças</Button>
          </Link>
        </div>
      </Card>
    )
  }
  if (
    !totalReceivedAmount &&
    !totalPaidAmount &&
    !totalToReceiveAmount &&
    !totalToPayAmount
  ) {
    return (
      <Card className="flex flex-col w-full flex-1 min-h-[300px] p-4 gap-4 relative overflow-hidden">
        <CardHeader className="flex absolute left-0 right-0 px-4 justify-between">
          <div className="flex w-fit items-center px-3 py-2 gap-[6px] border border-emerald-400 rounded-full">
            <DollarSign className="text-emerald-400" size={12} />
            <span className="text-[10px] text-emerald-400 font-semibold">
              MINHAS FINANÇAS
            </span>
          </div>
          <span className="flex py-2 px-6 border rounded-full text-xs">
            Hoje
          </span>
        </CardHeader>
        <div className="flex flex-col items-center flex-1 justify-center gap-4">
          <Image
            src={'/images/logo-icon.svg'}
            alt="Logo"
            width={26}
            height={22}
          />
          <p className="text-center text-[13px] text-zinc-500">
            Você não tem transações para hoje
          </p>
          <div className="flex justify-end mt-auto">
            <Link href={'/financeiro'}>
              <Button size="sm">Ver Finanças</Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col w-full flex-1 min-h-[300px] p-4 gap-4 relative overflow-hidden">
      <CardHeader className="flex absolute left-0 right-0 px-4 justify-between">
        <div className="flex w-fit items-center px-3 py-2 gap-[6px] border border-emerald-400 rounded-full">
          <DollarSign className="text-emerald-400" size={12} />
          <span className="text-[8px] text-emerald-400 font-semibold">
            MINHAS FINANÇAS
          </span>
        </div>
        <span className="flex py-2 px-6 border rounded-full text-xs">Hoje</span>
      </CardHeader>
      <div className="flex max-w-full flex-row  h-full justify-between items-center p-6 gap-2">
        <FinanceChart
          className="flex-1 relative right-10 max-w-[45vw] min-w-0 h-full"
          balance={
            totalReceivedAmount +
            totalToReceiveAmount -
            totalPaidAmount -
            totalToPayAmount
          }
          chartData={[
            {
              type: 'payments',
              value: totalPaidAmount + totalToPayAmount,
              fill: 'var(--primary)',
            },
            {
              type: 'receipts',
              fill: '#34D298',
              value: totalToReceiveAmount + totalReceivedAmount,
            },
          ]}
        />
        <div className="flex flex-col relative right-4 max-w-[4vw]  flex-1 gap-4">
          <div className="flex gap-2">
            <div className="min-w-2 min-h-2 w-2 h-2 rounded-[2px] bg-emerald-400" />
            <div className="flex flex-col gap-2">
              <p className="text-[13px]">Recebimentos</p>
              <span className="text-zinc-400">
                {formatMoney(totalReceivedAmount + totalToReceiveAmount)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="min-w-2 min-h-2 w-2 h-2 rounded-[2px] bg-red-500" />
            <div className="flex flex-col gap-3">
              <p className="text-[13px]">Pagamentos</p>
              <span className="text-zinc-400">
                {formatMoney(totalPaidAmount + totalToPayAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Link href="/financeiro" className="absolute right-4 bottom-4">
        <Button size="sm">Acompanhar Finanças</Button>
      </Link>
    </Card>
  )
}
