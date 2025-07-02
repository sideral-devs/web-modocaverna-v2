'use client'
import { CategoryChart } from '@/components/charts/category-chart'
import { Card } from '@/components/ui/card'
import { ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMoney, parseMoney } from '@/lib/utils'
import { useMemo } from 'react'

const chartConfig = {
  receita_fixa: {
    label: 'Fixo',
  },
  receita_variavel: {
    label: 'Variável',
  },
} satisfies ChartConfig

const COLORS = ['#FF3333', '#B91C1C', '#991B1B', '#7F1D1D']

export default function PieExpenseCard({
  transactions,
  isFetching,
}: {
  transactions: Transaction[]
  isFetching: boolean
}) {
  const summedCategories = useMemo(() => {
    let colorIndex = 0
    const grouped: Record<
      string,
      { category: string; value: number; fill: string }
    > = transactions.reduce(
      (acc, transaction) => {
        const category = transaction.categoria
          ? transaction.categoria
          : 'Sem categoria'
        const value = parseMoney(transaction.valor)

        if (!acc[category]) {
          acc[category] = {
            category,
            value: 0,
            fill: COLORS[colorIndex],
          }
          if (colorIndex + 1 >= COLORS.length) {
            colorIndex = 0
          } else {
            colorIndex += 1
          }
        }

        acc[category].value += value
        return acc
      },
      {} as Record<string, { category: string; value: number; fill: string }>,
    )

    return Object.values(grouped)
  }, [transactions])

  if (isFetching) {
    return <Skeleton className="flex flex-col w-full h-96" />
  }

  if (transactions.length === 0) {
    return (
      <Card className="flex flex-col w-full md:h-96 gap-1 relative">
        <div className="flex w-full p-5">
          <span className="flex py-2 px-3 border rounded-full text-xs uppercase">
            Gastos por Categoria
          </span>
        </div>

        <div className="absolute inset-0 flex rounded-xl flex-col items-center justify-center p-4 gap-3  z-50 backdrop-blur-xl">
          <p className="text-xl font-semibold text-center max-w-80">
            Faça seu registro de custos
          </p>
          <span className="text-sm text-zinc-400 text-center max-w-80">
            Cadastre um valor para detalhar suas finanças
          </span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col w-full md:h-96 gap-1">
      <div className="flex w-full p-5">
        <span className="flex py-2 px-3 border rounded-full text-xs uppercase">
          Gastos por Categoria
        </span>
      </div>
      <div className="flex flex-1 max-w-full max-h-full min-h-0 flex-col md:flex-row items-center p-6 gap-8">
        <CategoryChart
          chartData={summedCategories}
          chartConfig={chartConfig}
          className="flex-1 max-w-full min-w-0 aspect-auto h-full"
        />
        <div className="flex md:hidden lg:flex flex-col flex-1 w-full max-h-64 gap-4 overflow-y-scroll scrollbar-minimal">
          {summedCategories.map((category) => (
            <div
              key={category.category}
              className="flex py-5 gap-2 border-b last:border-0"
            >
              <div
                className="w-2 h-2 rounded-[2px]"
                style={{
                  backgroundColor: category.fill,
                }}
              />
              <div className="flex flex-col gap-3">
                <p className="text-xs">{category.category}</p>
                <span className="text-zinc-400">
                  {formatMoney(category.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
