'use client'
import { useEffect, useState } from 'react'

export function CountdownTimer({ targetDate }: { targetDate: string | Date }) {
  function calculateTimeLeft() {
    const now = new Date()
    const target = new Date(targetDate)
    const difference = target.getTime() - now.getTime()

    if (difference <= 0) return { hours: '00', minutes: '00', seconds: '00' }

    const hours = String(
      Math.floor((difference / (1000 * 60 * 60)) % 24),
    ).padStart(2, '0')
    const minutes = String(
      Math.floor((difference / (1000 * 60)) % 60),
    ).padStart(2, '0')
    const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
      2,
      '0',
    )

    return { hours, minutes, seconds }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer) // Limpa o intervalo quando o componente é desmontado
  }, [])

  return (
    <div className="flex w-full items-center justify-between bg-[#2C2C30] px-10 py-6 rounded-2xl">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl font-semibold">{timeLeft.hours}</span>
        <span className="text-sm text-zinc-500">Horas</span>
      </div>
      <div className="w-[1px] h-3 bg-zinc-700" />
      <div className="flex flex-col items-center gap-1 rounded">
        <span className="text-xl font-semibold">{timeLeft.minutes}</span>
        <span className="text-sm text-zinc-500">Minutos</span>
      </div>
      <div className="w-[1px] h-3 bg-zinc-700" />
      <div className="flex flex-col items-center gap-1 rounded">
        <span className="text-xl font-semibold">{timeLeft.seconds}</span>
        <span className="text-sm text-zinc-500">Segundos</span>
      </div>
    </div>
  )
}
