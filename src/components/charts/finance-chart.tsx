'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn, formatMoney } from '@/lib/utils'
import { Label, Pie, PieChart } from 'recharts'

const chartConfig = {
  payments: {
    label: 'Pagamentos',
    color: 'var(--primary)',
  },
  receipts: {
    label: 'Recebimentos',
    color: '#34D298',
  },
} satisfies ChartConfig

export function FinanceChart({
  chartData,
  className,
  balance,
}: {
  chartData: { type: string; value: number; fill: string }[]
  balance: number
  className: string
}) {
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
          nameKey="type"
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
                      className="text-[13px] mb-4 fill-muted-foreground md:text-base"
                    >
                      Total
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 6}
                      className="text-[13px] fill-foreground font-medium md:text-base"
                    >
                      {formatMoney(balance)}
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
