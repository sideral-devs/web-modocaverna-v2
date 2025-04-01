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

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const chartConfig = {
  on: {
    label: 'Minutos',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export function ProductivityChart({ className }: { className?: string }) {
  const { data } = useQuery({
    queryKey: ['pomodoro-chart'],
    queryFn: async () => {
      const response = await api.get('/pomodoro/chart?period=week')
      return response.data as { produtividade: number[] }
    },
  })

  const formatChart = (chartData: { produtividade: number[] }) => {
    return chartData.produtividade.map((value, index) => {
      const minutes = (value / 60).toFixed(2)
      return {
        day: days[index],
        on: parseFloat(minutes),
      }
    })
  }

  if (!data) {
    return (
      <div className="flex flex-col flex-1 gap-3">
        <Skeleton className="w-full h-4 rounded bg-zinc-900" />
        <Skeleton className="w-2/3 h-3 rounded bg-zinc-900" />
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={cn('flex-1', className)}>
      <BarChart accessibilityLayer data={formatChart(data)}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar
          dataKey="on"
          stackId="a"
          fill="var(--primary)"
          radius={[0, 0, 4, 4]}
          label="Minutos"
          background={{ fill: '#000' }}
        />
      </BarChart>
    </ChartContainer>
  )
}
