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
import { ReactNode, useEffect, useState } from 'react'

export function TutorialAffiliateDialogTrigger() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const storedValue = localStorage.getItem('video-affiliate')
    if (!storedValue) {
      setOpen(true)
    }
  }, [])

  function handleCheckboxChange() {
    setOpen(false)
    localStorage.setItem('video-affiliate', 'true')
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
                    Assista ao vídeo para entender como funciona o indique e
                    ganhe.
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
              <VideoPlayer id={videos.affiliateTutorial} />
            </div>
            <AlertDialogFooter className="flex-row sm:flex-row sm:justify-center">
              <Button
                onClick={() => handleCheckboxChange()}
                className="transition-all duration-300 ease-in-out border border-transparent hover:border-red-500 hover:scale-105"
              >
                Quero começar a faturar!
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
