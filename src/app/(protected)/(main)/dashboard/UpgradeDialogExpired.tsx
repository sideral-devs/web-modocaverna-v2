import { AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Check, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export function UpgradeDialogExpired({ children }: { children: ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex min-w-[797px] min-h-[590px] gap-10 bg-[#18181B] sm:rounded-2xl">
        <div className="relative top-4 ">
          <Image
            src={'/images/lobo/apontando.png'}
            width={210}
            height={364}
            alt="Imagens modo caverna"
          />
        </div>
        <div className="flex flex-col w-[490px] h-[500px] pt-7">
          <div className="flex flex-row ">
            <AlertTitle className="text-xl font-semibold text-white">
              Parece que a sua avaliação gratuita de 7 dias a Central Caverna&nbsp;
              <span className="text-primary">expirou...</span>
            </AlertTitle>
          </div>
          <p className="text-base pt-4 text-[#A0A0A9]">
            O seu acesso ao Modo Caverna ainda está garantido, mas a sua
            assinatura atual contempla apenas algumas funcionalidades...
          </p>
          <ul className="flex flex-col py-8 gap-4">
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-base">Curso Modo Caverna</span>
            </li>
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-base">Desafio Caverna</span>
            </li>
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-base">Suporte via chat</span>
            </li>
            <p className="text-base pt-4 text-[#A0A0A9]">
              Gostaria de continuar utilizando todas as ferramentas do sistema?
              Clique no botão abaixo e assine com 50% dedesconto!
            </p>
          </ul>

          <div className="flex flex-col w-full gap-2">
            <Link
              className="flex flex-col justify-center w-lg"
              href="/settings/plans"
            >
              <Button>
                Eu quero a Central Caverna
                <Zap color="#FFF" fill="#fff"></Zap>
              </Button>
            </Link>
            <Link
              className="flex flex-col justify-center w-lg"
              href="/dashboard"
            >
              <div className=" flex py-2 items-center justify-center rounded">
                <AlertDialogCancel className="bg-[#121215] text-[#A0A0A9] rounded-lg w-[80%] h-[41px]">
                  Continuar com o Modo Caverna
                </AlertDialogCancel>
              </div>
            </Link>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
