import { Button } from '@/components/ui/button'
import { VideoPlayerMux } from '@/components/video-player-mux'
import { muxVideos } from '@/lib/constants'
import { useState } from 'react'

export function ConnectStep({ onNext }: { onNext: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false)

  return (
    <div className="flex flex-col items-center p-4 gap-16">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-2xl lg:text-3xl">
          A Caverna <span className="text-primary">Interior</span>
        </h1>
        <p className="lg:text-lg opacity-80">
          A jornada começa na escuridão da sua mente.
        </p>
      </div>

      <div className="w-full rounded-xl overflow-hidden relative">
        <VideoPlayerMux
          id={muxVideos.connect}
          onEnded={() => setVideoEnded(true)}
        />
      </div>

      {videoEnded && (
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" className="uppercase">
            ESTOU PRONTO, CAPITÃO!
          </Button>
        </div>
      )}
    </div>
  )
}
