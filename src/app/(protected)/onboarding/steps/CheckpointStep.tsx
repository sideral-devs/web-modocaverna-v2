import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video-player'
import { videos } from '@/lib/constants'
import { useEffect, useState } from 'react'

export function CheckPointStep({ onNext }: { onNext: () => void }) {
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false)
    }, 20)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col relative flex-1 w-full justify-between items-center p-4 pb-16 gap-24">
      <div className="flex w-full flex-col items-center gap-16">
        <div className="flex w-full max-w-[611px] flex-col items-center gap-8">
          <h1 className="text-3xl font-bold">Checkpoint de Compromisso</h1>
          <p className="text-center opacity-80">
            Antes de prosseguir, você precisa se comprometer com sua
            transformação.
          </p>
          <p className="text-center opacity-80">
            Você está prestes a iniciar uma jornada de 40 dias que pode
            transformar completamente sua vida.
          </p>
          <p className="text-center opacity-80">
            Isso exigirá disciplina, consistência e coragem para enfrentar seus
            medos e limitações.
          </p>
          <p className="text-center opacity-80">
            Você está preparado para assumir essa responsabilidade?
          </p>
          <div className="flex flex-col relative w-full border border-zinc-700 rounded-lg">
            <div className="w-full aspect-video rounded-xl overflow-hidden">
              <VideoPlayer id={videos.caveRite} />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" disabled={disabled}>
            ✅ ASSUMO A RESPONSABILIDADE
          </Button>
        </div>
      </div>
    </div>
  )
}
