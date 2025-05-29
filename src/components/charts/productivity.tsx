// 'use client'
// import { ChartConfig, ChartContainer } from '@/components/ui/chart'
// import { api } from '@/lib/api'
// import { cn } from '@/lib/utils'
// import { useQuery } from '@tanstack/react-query'
// import { Bar, BarChart, XAxis, YAxis } from 'recharts'
// import { Skeleton } from '../ui/skeleton'

// const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// const chartConfig = {
//   productivity: {
//     label: 'Produtividade',
//     color: 'var(--primary)',
//   },
//   study: {
//     label: 'Estudos',
//     color: 'var(--primary-muted)',
//   },
// } satisfies ChartConfig

// export function ProductivityChart({ className }: { className?: string }) {
//   const { data } = useQuery({
//     queryKey: ['pomodoro-chart'],
//     queryFn: async () => {
//       const response = await api.get('/pomodoro/chart?period=week')
//       return response.data as { produtividade: number[]; estudos: number[] }
//     },
//   })

//   const formatChart = (dados: {
//     produtividade: number[]
//     estudos: number[]
//   }) => {
//     return dados.produtividade.map((value, index) => {
//       const productivityMinutes = value
//       const studyMinutes = dados.estudos[index]
//       return {
//         day: days[index],
//         productivity: productivityMinutes,
//         study: studyMinutes,
//       }
//     })
//   }

//   if (!data) {
//     return (
//       <div className="flex flex-col flex-1 gap-3">
//         <Skeleton className="w-full h-4 rounded bg-zinc-900" />
//         <Skeleton className="w-2/3 h-3 rounded bg-zinc-900" />
//       </div>
//     )
//   }

//   return (
//     <ChartContainer config={chartConfig} className={cn('flex-1', className)}>
//       <BarChart data={formatChart(data)}>
//         {/* <ChartTooltip
//           cursor={false}
//           content={<ChartTooltipContent hideLabel />}
//         /> */}
//         <XAxis
//           dataKey="day"
//           tickLine={false}
//           tickMargin={10}
//           axisLine={false}
//           tickFormatter={(value) => value.slice(0, 3)}
//         />
//         <YAxis
//           tickLine={false}
//           axisLine={false}
//           tickFormatter={(value) => {
//             const minutes = Math.floor(value / 60)
//             const seconds = value % 60
//             return minutes > 0 ? `${minutes}m` : `${seconds}s`
//           }}
//           domain={[0, 3600]}
//         />
//         <Bar
//           dataKey="productivity"
//           stackId="a"
//           fill="var(--primary)"
//           background={{ fill: '#000' }}
//           label={({ x, y, value, width }) => {
//             const minutes = Math.floor(value / 60)
//             const seconds = value % 60
//             const formatted =
//               minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

//             return (
//               <text
//                 x={x! + width! / 2}
//                 y={y! - 5}
//                 textAnchor="middle"
//                 fill="#fff"
//                 fontSize={12}
//               >
//                 {formatted}
//               </text>
//             )
//           }}
//         />
//         <Bar
//           dataKey="study"
//           stackId="b"
//           fill="#1447E6"
//           background={{ fill: '#000' }}
//           label={({ x, y, value, width }) => {
//             const minutes = Math.floor(value / 60)
//             const seconds = value % 60
//             const formatted =
//               minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

//             return (
//               <text
//                 x={x! + width! / 2}
//                 y={y! - 5}
//                 textAnchor="middle"
//                 fill="#fff"
//                 fontSize={12}
//               >
//                 {formatted}
//               </text>
//             )
//           }}
//         />
//       </BarChart>
//     </ChartContainer>
//   )
// }
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
  productivity: {
    label: 'Produtividade',
    color: 'var(--primary)',
  },
  study: {
    label: 'Estudos',
    color: 'var(--primary-muted)',
  },
} satisfies ChartConfig

export function ProductivityChart({ className }: { className?: string }) {
  const { data } = useQuery({
    queryKey: ['pomodoro-chart'],
    queryFn: async () => {
      const response = await api.get('/pomodoro/chart?period=week')
      return response.data as { produtividade: number[]; estudos: number[] }
    },
  })

  const formatChart = (chartData: {
    produtividade: number[]
    estudos: number[]
  }) => {
    return chartData.produtividade.map((value, index) => {
      const minutes = value / 60 /// se voce deixar o floor aqui qualquer valor que fique abaixo de 1 ele vai jogar pra baixo como zero , e zero não plota gráfico.
      const studyMinutes = chartData.estudos[index] / 60
      return {
        day: days[index],
        productivity: minutes,
        study: studyMinutes,
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
          dataKey="productivity"
          stackId="a"
          fill="var(--primary)"
          label="Produtividade"
          background={{ fill: '#000' }}
        />
        <Bar dataKey="study" stackId="a" fill="#1447E6" label="Estudos" />
      </BarChart>
    </ChartContainer>
  )
}
