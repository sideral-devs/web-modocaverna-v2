/* eslint-disable @next/next/no-img-element */
'use client'

interface VideoPlayerProps {
  id: string
}

export function VideoPlayer({ id }: VideoPlayerProps) {
  return (
    <div>
      <div
        id={`ifr_${id}_aspect`}
        className="relative w-full box-border  mb-0"
        style={{ paddingTop: '56.55%' }}
      >
        <div className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden border-2 pb-0 mb-0 border-red-500">
          <iframe
            src={`https://scripts.converteai.net/5d9f8480-70ee-4640-ab7d-afc37958aa16/players/${id}/embed.html`}
            frameBorder="0"
            allowFullScreen
            referrerPolicy="origin"
            className="w-full h-full  pb-0 mb-0"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
