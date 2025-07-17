import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import clsx from 'clsx'
import { AlertOctagonIcon, Lock } from 'lucide-react'
import Image from 'next/image'

export function FirstStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative flex-1 w-[140dvh]  justify-between items-start 3xl:gap-24">
      <div className="flex items-start pl-10 3xl:pb-16 pb-4 gap-16">
        <Image
          src={'/images/lobo/bracos-cruzados.png'}
          alt="Capitão Caverna"
          width={219}
          height={401}
        />
        <div className="flex flex-col relative w-[611px] 3xl:px-12 3xl:py-8 px-8 py-6 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-lg">Registre sua entrada na Caverna</h1>
          <div className="w-full flex items-center 3xl:px-5 3xl:py-6  px-4 py-4 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon
              className={clsx('text-yellow-400', 'w-4 h-4', '3xl:w-6 3xl:h-6')}
            />
            <p className="text-yellow-400 3xl:text-base text-[0.85rem]">
              Lembre-se: você jamais sairá pelo mesmo lugar que entrou
            </p>
          </div>
          <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
            Esse registro será salvo e apresentado no último dia do desafio,
            mostrando o quanto você evoluiu ao longo desses 40 dias.
          </p>
          <div className="w-full flex items-center 3xl:px-5 3xl:py-6  px-4 py-4 gap-6 bg-[#3F0808]/50 rounded-lg">
            <Lock
              className={clsx('text-red-500', 'w-7 h-6', '3xl:w-12 3xl:h-12')}
            />
            <p className="text-red-500 3xl:text-base text-[0.85rem]">
              Confidencialidade garantida: Fique tranquilo, suas informações
              estarão seguras. Ninguém, além de você, terá acesso ao seu
              registro.
            </p>
          </div>
          <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
            Então, preparado(a) para dar o primeiro passo nessa jornada de
            transformação?{' '}
          </p>

          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px] top-24"
          />
        </div>
      </div>
      <footer className="flex w-full h-32 justify-center items-end  pb-11 gap-4 border-t">
        <AutoSubmitButton onClick={onNext}>
          Vamos começar, Capitão
        </AutoSubmitButton>
      </footer>
    </div>
  )
}
