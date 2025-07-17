import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video-player'
import { videos } from '@/lib/constants'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

export function ChallengeDialogTrigger({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-800 border-zinc-700 gap-4">
        <div className="relative w-full h-full overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="flex w-full-items-center gap-16">
              <Image
                src={'/images/lobo-face.svg'}
                width={125}
                height={109}
                alt="Capitão Caverna"
              />
              <div className="flex flex-col relative w-full p-6 gap-6 border border-zinc-700 rounded-lg">
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-semibold">Fala Cavernoso!</p>
                  <p className="text-zinc-400">
                    Assista o vídeo abaixo para entender como funciona o
                    Desafio.
                  </p>
                </div>
                <Image
                  src={'/images/triangle-balloon.svg'}
                  width={54}
                  height={14}
                  alt="balloon"
                  className="absolute -left-[54px] bottom-6"
                />
              </div>
            </div>
            <div className="w-full aspect-video rounded-xl overflow-hidden">
              <VideoPlayer id={videos.challengeTutorial} />
            </div>
            <AlertDialogFooter className="flex-row sm:flex-row sm:justify-center">
              <Button onClick={() => setOpen(false)}>Fechar</Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
