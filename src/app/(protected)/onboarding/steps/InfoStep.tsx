import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { useUser } from '@/hooks/queries/use-user'
import { AlertOctagonIcon, Lock } from 'lucide-react'
import Image from 'next/image'

export function InfoStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()

  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16 gap-24">
      <div className="flex items-start gap-16">
        <Image
          src={'/images/lobo/apresentando.webp'}
          alt="Capitão Caverna"
          width={269}
          height={405}
        />
        <div className="flex flex-col relative w-[611px] px-14 py-11 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">
            É assim que se fala, {(user ? user.name : 'fulano').split(' ')[0]}!
          </h1>
          <p className="text-zinc-400">
            <strong className="text-white">Eu sou o Capitão Caverna.</strong>{' '}
            Estarei ao seu lado para te guiar nos seus primeiros passos aqui na
            Caverna.
          </p>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#3F0808]/50 rounded-lg">
            <Lock className="text-red-500" size={32} />
            <p className="text-red-500">
              Atenção: cada etapa será crucial para sua jornada. Avance apenas
              depois de ler e entender as instruções
            </p>
          </div>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon className="text-yellow-400" size={32} />
            <p className="text-yellow-400">
              Prepare-se: a Caverna é cheia de desafios e conquistas, mas com o
              Capitão aqui, você estará sempre no caminho certo!
            </p>
          </div>

          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px]"
          />
        </div>
      </div>
      <AutoSubmitButton onClick={onNext}>
        Vamos começar, Capitão
      </AutoSubmitButton>
    </div>
  )
}
