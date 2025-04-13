'use client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
dayjs.extend(duration)

export function BoxCountdown({
  targetDate,
  onClick,
}: {
  targetDate: string | Date
  onClick: () => void
}) {
  function calculateTimeLeft() {
    const now = dayjs()
    const target = dayjs(targetDate)
    const difference = target.diff(now)

    if (difference <= 0)
      return {
        months: '00',
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      }

    const timeLeft = dayjs.duration(difference)
    const years = String(Math.floor(timeLeft.asYears())).padStart(2, '0')
    const months = String(Math.floor(timeLeft.asMonths())).padStart(2, '0')
    const days = String(timeLeft.days()).padStart(2, '0')
    const hours = String(timeLeft.hours()).padStart(2, '0')
    const minutes = String(timeLeft.minutes()).padStart(2, '0')
    const seconds = String(timeLeft.seconds()).padStart(2, '0')

    return { years, months, days, hours, minutes, seconds }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (dayjs(targetDate).isBefore(dayjs())) {
    return (
      <div className="flex flex-col w-full items-left px-6 py-3 gap-3 rounded-2xl">
        <h1 className="text-2xl">
          {dayjs(targetDate).format('D [de] MMMM, YYYY')}
        </h1>
        <p className="text-base text-zinc-400">Sua carta já pode ser aberta!</p>
        <Button className="w-full bg-primary " onClick={onClick}>
          Revelar Carta
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full items-center  px-6 py-3 gap-3 rounded-2xl">
      <div className="flex flex-col min-w-full items-left px-6 py-3 gap-3 rounded-2xl ">
        <h1 className="text-2xl">
          {dayjs(targetDate).format('D [de] MMMM, YYYY')}
        </h1>
        <p className="text-base text-zinc-400">Esta carta será aberta em</p>
      </div>
      <div className="flex w-full h-[54px] rounded-xl p-4 items-center  bg-[#2C2C30] justify-between">
        <div className="flex flex-col items-center gap-1">
          <span>{timeLeft.years}</span>
          <span className="text-xs text-zinc-500">Anos</span>
        </div>
        <div className="w-[1px] h-3 bg-zinc-700" />
        <div className="flex flex-col items-center gap-1">
          <span>{timeLeft.months}</span>
          <span className="text-xs text-zinc-500">Meses</span>
        </div>
        <div className="w-[1px] h-3 bg-zinc-700" />
        <div className="flex flex-col items-center gap-1">
          <span>{timeLeft.days}</span>
          <span className="text-xs text-zinc-500">Dias</span>
        </div>
        <div className="w-[1px] h-3 bg-zinc-700" />
        <div className="flex flex-col items-center gap-1">
          <span>{timeLeft.hours}</span>
          <span className="text-xs text-zinc-500">Horas</span>
        </div>
      </div>
    </div>
  )
}
