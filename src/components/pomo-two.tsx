'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ClockIcon, Pause, Play } from 'lucide-react'
import { Onest } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const onest = Onest({
  subsets: ['latin'],
})

type Phase = 'focus' | 'shortBreak' | 'longBreak'

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [duration, setDuration] = useState<number>(0)
  const queryClient = useQueryClient()
  const [currentPhase, setCurrentPhase] = useState<Phase>('focus')
  const [phaseCount, setPhaseCount] = useState(0)
  const [showBreakDialog, setShowBreakDialog] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startSoundRef = useRef<HTMLAudioElement | null>(null)
  const stopSoundRef = useRef<HTMLAudioElement | null>(null)
  const finishSoundRef = useRef<HTMLAudioElement | null>(null)

  const { data: pomodoro } = useQuery({
    queryKey: ['pomodoro'],
    queryFn: async () => {
      const response = await api.get('/pomodoro/today')
      return response.data as PomodoroResponse
    },
  })

  const lastExecutionTime = useRef(0)

  const safeMoveToNextPhase = () => {
    const now = Date.now()

    if (now - lastExecutionTime.current < 1500) {
      return
    }

    lastExecutionTime.current = now
    moveToNextPhase()
  }

  async function completedSession() {
    try {
      await api.put('/pomodoro/session-completed')
      queryClient.invalidateQueries({ queryKey: ['pomodoro-chart'] })
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data)
      }
      toast.error('Erro ao concluir a sessão do pomodoro.')
    }
  }

  const moveToNextPhase = () => {
    if (!pomodoro) return
    let newPhaseCount = phaseCount + 1

    if (newPhaseCount === 4) {
      newPhaseCount = 0
    }

    finishSoundRef.current?.play()
    setIsRunning(false)
    setPhaseCount(newPhaseCount)

    if (currentPhase === 'focus') {
      // Depois do foco, ir para descanso curto ou longo
      if (newPhaseCount === 3) {
        setCurrentPhase('longBreak')
      } else {
        setCurrentPhase('shortBreak')
      }

      completedSession()
    } else {
      setCurrentPhase('focus')
    }

    setTimeout(() => {
      setStartTime(Date.now())
      setDuration(() => {
        if (currentPhase === 'focus') {
          return newPhaseCount === 3
            ? Number(pomodoro?.intervalo_longo || 0) * 1000
            : Number(pomodoro?.intervalo_curto || 0) * 1000
        } else {
          return Number(pomodoro?.minutagem_produtividade || 0) * 1000
        }
      })
      setIsRunning(true)
    }, 1500)
  }

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    clearInterval(intervalRef.current as NodeJS.Timeout)
    setStartTime(null)
    setDuration(0)
    setCurrentPhase('focus')
    setTimeLeft(pomodoro ? Number(pomodoro.minutagem_produtividade) : 0)
    setPhaseCount(0)
    setShowBreakDialog(false)
  }

  const handleSkipBreak = () => {
    setIsRunning(false)
    clearInterval(intervalRef.current as NodeJS.Timeout)
    moveToNextPhase()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function handleStartFocus() {
    startSoundRef.current?.play()
    setStartTime(Date.now())
    setDuration(timeLeft * 1000)
    setIsRunning(true)
  }

  function handlePause() {
    stopSoundRef.current?.play()
    if (startTime) {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(duration - elapsed, 0)
      setTimeLeft(Math.ceil(remaining / 1000))
    }
    setIsRunning(false)
    setStartTime(null)
  }

  useEffect(() => {
    if (!pomodoro) return

    if (!isRunning) {
      switch (currentPhase) {
        case 'focus':
          setTimeLeft(Number(pomodoro.minutagem_produtividade))
          setShowBreakDialog(false)
          break
        case 'shortBreak':
          setTimeLeft(Number(pomodoro.intervalo_curto))
          setShowBreakDialog(true)
          break
        case 'longBreak':
          setTimeLeft(Number(pomodoro.intervalo_longo))
          setShowBreakDialog(true)
          break
      }
      setDuration(0)
      setStartTime(null)
    }
  }, [currentPhase, pomodoro])

  useEffect(() => {
    if (!isRunning || startTime === null) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(duration - elapsed, 0)
      setTimeLeft(Math.ceil(remaining / 1000))

      if (remaining <= 0) {
        clearInterval(interval)
        safeMoveToNextPhase()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, startTime, duration])

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      safeMoveToNextPhase()
    }
  }, [timeLeft, isRunning])

  return (
    <>
      <audio ref={startSoundRef} src="/audio/pomodoro-play.mp3" />
      <audio ref={stopSoundRef} src="/audio/pomodoro-pause.mp3" />
      <audio ref={finishSoundRef} src="/audio/pomodoro-end.mp3" />

      <div className="flex flex-col gap-6 items-center justify">
        <span
          className={cn(
            'flex text-[6rem] lg:text-[7rem] xl:text-[9rem] items-center font-bold relative',
          )}
          style={{
            fontFamily: onest.style.fontFamily,
          }}
        >
          {formatTime(timeLeft)}
        </span>
        <div className="flex gap-2">
          {isRunning ? (
            <Button onClick={handlePause} className="h-10 ">
              <Pause size={20} />
              Pausar
            </Button>
          ) : (
            <Button onClick={handleStartFocus} className="h-10">
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

      {/* <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">{getPhaseLabel()}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-6xl font-bold tabular-nums my-8">
          </div>
          <div className="flex space-x-2 text-sm text-muted-foreground">
            <span>Session progress:</span>
            <div className="flex space-x-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < phaseCount ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={handleStartPause} className="w-32">
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            )}
          </Button>
        </CardFooter>
      </Card> */}

      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent className="max-w-none left-0 top-0 right-0 bottom-0 translate-x-0 translate-y-0 w-full h-full max-h-screen flex flex-col items-center justify-center bg-zinc-800">
          <ClockIcon className="text-zinc-800 fill-primary" />
          <DialogTitle className="text-4xl text-center">
            Hora da pausa!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Aproveite para relaxar. O sistema enviará um aviso sono quando o
            cronometro zerar.
          </DialogDescription>
          <div className="text-[150px] font-bold tabular-nums my-10">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSkipBreak}
              variant="outline"
              className="bg-zinc-900"
            >
              VOLTAR AO FLOW
            </Button>
            {isRunning ? (
              <Button onClick={handleSkipBreak}>Pular</Button>
            ) : (
              <Button onClick={handleStartPause}>Iniciar pausa</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
