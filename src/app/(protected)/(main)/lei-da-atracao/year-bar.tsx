'use client'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useMemo } from 'react'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

export default function YearBar() {
  const { dayPercent, isHalfwayYear, isLastDay } = useMemo(() => {
    const today = dayjs()
    const startOfYear = dayjs().startOf('year')
    const endOfYear = dayjs().endOf('year')
    const totalDays = endOfYear.diff(startOfYear, 'day')
    const daysPassed = today.diff(startOfYear, 'day')
    const dayPercent = ((daysPassed / totalDays) * 100).toFixed(2)

    const june30 = dayjs().set('month', 5).set('date', 30).startOf('day')
    const december31 = dayjs().set('month', 11).set('date', 31)

    const isHalfwayYear = today.isAfter(june30)
    const isLastDay = today.isSame(december31)

    return { dayPercent, isHalfwayYear, isLastDay }
  }, [])

  return (
    <div className="flex flex-col w-full gap-4 relative">
      <span
        className="w-fit text-xs text-primary -translate-x-1/2"
        style={{
          marginLeft: `${dayPercent}%` || '0%',
        }}
      >
        Você
      </span>
      <div className="flex relative w-full">
        <div className="flex w-full h-[1px] bg-gradient-to-r from-zinc-700 to-black" />
        <div className="flex w-full h-[1px] bg-gradient-to-l from-zinc-700 to-black" />
        <div
          className={cn(
            'absolute left-0 top-1/2 bottom-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full',
            'bg-red-500',
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 bottom-1/2 left-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full',
            isHalfwayYear ? 'bg-red-500' : 'border-2 border-zinc-800',
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 bottom-1/2 right-0 -translate-y-1/2 w-[7px] h-[7px] rounded-full',
            isLastDay ? 'bg-red-500' : 'border-2 border-zinc-800',
          )}
        />
        <div
          className="absolute h-[1px] bg-gradient-to-r from-red-500 to-red-500/25"
          style={{
            width: `${dayPercent}%` || '0%',
          }}
        />
        <div
          className="absolute top-1/2 bottom-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary"
          style={{
            left: `${dayPercent}%` || '0%',
          }}
        />
      </div>
      <div className="flex w-full items-center">
        <span className="w-full text-xs text-left text-red-500">1 Janeiro</span>
        <span
          className={cn(
            'w-full text-xs text-center',
            isHalfwayYear ? 'text-red-500' : 'text-zinc-600',
          )}
        >
          30 Junho
        </span>
        <span
          className={cn(
            'w-full text-xs text-right',
            isLastDay ? 'text-red-500' : 'text-zinc-600',
          )}
        >
          31 Dezembro
        </span>
      </div>
    </div>
  )

  // return (
  //   <div className="flex flex-row h-full gap-4 relative">
  //     <div className="flex flex-col h-full items-center relative">
  //       <span
  //         className="absolute text-xs text-primary -translate-y-1/2"
  //         style={{
  //           bottom: `${dayPercent}%` || '0%',
  //         }}
  //       >
  //         Você
  //       </span>

  //       {/* Linha vertical de fundo */}
  //       <div className="absolute h-full w-[1px] bg-gradient-to-b from-zinc-700 to-black" />
  //       <div className="absolute h-full w-[1px] bg-gradient-to-t from-zinc-700 to-black" />

  //       {/* Pontos */}
  //       <div
  //         className={cn(
  //           'absolute left-1/2 -translate-x-1/2 top-0 w-[7px] h-[7px] rounded-full',
  //           'bg-red-500',
  //         )}
  //       />
  //       <div
  //         className={cn(
  //           'absolute left-1/2 -translate-x-1/2 top-1/2 w-[7px] h-[7px] rounded-full',
  //           isHalfwayYear ? 'bg-red-500' : 'border-2 border-zinc-800',
  //         )}
  //       />
  //       <div
  //         className={cn(
  //           'absolute left-1/2 -translate-x-1/2 bottom-0 w-[7px] h-[7px] rounded-full',
  //           isLastDay ? 'bg-red-500' : 'border-2 border-zinc-800',
  //         )}
  //       />

  //       {/* Barra de progresso */}
  //       <div
  //         className="absolute w-[1px] bg-gradient-to-b from-red-500 to-red-500/25"
  //         style={{
  //           height: `${dayPercent}%` || '0%',
  //           bottom: 0,
  //         }}
  //       />

  //       {/* Indicador do progresso atual */}
  //       <div
  //         className="absolute w-[7px] h-[7px] rounded-full bg-primary left-1/2 -translate-x-1/2"
  //         style={{
  //           bottom: `${dayPercent}%` || '0%',
  //         }}
  //       />
  //     </div>

  //     {/* Labels de datas */}
  //     <div className="flex flex-col justify-between h-full text-xs">
  //       <span className="text-red-500">1 Janeiro</span>
  //       <span className={isHalfwayYear ? 'text-red-500' : 'text-zinc-600'}>30 Junho</span>
  //       <span className={isLastDay ? 'text-red-500' : 'text-zinc-600'}>31 Dezembro</span>
  //     </div>
  //   </div>
  // )
}
