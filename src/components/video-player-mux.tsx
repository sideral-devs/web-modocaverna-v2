'use client'
import { useUser } from '@/hooks/queries/use-user'
import { useInteractionStore } from '@/store/interaction-store'
import MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { motion } from 'framer-motion'
import { PlayIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps extends React.ComponentProps<typeof MuxPlayer> {
  id: string
}

export function VideoPlayerMux({ id, title, ...props }: VideoPlayerProps) {
  const playerRef = useRef<MuxPlayerElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { hasUserInteracted } = useInteractionStore()

  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    const handleTimeUpdate = () => {
      const current = player.currentTime || 0
      const duration = player.duration || 1
      setProgress((current / duration) * 100)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => {
      if ((player.currentTime || 0) < (player.duration || 1)) {
        setIsPlaying(false)
      }
    }

    player.addEventListener('timeupdate', handleTimeUpdate)
    player.addEventListener('play', handlePlay)
    player.addEventListener('pause', handlePause)

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate)
      player.removeEventListener('play', handlePlay)
      player.removeEventListener('pause', handlePause)
    }
  }, [])

  const handlePlayClick = () => {
    playerRef.current?.play()
    setIsPlaying(true)
  }

  const { data: user } = useUser()

  return (
    <div className="relative">
      <MuxPlayer
        ref={playerRef}
        playbackId={id}
        metadata={{
          video_title: title || 'Modo Caverna',
          viewer_user_id: user?.id || 'unauthenticated',
        }}
        accentColor="#ff3333"
        style={
          {
            '--controls': 'none',
          } as React.CSSProperties
        }
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay={hasUserInteracted}
        muted={!hasUserInteracted}
        nohotkeys
        {...props}
      />
      {!isPlaying && (
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 text-white text-4xl"
        >
          <div className="flex size-16 items-center justify-center bg-red-700 button-shadow rounded-full">
            <PlayIcon className="fill-white" />
          </div>
        </button>
      )}

      <div className="absolute flex h-1.5 bottom-0 inset-x-0 z-50 bg-zinc-900">
        <motion.div
          style={{
            height: '100%',
            backgroundColor: '#ff3333',
            opacity: 0.6,
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
