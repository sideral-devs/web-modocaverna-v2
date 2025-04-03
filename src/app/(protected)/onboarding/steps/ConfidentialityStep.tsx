import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Lock } from 'lucide-react'
import Image from 'next/image'

export function ConfidentialityStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16 gap-24">
      <div className="flex flex-col justify-between gap-[9.4rem]">
        <div className="flex items-start gap-16">
          <Image
            src={'/images/lobo/legal.webp'}
            alt="Capitão Caverna"
            className="absolute -top-2 -left-60"
            width={213}
            height={395}
          />
          <div className="flex flex-col relative w-[611px] px-12 py-8 gap-6 border border-zinc-700 rounded-lg">
            <h1 className="text-2xl">Confidencialidade garantida</h1>
            <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#3F0808]/50 rounded-lg">
              <Lock className="text-red-500" size={32} />
              <p className="text-red-500">
                Seus dados pessoais e informações sensíveis estão protegidos com
                tecnologia de criptografia avançada.
              </p>
            </div>
            <p className="text-zinc-400">
              Sinta- se seguro ao utilizar as ferramentas e participar dos
              desafios práticos do sistema.
            </p>
            <p className="text-zinc-400">
              <strong className="text-white">
                Tudo aqui é exclusivo para você
              </strong>{' '}
              – ninguém mais terá acesso às suas informações.
            </p>
            <Image
              src={'/images/triangle-balloon.svg'}
              width={54}
              height={14}
              alt="balloon"
              className="absolute -left-[54px] top-[18%]"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <AutoSubmitButton onClick={onNext}>
            Tudo bem, Capitão!
          </AutoSubmitButton>
        </div>
      </div>
    </div>
  )
}
