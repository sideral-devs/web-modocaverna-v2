import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import Image from 'next/image'

export function ActivateCaveModeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16 gap-24">
      <div className="flex items-start gap-16">
        <Image
          src={'/images/lobo/Bracos_Abertos.webp'}
          alt="Capitão Caverna"
          width={350}
          height={395}
        />
        <div className="flex flex-col relative w-[611px] px-14 py-11 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">Ative o Modo Caverna em 2 simples passos</h1>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#32323280]/50 rounded-lg">
            <span className="text-red-500">1</span>
            <p className="text-muted-foreground">
              Após finalizar este tour, dirija-se imediatamente à seção “Cursos
              e Conteúdos”.
            </p>
          </div>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#32323280]/50 rounded-lg">
            <span className="text-red-500">2</span>
            <p className="text-muted-foreground">
              Crie o seu próprio desafio de 40 dias Esse é o verdadeiro coração
              da transformação.
            </p>
          </div>
          <p className="text-zinc-400">
            Para ativar o verdadeiro Modo Caverna, você precisa enterrar de vez
            essa sua versão atual, encontrar seu propósito e traçar um plano de
            ação.
          </p>
          <p className="text-zinc-400">
            Nenhuma ferramenta de produtividade será eficaz se a sua mente ainda
            estiver bagunçada.
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
      <AutoSubmitButton onClick={onNext}>
        Você está certo, Capitão!
      </AutoSubmitButton>
    </div>
  )
}
