/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  id: string
  onVideoEnd?: () => void
}

export function VideoPlayer({ id, onVideoEnd }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scriptId = `scr_${id}`
    const playerScriptUrl = `https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/${id}/player.js`

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = playerScriptUrl
      script.async = true
      document.head.appendChild(script)
    }

    let attempts = 0
    const maxAttempts = 10

    function checkPlayerReady() {
      const player = (window as any).smartplayer?.instances?.[0]
      if (!player) {
        if (attempts++ < maxAttempts) {
          setTimeout(checkPlayerReady, 1000)
        }
        return
      }

      player.on('ended', () => {
        if (onVideoEnd) onVideoEnd()
      })
    }

    checkPlayerReady()
  }, [id, onVideoEnd])

  return (
    <div
      ref={containerRef}
      id={`vid_${id}`}
      style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }}
    >
      <img
        id={`thumb_${id}`}
        src={`https://images.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/${id}/thumbnail.jpg`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        alt="thumbnail"
      />
      <div
        id={`backdrop_${id}`}
        style={{
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          position: 'absolute',
          top: 0,
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  )
}
