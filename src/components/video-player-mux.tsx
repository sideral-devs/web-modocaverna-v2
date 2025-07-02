'use client'
import { useUser } from '@/hooks/queries/use-user'
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
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return

    const handleTimeUpdate = () => {
      const current = player.currentTime || 0
      const duration = player.duration || 1
      setProgress((current / duration) * 100)
    }

    const handlePlay = () => setShowPlayButton(false)
    const handlePause = () => {
      if ((player.currentTime || 0) < (player.duration || 1)) {
        setShowPlayButton(true)
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
    setShowPlayButton(false)
    setIsMuted(false)
  }

  const { data: user } = useUser()

  return (
    <div className="relative" onClick={() => setIsMuted(false)}>
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
        autoPlay
        disablePictureInPicture
        nohotkeys
        muted={isMuted}
        {...props}
      />

      {isMuted && (
        <div className="absolute top-2 right-2 z-50 bg-black/60 text-white text-sm px-3 py-1 rounded">
          Clique para ativar o som
        </div>
      )}

      {showPlayButton && (
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 text-white text-4xl"
        >
          <div className="flex size-12 items-center justify-center bg-red-700 shadow-xl shadow-red-600 rounded-full">
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
