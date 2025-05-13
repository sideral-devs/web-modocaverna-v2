import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { useUser } from '@/hooks/queries/use-user'
import { AlertOctagonIcon, Lock } from 'lucide-react'
import Image from 'next/image'

export function InfoStep({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()

  return (
    <div className="flex flex-col relative flex-1 w-full justify-between items-center p-4 pb-16 gap-24">
      <div className="flex flex-col gap-64 lg:gap-24">
        <div className="w-full relative flex items-start gap-8 xl:gap-16">
          <Image
            src={'/images/lobo/apresentando.png'}
            alt="Capitão Caverna absole"
            className="hidden md:block lg:absolute lg:top-2 lg:-left-72"
            width={269}
            height={405}
          />

          <div className="flex flex-col relative w-full max-w-[611px] p-6 lg:px-12 lg:py-8 gap-5 lg:gap-6 border border-zinc-700 rounded-lg">
            <h1 className="text-xl lg:text-2xl">
              É assim que se fala, {(user ? user.name : 'fulano').split(' ')[0]}
              !
            </h1>
            <p className="text-sm lg:text-base text-zinc-400">
              <strong className="text-white">Eu sou o Capitão Caverna.</strong>{' '}
              Estarei ao seu lado para te guiar nos seus primeiros passos aqui
              na Caverna.
            </p>
            <div className="w-full flex items-center p-4 lg:px-5 lg:py-6 gap-5 lg:gap-6 bg-[#3F0808]/50 rounded-lg">
              <Lock className="text-red-500 min-w-4 lg:min-w-6" size={32} />
              <p className="text-red-500 text-xs lg:text-base">
                Atenção: cada etapa será crucial para sua jornada. Avance apenas
                depois de ler e entender as instruções
              </p>
            </div>
            <div className="w-full flex items-center p-4 lg:px-5 lg:py-6 gap-5 lg:gap-6 bg-[#44430D80]/50 rounded-lg">
              <AlertOctagonIcon
                className="text-yellow-400 min-w-4 lg:min-w-6"
                size={32}
              />
              <p className="text-yellow-400 text-xs lg:text-base">
                Prepare-se: a Caverna é cheia de desafios e conquistas, mas com
                o Capitão aqui, você estará sempre no caminho certo!
              </p>
            </div>

            <Image
              src={'/images/triangle-balloon.svg'}
              width={54}
              height={14}
              alt="balloon"
              className="hidden md:block absolute -left-[54px] top-20"
            />
            <Image
              src={'/images/lobo/apresentando-mobile.png'}
              alt="Capitão Caverna absole"
              className="block md:hidden absolute -bottom-8 translate-y-[100%] -right-4"
              width={224}
              height={358}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <AutoSubmitButton onClick={onNext}>
            Vamos começar, Capitão
          </AutoSubmitButton>
        </div>
      </div>
    </div>
  )
}
