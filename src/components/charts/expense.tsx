'use client'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, XAxis } from 'recharts'
import { Skeleton } from '../ui/skeleton'

import { getRevenueExpenses } from '@/app/(protected)/(main)/financeiro/utils'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const months = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const chartConfig = {
  revenue: {
    label: 'Receita',
  },
  expense: {
    label: 'Despesas',
  },
} satisfies ChartConfig

export function ExpenseChart({
  className,
  year = dayjs().year(),
}: {
  className?: string
  year?: number
}) {
  const { data } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/datatables/financeiro-transacoes')
      return response.data as Transaction[]
    },
  })

  const formatChart = (chartData: Transaction[]) => {
    return months.map((month, index) => {
      const monthTransactions = chartData.filter(({ data }) => {
        const transactionDate = dayjs(data, 'DD/MM/YYYY')
        const transactionMonth = transactionDate.month()
        return transactionMonth === index && transactionDate.year() === year
      })

      const { revenue, expense } = getRevenueExpenses(monthTransactions)

      return { month, revenue, expense }
    })
  }

  if (!data) {
    return (
      <div className="flex flex-col fl ex-1 gap-3">
        <Skeleton className="w-full h-4 rounded bg-zinc-900" />
        <Skeleton className="w-2/3 h-3 rounded bg-zinc-900" />
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={cn('flex-1', className)}>
      <BarChart accessibilityLayer data={formatChart(data)}>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar
          dataKey="revenue"
          stackId="a"
          fill="#34D298"
          radius={[0, 0, 4, 4]}
          label="Receita"
          background={{ fill: '#000' }}
          isAnimationActive={false}
        />
        <Bar
          dataKey="expense"
          stackId="a"
          fill="#FF3333"
          radius={[4, 4, 0, 0]}
          label="Despesa"
          isAnimationActive={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  )
}
