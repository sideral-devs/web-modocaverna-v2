import { AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export function UpgradeDialogDuringSevenDays({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex min-w-[797px] min-h-[500px] gap-10 bg-[#18181B] sm:rounded-2xl">
        <div className="relative top-6 ">
          <Image
            src={'/images/lobo/apontando.png'}
            width={350}
            height={564}
            alt="Imagens modo caverna"
          />
        </div>
        <div className="flex flex-col pt-6 gap-4">
          <div className="flex flex-col ">
            <AlertTitle className="text-2xl  text-white">
              Imagino que você esteja curtindo sua
            </AlertTitle>
            <h1 className="text-2xl  text-primary">
              Avaliação gratuita do Plano Cavernoso! 🚀
            </h1>
          </div>
          <p className="text-normal pt-4 text-[#A0A0A9]">
            Seu plano atual já oferece as ferramentas vitais do sistema.
          </p>
          <p className="text-normal text-[#A0A0A9]">
            Ao fazer o upgrade de Plano, você desbloqueia a experiência completa
            e todas as ferramentas para potencializar seus resultados.
          </p>
          <div className="flex items-center justify-center h-[76px] bg-[#503e04] border border-yellow-500 rounded-xl">
            <div className="w-[80%] ">
              <p className="text-normal text-white ">
                Garanta agora 50% de desconto ao fazer o upgrade e continue
                aproveitando o Modo Caverna completo!
              </p>
            </div>
          </div>
          <div className="flex flex-col pt-2 w-full gap-2">
            <Link
              className="flex flex-col justify-center w-lg"
              href="/settings/plans"
            >
              <Button>
                Eu quero ser Cavernoso
                <Zap color="#FFF" fill="#fff"></Zap>
              </Button>
            </Link>
            <div className=" flex py-2 items-center justify-center rounded">
              <AlertDialogCancel className="bg-black text-[#A0A0A9] rounded-xl w-[80%]">
                Quero continuar com o Plano Caverna
              </AlertDialogCancel>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
