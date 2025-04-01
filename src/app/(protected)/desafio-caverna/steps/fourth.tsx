import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { AlertOctagonIcon, LockIcon } from 'lucide-react'
import Image from 'next/image'

export function FourthStep({
  onNext,
}: {
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col relative flex-1 w-[140dvh] justify-between items-start">
      <div className="flex items-start pl-10 pb-8 gap-16">
        <Image
          src={'/images/lobo/bracos-cruzados.webp'}
          alt="Capitão Caverna"
          width={228}
          height={374}
        />
        <div className="flex flex-col relative w-[611px] px-14 py-11 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">Registre sua entrada na Caverna</h1>
          <p className="text-zinc-400">
            Elimine tudo o que te impede de progredir e implemente novos
            comportamentos que te levem adiante.
          </p>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon className="text-yellow-400" size={32} />
            <p className="text-yellow-400">
              A verdadeira transformação acontece nos bastidores, no dia a dia,
              longe dos holofotes.{' '}
            </p>
          </div>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#3F0808]/50 rounded-lg">
            <LockIcon className="text-red-500" size={32} />
            <p className="text-red-500">
              O Modo Caverna segue um protocolo bem definido, mas é flexível o
              suficiente para se adaptar à sua realidade.
            </p>
          </div>
          <p className="text-zinc-400">Posso te dar um conselho?</p>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon className="text-yellow-400" size={32} />
            <p className="text-yellow-400">
              Não pegue leve! Quanto mais disciplinado e comprometido você for,
              maior será o impacto dessa jornada na sua vida.
            </p>
          </div>
          <p className="text-zinc-400">A decisão é sua. Vamos lá! 🚀</p>
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
          Ok. Me leve ao próximo passo!
        </AutoSubmitButton>
      </footer>
    </div>
  )
}
