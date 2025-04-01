'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn, formatMoney } from '@/lib/utils'
import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'

// const chartData = [
//   { type: 'payments', value: 2000, fill: 'var(--primary)' },
//   { type: 'receipts', value: 30000, fill: '#34D298' },
// ]

// const chartConfig = {
//   payments: {
//     label: 'Pagamentos',
//     color: 'var(--primary)',
//   },
//   receipts: {
//     label: 'Recebimentos',
//     color: '#34D298',
//   },
// } satisfies ChartConfig

export function CategoryChart({
  chartData,
  chartConfig,
  className,
}: {
  chartData: { category: string; value: number }[]
  chartConfig: ChartConfig
  className?: string
}) {
  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  return (
    <ChartContainer config={chartConfig} className={cn(className)}>
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="category"
          innerRadius={72}
          strokeWidth={3}
          paddingAngle={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 12}
                      className="text-xs fill-muted-foreground md:text-base"
                    >
                      Total
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 6}
                      className="text-xs fill-foreground font-medium md:text-base"
                    >
                      {formatMoney(total)}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
