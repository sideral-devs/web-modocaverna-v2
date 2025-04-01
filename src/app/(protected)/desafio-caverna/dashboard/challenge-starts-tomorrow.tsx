import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import Image from 'next/image'
import { useState } from 'react'

export function ChallengeStartsTomorrow() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-zinc-800 border-zinc-700 gap-4">
        <div className="flex items-start relative w-full h-full overflow-hidden gap-6">
          <Image
            src={'/images/lobo/legal.webp'}
            alt="Capitão Caverna"
            width={200}
            height={340}
          />
          <div className="flex flex-col relative w-full p-6 gap-6 border border-zinc-700 rounded-lg">
            <AlertDialogTitle className="text-2xl">
              A sua jornada na caverna começará amanhã
            </AlertDialogTitle>
            <div className="w-full flex items-center p-6 gap-4 bg-[#323232]/50 rounded-lg">
              <p className="text-sm text-zinc-400">
                Aproveite o dia de hoje para organizar a sua rotina e seus
                rituais.
              </p>
            </div>
            <Image
              src={'/images/triangle-balloon.svg'}
              width={54}
              height={14}
              alt="balloon"
              className="absolute -left-[54px] top-[75px]"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AutoSubmitButton onClick={() => setIsOpen(false)}>
            Entendido, Capitão!
          </AutoSubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
