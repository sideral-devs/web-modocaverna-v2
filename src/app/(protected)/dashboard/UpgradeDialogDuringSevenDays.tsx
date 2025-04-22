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

export function UpgradeDialogDuringSevenDays({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex min-w-[797px] min-h-[500px] gap-10 bg-[#18181B] sm:rounded-2xl">
        <div className="relative top-4 ">
          <Image
            src={'/images/lobo/apontando.png'}
            width={350}
            height={564}
            alt="Imagens modo caverna"
          />
        </div>
        <div className="flex flex-col  gap-4">
          <div className="flex flex-row ">
            <AlertTitle className="text-xl font-semibold text-white">
              Parece que a sua avaliação gratuita de 7 dias ao Plano
              Cavernoso&nbsp;
              <span className="text-primary">expirou...</span>
            </AlertTitle>
          </div>
          <p className="text-xs pt-4 text-[#A0A0A9]">
            O seu acesso ao Modo Caverna ainda está garantido, mas a sua
            assinatura atual contempla apenas algumas funcionalidades...
          </p>
          <ul className="flex flex-col py-8 gap-4">
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-sm">Curso Modo Caverna</span>
            </li>
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-sm">Desafio Caverna</span>
            </li>
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-sm">Suporte via chat</span>
            </li>
            <p className="text-xs pt-4 text-[#A0A0A9]">
              Gostaria de continuar utilizando todas as ferramentas do sistema?
              Clique no botão abaixo e assine o Plano Cavernoso com 50% de
              desconto!
            </p>
          </ul>

          <div className="flex flex-col w-full gap-2">
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
              <AlertDialogCancel className="bg-black text-[#A0A0A9] rounded-lg w-[80%]">
                Continuar com o Plano atual
              </AlertDialogCancel>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
