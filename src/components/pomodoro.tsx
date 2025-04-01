'use client'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Pause, Play } from 'lucide-react'
import { Onest } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

const onest = Onest({
  subsets: ['latin'],
})

function PomodoroTimer() {
  const playRef = useRef<HTMLAudioElement | null>(null)
  const pauseRef = useRef<HTMLAudioElement | null>(null)
  const endRef = useRef<HTMLAudioElement | null>(null)
  const queryClient = useQueryClient()
  const [time, setTime] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(0)

  const { data: pomodoro, refetch } = useQuery({
    queryKey: ['pomodoro'],
    queryFn: async () => {
      const response = await api.get('/pomodoro/today')
      return response.data as PomodoroResponse
    },
  })

  function handlePlay() {
    setIsRunning(true)
    if (playRef.current) {
      playRef.current.volume = 0.5
      playRef.current.play()
    }
  }

  function handlePause() {
    setIsRunning(false)
    if (pauseRef.current) {
      pauseRef.current.volume = 0.5
      pauseRef.current.play()
    }
  }

  function handleReset() {
    if (!pomodoro) return
    refetch()
    setTime(Number(pomodoro.minutagem_produtividade))
    queryClient.invalidateQueries({ queryKey: ['pomodoro-chart'] })
    setIsRunning(false)
  }

  async function completedSession() {
    try {
      await api.put('/pomodoro/session-completed')
      handleReset()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }
      toast.error('Erro ao concluir a sessão do pomodoro.')
    }
  }

  useEffect(() => {
    if (pomodoro) {
      if (done !== 0 && done % 4 === 0) {
        setTime(Number(pomodoro.intervalo_longo))
      } else if (done !== 0 && done % 2 === 0) {
        setTime(Number(pomodoro.intervalo_curto))
      } else {
        setTime(Number(pomodoro.minutagem_produtividade))
      }
    }
  }, [pomodoro, done])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && time) {
      interval = setInterval(() => {
        // @ts-expect-error time not null
        setTime((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (time === 0 && isRunning) {
      setIsRunning(false)
      setDone((prev) => prev + 1)
      if (endRef.current) {
        endRef.current.volume = 0.5
        endRef.current.play()
        completedSession()
      }
    }
  }, [time, isRunning])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <>
      <div className="flex flex-col items-center justify">
        <span
          className={cn('flex text-[9rem] items-center font-bold relative')}
          style={{
            fontFamily: onest.style.fontFamily,
          }}
        >
          {time ? formatTime(time) : '00:00'}
        </span>
        <div className="flex gap-2">
          {isRunning ? (
            <Button onClick={handlePause} className="h-10 ">
              <Pause size={20} />
              Pausar
            </Button>
          ) : (
            <Button onClick={handlePlay} className="h-10">
              <Play size={20} />
              Iniciar
            </Button>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            className="h-10 border"
          >
            Resetar
          </Button>
        </div>
      </div>
      <audio ref={playRef} src="/audio/pomodoro-play.mp3" />
      <audio ref={pauseRef} src="/audio/pomodoro-pause.mp3" />
      <audio ref={endRef} src="/audio/pomodoro-end.mp3" />
    </>
  )
}

export default PomodoroTimer
