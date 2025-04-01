'use client'

import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { ListMusic, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import Image from 'next/image'
import { Moodboard } from './moodboard'
import { useMusicPlayer } from './music-player-provider'

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    setIsDialogOpen,
  } = useMusicPlayer()

  // const [progress, setProgress] = useState(0)

  // useEffect(() => {
  //   let interval: NodeJS.Timeout

  //   if (isPlaying) {
  //     interval = setInterval(() => {
  //       setProgress((prev) => {
  //         if (prev >= 100) {
  //           clearInterval(interval)
  //           nextSong()
  //           return 0
  //         }
  //         return prev + 0.5
  //       })
  //     }, 100)
  //   }

  //   return () => {
  //     if (interval) clearInterval(interval)
  //   }
  // }, [isPlaying, nextSong])

  // useEffect(() => {
  //   setProgress(0)
  // }, [currentSong])

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col w-72 bg-card border rounded-xl">
      <Moodboard />
      <div className="bg-card shadow-lg rounded-lg border">
        <div className="flex flex-col">
          <div className="flex items-center p-2 gap-1 rounded-lg bg-zinc-700 border border-zinc-600">
            {currentSong && currentSong.banner ? (
              <div className="w-9 h-9 min-h-9 min-w-9 relative">
                <Image
                  src={env.NEXT_PUBLIC_PROD_URL + currentSong.banner}
                  alt={currentSong.title}
                  className="object-cover shadow-lg rounded-md"
                  fill
                />
              </div>
            ) : (
              <div className="w-9 h-9 min-w-9 min-h-9 bg-zinc-500 rounded-lg" />
            )}
            {currentSong ? (
              <div className="flex flex-1 1-full">
                <p className="text-white text-xs line-clamp-1">
                  {currentSong.title}
                </p>
              </div>
            ) : (
              <p className="text-white text-xs line-clamp-1">
                Nenhuma música tocando
              </p>
            )}
            <div className="flex items-center justify-center gap-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSong}
                disabled={!currentSong}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={togglePlay}
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-black" />
                ) : (
                  <Play className="h-4 w-4 fill-black" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSong}
                disabled={!currentSong}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <ListMusic className="h-4 w-4" />
            <span className="ml-1">Abrir Playlists</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
