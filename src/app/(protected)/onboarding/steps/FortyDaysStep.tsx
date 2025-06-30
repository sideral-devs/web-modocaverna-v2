import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video-player'
import { videos } from '@/lib/constants'
import { useEffect, useState } from 'react'

export function FortyDaysStep({ onNext }: { onNext: () => void }) {
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false)
    }, 20)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col relative flex-1 w-full justify-between items-center p-4 pb-16 gap-24">
      <div className="flex w-full flex-col items-center gap-64 lg:gap-24">
        <div className="flex flex-col relative w-full max-w-[611px] border border-zinc-700 rounded-lg">
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <VideoPlayer id={videos.onboardingTutorial} />
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" disabled={disabled}>
            🧭 EXPLORAR A CAVERNA
          </Button>
        </div>
      </div>
    </div>
  )
}
