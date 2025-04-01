/* eslint-disable camelcase */
'use client'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { VideoPlayer } from '@/components/video-player'
import { api } from '@/lib/api'
import { videos } from '@/lib/constants'
import { useChallengerStore } from '@/store/challenge'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function ChallengeTourDialog() {
  const {
    textarea_oque_motivou,
    textarea_oque_deseja,
    initialSituationPhotos,
    initialReasonPhotos,
    compromisses,
    fail,
  } = useChallengerStore()
  const [open, setOpen] = useState(true)
  const router = useRouter()

  async function handleActivate() {
    try {
      await api.post('/desafios/store', {
        textarea_oque_motivou,
        textarea_oque_deseja,
        fotos_situacao_inicial: initialSituationPhotos,
        fotos_oque_motivou_inicial: initialReasonPhotos,
        array_comprometimento: compromisses,
        array_falhar: fail,
        modalidade: 'cavernoso_40',
      })
      localStorage.setItem('challenge-storage', '')
      setOpen(false)
      router.replace('/desafio-caverna/dashboard')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-zinc-800 border-zinc-700 gap-4">
        <div className="relative w-full h-full overflow-hidden">
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full-items-center gap-16">
              <Image
                src={'/images/lobo-face.svg'}
                width={125}
                height={109}
                alt="Capitão Caverna"
              />
              <div className="flex flex-col relative w-full px-6 py-5 gap-2 border border-zinc-700 rounded-lg">
                <AlertDialogTitle className="text-xl font-semibold">
                  Quase lá!
                </AlertDialogTitle>
                <p className="text-zinc-400">
                  Este vídeo tour vai te transformar em um(a) verdadeiro(a)
                  explorador(a) da Caverna! Assista.
                </p>
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
            <AlertDialogFooter className="mt-6">
              <Button onClick={handleActivate}>
                Ativar o Desafio Caverna!
              </Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
