'use client'
import { Card } from '@/components/ui/card'
import { MonthYearPicker } from '@/components/ui/month-year-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn, formatMoney } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import {
  getExpenseTransactions,
  getRevenueTransactions,
  totalPaid,
  totalReceived,
  totalToPay,
  totalToReceive,
} from './utils'

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const TableDetailsCard = dynamic(() => import('./cards/table-details-card'), {
  loading: () => <Skeleton className="w-full h-[48rem]" />,
})
const PieRevenueCard = dynamic(() => import('./cards/pie-revenue-card'), {
  loading: () => <Skeleton className="w-full h-96" />,
})
const PieExpenseCard = dynamic(() => import('./cards/pie-expense-card'), {
  loading: () => <Skeleton className="w-full h-96" />,
})

export function FinanceDashboard() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'))

  const {
    data: transactions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['transactions', month],
    queryFn: async () => {
      const dateStart = dayjs(month, 'YYYY-MM').startOf('month')
      const dateEnd = dayjs(month, 'YYYY-MM').endOf('month')
      const response = await api.get('/datatables/financeiro-transacoes', {
        params: {
          date_field: 'data',
          date_start: dateStart.format('YYYY-MM-DD'),
          date_end: dateEnd.format('YYYY-MM-DD'),
          sortby_keyword: 'data',
        },
      })
      return response.data as Transaction[]
    },
  })

  const revenueTransactions = useMemo(
    () => getRevenueTransactions(transactions || []),
    [transactions],
  )
  const expenseTransactions = useMemo(
    () => getExpenseTransactions(transactions || []),
    [transactions],
  )

  return (
    <section className="flex flex-col w-full max-w-8xl items-center gap-12 p-4 pb-12">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Controle Financeiro</h1>

        <MonthYearPicker
          className="flex w-fit items-center justify-between gap-1 whitespace-nowrap rounded-full border border-zinc-600 bg-transparent px-6 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          value={dayjs(month, 'YYYY-MM').toDate()}
          onChange={(newDate) => setMonth(dayjs(newDate).format('YYYY-MM'))}
        />
      </div>
      {transactions ? (
        <div className="flex flex-col w-full gap-8">
          <div className="flex md:grid md:grid-cols-3 w-full gap-4 overflow-x-auto scrollbar-minimal">
            <Card className="flex flex-col flex-shrink-0 w-72 md:w-full md:h-48 py-4 px-3 gap-4 bg-zinc-900 border">
              <span className="flex w-fit py-2 px-3 border rounded-full text-xs uppercase">
                Futuro
              </span>
              <div className="flex flex-col gap-6 px-3">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded bg-emerald-400" />
                    <p className="text-sm xl:text-base">Total a receber</p>
                  </div>
                  <p className="text-emerald-400 text-sm xl:text-base">
                    +{formatMoney(totalToReceive(transactions))}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded bg-red-500" />
                    <p className="text-sm xl:text-base">Total a pagar</p>
                  </div>
                  <p className="text-red-500 text-sm xl:text-base">
                    -{formatMoney(totalToPay(transactions))}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="flex flex-col flex-shrink-0 w-72 md:w-full md:h-48 py-4 px-3 gap-4 bg-zinc-900 border">
              <span className="flex w-fit py-2 px-3 border rounded-full text-xs uppercase">
                Efetivado
              </span>
              <div className="flex flex-col gap-6 px-3">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded bg-emerald-400" />
                    <p className="text-sm xl:text-base">Receitas</p>
                  </div>
                  <p className="text-emerald-400 text-sm xl:text-base">
                    +{formatMoney(totalReceived(transactions))}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded bg-red-500" />
                    <p className="text-sm xl:text-base">Custos</p>
                  </div>
                  <p className="text-red-500 text-sm xl:text-base">
                    -{formatMoney(totalPaid(transactions))}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="flex flex-col flex-shrink-0 w-72 md:w-full md:h-48 py-4 px-3 gap-4 bg-zinc-900 border relative">
              <span className="absolute left-3 top-5 flex w-fit py-2 px-3 border rounded-full text-xs uppercase">
                Total
              </span>
              <div className="flex w-full flex-1 items-center justify-center">
                {(() => {
                  const value =
                    totalReceived(transactions) - totalPaid(transactions)
                  return (
                    <h3
                      className={cn(
                        'text-3xl lg:text-4xl xl:text-5xl',
                        value >= 0 ? 'text-emerald-400' : 'text-red-500',
                      )}
                    >
                      {formatMoney(value)}
                    </h3>
                  )
                })()}
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
            <TableDetailsCard
              transactions={revenueTransactions}
              month={month}
              monthString={months[dayjs(month, 'YYYY-MM').month()]}
              nextMonthString={
                months[dayjs(month, 'YYYY-MM').add(1, 'month').month()]
              }
              refetch={refetch}
              mode="revenue"
            />
            <TableDetailsCard
              transactions={expenseTransactions}
              month={month}
              monthString={months[dayjs(month, 'YYYY-MM').month()]}
              nextMonthString={
                months[dayjs(month, 'YYYY-MM').add(1, 'month').month()]
              }
              refetch={refetch}
              mode="expense"
            />
            <PieRevenueCard
              transactions={revenueTransactions}
              isFetching={isFetching}
            />
            <PieExpenseCard
              transactions={expenseTransactions}
              isFetching={isFetching}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-8">
          <div className="grid grid-cols-3 w-full gap-4">
            <Skeleton className="w-full h-48" />
            <Skeleton className="w-full h-48" />
            <Skeleton className="w-full h-48" />
          </div>
          <div className="grid grid-cols-2 w-full gap-4">
            <Skeleton className="w-full h-96" />
            <Skeleton className="w-full h-96" />
            <Skeleton className="w-full h-96" />
            <Skeleton className="w-full h-96" />
          </div>
        </div>
      )}
    </section>
  )
}
