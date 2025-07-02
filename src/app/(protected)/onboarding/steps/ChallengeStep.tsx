import { Button } from '@/components/ui/button'
import { VideoPlayerMux } from '@/components/video-player-mux'
import { muxVideos } from '@/lib/constants'
import { useState } from 'react'

export function ChallengeStep({ onNext }: { onNext: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false)

  return (
    <div className="flex flex-col items-center p-4 gap-16">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-center text-4xl lg:text-5xl">
          Desafio e Filosofia do{' '}
          <span className="text-primary">Modo Caverna</span>
        </h1>
        <p className="lg:text-lg opacity-80">
          Está pronto para abraçar a metodologia cavernosa?
        </p>
      </div>

      <div className="w-full rounded-xl overflow-hidden relative">
        <VideoPlayerMux
          id={muxVideos.philosophy}
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
