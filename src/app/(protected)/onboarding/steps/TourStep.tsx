import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { VideoPlayer } from '@/components/video-player'
import { videos } from '@/lib/constants'
import { useEffect, useState } from 'react'

export function TourStep({ onNext }: { onNext: () => void }) {
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false)
    }, 20)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col relative flex-1 w-full justify-between items-center p-4 pb-16 gap-24">
      <div className="flex w-full flex-col items-center gap-16">
        <div className="flex w-full max-w-[611px] flex-col items-center gap-8">
          <h1 className="text-3xl font-bold">Tour Guiado da Interface</h1>
          <p className="text-center opacity-80">
            Vou te mostrar como tudo funciona — onde começar, o que priorizar e
            como acessar as ferramentas que vão guiar sua transformação.
          </p>
          <div className="flex flex-col relative w-full border border-zinc-700 rounded-lg">
            <div className="w-full aspect-video rounded-xl overflow-hidden">
              <VideoPlayer id={videos.caveRite} />
            </div>
          </div>
          <Card className="flex flex-col items-center gap-6 relative w-full rounded-xl p-6">
            <p className="text-yellow-400 text-lg">
              🎮 O que você vai aprender
            </p>
            <div className="w-full grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center px-4 py-6 gap-1 rounded-xl border">
                <span className="text-xl">🏠</span>
                <span className="text-center opacity-80">Menu superior</span>
              </div>
              <div className="flex flex-col items-center px-4 py-6 gap-1 rounded-xl border">
                <span className="text-xl">🎯</span>
                <span className="text-center opacity-80">Seletor de Hubs</span>
              </div>
              <div className="flex flex-col items-center px-4 py-6 gap-1 rounded-xl border">
                <span className="text-xl">⚡️</span>
                <span className="text-center opacity-80">
                  Ferramentas rápidas
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" disabled={disabled}>
            🚀 INICIAR TOUR GUIADA
          </Button>
        </div>
      </div>
    </div>
  )
}
