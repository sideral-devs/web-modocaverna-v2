/* eslint-disable @next/next/no-img-element */
'use client'

interface VideoPlayerProps {
  id: string
}

export function VideoPlayer({ id }: VideoPlayerProps) {
  return (
    <div>
      <div id={`ifr_${id}_wrapper`} style={{ margin: '0 auto', width: '100%' }}>
        <div
          className="border border-red-600 rounded-xl box-border w-auto h-auto"
          style={{ padding: '56.25% 0 0 0', position: 'relative' }}
          id={`ifr_${id}_aspect`}
        >
          <iframe
            frameBorder="0"
            allowFullScreen
            src={`https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/${id}/embed.html`}
            id={`ifr_${id}`}
            style={{
              borderRadius: '15px',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            referrerPolicy="origin"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
