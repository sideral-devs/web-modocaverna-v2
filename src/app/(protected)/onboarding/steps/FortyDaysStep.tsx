import { Button } from '@/components/ui/button'
import { VideoPlayerMux } from '@/components/video-player-mux'
import { muxVideos } from '@/lib/constants'
import { useState } from 'react'

export function FortyDaysStep({ onNext }: { onNext: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false)

  return (
    <div className="flex flex-col items-center p-4 gap-16">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-2xl lg:text-3xl">
          Os 40 Primeiros Dias no{' '}
          <span className="text-primary">Modo Caverna</span>
        </h1>
        <p className="lg:text-lg opacity-80">
          Sua jornada de transformação através dos 7 níveis de consciência
        </p>
      </div>

      <div className="w-full rounded-xl overflow-hidden relative">
        <VideoPlayerMux
          id={muxVideos.fortyDays}
          onEnded={() => setVideoEnded(true)}
        />
      </div>

      {videoEnded && (
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" className="uppercase">
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}
