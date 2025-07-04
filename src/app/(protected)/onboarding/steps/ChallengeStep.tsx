import { Button } from '@/components/ui/button'
import { VideoPlayerMux } from '@/components/video-player-mux'
import { muxVideos } from '@/lib/constants'
import { useState } from 'react'

export function ChallengeStep({ onNext }: { onNext: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false)

  return (
    <div className="flex flex-col items-center p-4 gap-16">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-center text-2xl lg:text-3xl">
          O código da transformação na{' '}
          <span className="text-primary">Caverna</span>
        </h1>
        <p className="lg:text-lg opacity-80 text-center">
          Muito além de um método. É uma filosofia de vida. Propósito, foco e
          progresso — ou nada muda.
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
            Eu me comprometo, Capitão!
          </Button>
        </div>
      )}
    </div>
  )
}
