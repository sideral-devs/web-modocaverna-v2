'use client'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Bar, BarChart, XAxis } from 'recharts'
import { Skeleton } from '../ui/skeleton'

const chartConfig = {
  sales: {
    label: 'Vendas',
  },
} satisfies ChartConfig

export function AffiliateChart({
  data,
  className,
}: {
  data: AffiliateDTO['valoresUltimosSeteDias']
  className?: string
}) {
  const formatChart = (chartData: AffiliateDTO['valoresUltimosSeteDias']) => {
    return Object.entries(chartData).map(([day, sales]) => ({
      day: day.split('/')[0],
      sales,
    }))
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
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar
          dataKey="sales"
          stackId="a"
          fill="#dd4242"
          radius={[0, 0, 4, 4]}
          label="Receita"
          background={{ fill: '#000' }}
          isAnimationActive={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  )
}
