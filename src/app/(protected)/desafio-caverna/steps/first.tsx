import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { AlertOctagonIcon, Lock } from 'lucide-react'
import Image from 'next/image'

export function FirstStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative flex-1 w-[140dvh]  justify-between items-start gap-24">
      <div className="flex items-start pl-10 pb-16 gap-16">
        <Image
          src={'/images/lobo/bracos-cruzados.webp'}
          alt="Capitão Caverna"
          width={219}
          height={401}
        />
        <div className="flex flex-col relative w-[611px] px-16 py-12 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2lg">Registre sua entrada na Caverna</h1>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon className="text-yellow-400" size={32} />
            <p className="text-yellow-400">
              Lembre-se: você jamais sairá pelo mesmo lugar que entrou
            </p>
          </div>
          <p className="text-zinc-400">
            Esse registro será salvo e apresentado no último dia do desafio,
            mostrando o quanto você evoluiu ao longo desses 40 dias.
          </p>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#3F0808]/50 rounded-lg">
            <Lock className="text-red-500" size={32} />
            <p className="text-red-500">
              Confidencialidade garantida: Fique tranquilo, suas informações
              estarão seguras. Ninguém, além de você, terá acesso ao seu
              registro.
            </p>
          </div>
          <p className="text-zinc-400">
            Então, preparado(a) para dar o primeiro passo nessa jornada de
            transformação?{' '}
          </p>

          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px]"
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
