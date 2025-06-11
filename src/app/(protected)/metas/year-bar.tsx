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
            'bg-cyan-400',
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 bottom-1/2 left-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full',
            isHalfwayYear ? 'bg-cyan-400' : 'border-2 border-zinc-800',
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 bottom-1/2 right-0 -translate-y-1/2 w-[7px] h-[7px] rounded-full',
            isLastDay ? 'bg-cyan-400' : 'border-2 border-zinc-800',
          )}
        />
        <div
          className="absolute h-[1px] bg-gradient-to-r from-cyan-400 to-cyan-400/25"
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
        <span className="w-full text-xs text-left text-cyan-400">
          1 Janeiro
        </span>
        <span
          className={cn(
            'w-full text-xs text-center',
            isHalfwayYear ? 'text-cyan-400' : 'text-zinc-600',
          )}
        >
          30 Junho
        </span>
        <span
          className={cn(
            'w-full text-xs text-right',
            isLastDay ? 'text-cyan-400' : 'text-zinc-600',
          )}
        >
          31 Dezembro
        </span>
      </div>
    </div>
  )
}
