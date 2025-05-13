import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import Image from 'next/image'

export function ConfirmStep({
  onNext,
  isLoading,
}: {
  onNext: () => void
  isLoading: boolean
}) {
  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16 gap-24">
      <div className="flex  flex-col gap-6">
        <div className="flex items-start gap-16">
          <Image
            src={'/images/lobo/bracos-cruzados.png'}
            alt="Capitão Caverna"
            className="absolute -top-2 -left-60"
            width={204}
            height={401}
          />
          <div className="flex flex-col relative w-full max-w-[611px] p-6 lg:px-12 lg:py-8 gap-5 lg:gap-6 border border-zinc-700 rounded-lg">
            <h1 className="text-xl lg:text-2xl">
              Preparei algo especial para você
            </h1>
            <p className="text-sm lg:text-base text-zinc-400">
              Gravei um vídeo curto, de apenas 1 minuto, para te mostrar como
              aproveitar ao máximo todas as funcionalidades do sistema. Nesse
              tour rápido, vou passar por cada ferramenta e mostrar como
              utilizá-las da melhor forma.
            </p>
            <p className="text-sm lg:text-base text-zinc-400">
              O que você ganha com isso?
            </p>
            <div className="flex flex-col w-full gap-2">
              <div className="w-full flex items-center h-[80px] px-6  gap-6 bg-[#32323280]/50 rounded-lg">
                <span className="text-red-500">1</span>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Clareza sobre tudo o que está disponível.
                </p>
              </div>
              <div className="w-full flex items-center h-[80px] p-6 py-4 gap-6 bg-[#32323280]/50 rounded-lg">
                <span className="text-red-500">2</span>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Orientação prática para começar da maneira correta.
                </p>
              </div>
            </div>
            <p className="text-sm lg:text-base text-zinc-400">
              Vamos lá? É rápido e direto ao ponto!
            </p>

            <Image
              src={'/images/triangle-balloon.svg'}
              width={54}
              height={14}
              alt="balloon"
              className="hidden md:block absolute -left-[54px]"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <AutoSubmitButton onClick={onNext} loading={isLoading}>
            Começar o Tour
          </AutoSubmitButton>
        </div>
      </div>
    </div>
  )
}
