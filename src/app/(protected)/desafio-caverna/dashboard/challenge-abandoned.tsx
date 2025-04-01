import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function ChallengeAbandoned() {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="bg-zinc-800 border-zinc-700 gap-4">
        <div className="flex items-start relative w-full h-full overflow-hidden gap-6">
          <Image
            src={'/images/lobo/apresentando.webp'}
            alt="Capitão Caverna"
            width={222}
            height={373}
          />
          <div className="flex flex-col relative w-full p-6 gap-6 border border-zinc-700 rounded-lg">
            <AlertDialogTitle className="text-2xl">
              Você abandonou esse desafio
            </AlertDialogTitle>
            <div className="w-full flex items-center p-6 gap-4 bg-[#323232]/50 rounded-lg">
              <p className="text-sm text-zinc-400">
                Lamentamos por isso! Inicie outro desafio agora mesmo se quiser
                acessar essa tela
              </p>
            </div>
            <Image
              src={'/images/triangle-balloon.svg'}
              width={54}
              height={14}
              alt="balloon"
              className="absolute -left-[54px] top-[60px]"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <Link href={'/dashboard'} replace>
            <Button variant="ghost">Voltar à tela inicial</Button>
          </Link>
          <Link href={'/desafio-caverna'} replace>
            <Button>Novo desafio</Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
