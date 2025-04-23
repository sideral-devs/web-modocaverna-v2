import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'
import { Check, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertTitle } from '../ui/alert'
export function ExpiredPlanPopup({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="flex min-w-[797px] min-h-[590px] gap-10 bg-[#18181B] sm:rounded-2xl">
        <div className="relative top-4 ">
          <Image
            src={'/images/lobo/apontando.png'}
            width={210}
            height={364}
            alt="Imagens modo caverna"
          />
        </div>
        <div className="flex flex-col w-[490px] h-[500px] pt-4">
          <div className="flex flex-row ">
            <AlertTitle className="text-2xl font-semibold text-white">
              Fala Caverna, sinto sua falta por aqui...
            </AlertTitle>
          </div>
          <p className="text-base pt-4 text-[#A0A0A9]">
            Sua assinatura expirou, e por isso o acesso às ferramentas do seu
            plano foi temporariamente desativado.
          </p>
          <p className="text-base pt-4 text-[#A0A0A9]">
            Mas não se preocupe - nada foi perdido. Seus dados estão salvos, e
            sua jornada pode continuar exatamente de onde parou.
          </p>
          <p className="text-base pt-4 text-[#A0A0A9]">
            Ao renovar, você recupera:
          </p>
          <ul className="flex flex-col py-4 gap-4">
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-base">
                Todas as funcionalidades do seu plano
              </span>
            </li>
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-base">
                Seu histórico, metas, rotinas e tudo mais
              </span>
            </li>
            <li className="flex items-center gap-4">
              <Check size={16} className="text-primary" />
              <span className="text-base">
                O meu apoio para seguir firme na missão
              </span>
            </li>
            <p className="text-base pt-4 text-[#A0A0A9]">
              Clique abaixo para reativar seu acesso e continuar evoluindo
            </p>
          </ul>

          <div className="flex flex-col w-full gap-2">
            <Link
              className="flex flex-col justify-center w-lg"
              href="/settings/plans"
            >
              <Button>
                Quero renovar minha assinatura agora
                <Zap color="#FFF" fill="#fff"></Zap>
              </Button>
            </Link>
            <Link
              className="flex flex-col justify-center w-lg"
              href="/dashboard"
            >
              <div className=" flex py-2 items-center justify-center rounded">
                <AlertDialogCancel className="bg-[#121215] text-[#A0A0A9] rounded-lg w-[80%] h-[41px]">
                  Continuar sem acesso (por enquanto)
                </AlertDialogCancel>
              </div>
            </Link>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
