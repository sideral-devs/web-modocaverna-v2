import AutoSubmitButton from "@/components/ui/autoSubmitButton";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { AlertOctagonIcon, LockIcon } from "lucide-react";
import Image from "next/image";

export function FourthStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col relative flex-1 w-[140dvh] justify-between items-start">
      <div className="flex items-start pl-10 3xl:pb-8 pb-4 gap-16">
        <Image
          src={"/images/lobo/bracos-cruzados.png"}
          alt="Capitão Caverna"
          width={228}
          height={374}
        />
        <div className="flex flex-col relative w-[611px] 3xl:px-12 3xl:py-8 px-8 py-6 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="3xl:text-xl text-lg">
            Agora é o momento de se comprometer com a mudança dos seus hábitos.
          </h1>
          <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
            Elimine tudo o que te impede de progredir e implemente novos
            comportamentos que te levem adiante.
          </p>
          <div className="w-full flex items-center 3xl:px-5 3xl:py-6  p-4 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon
              className={clsx("text-yellow-400", "w-6 h-5", "3xl:w-8 3xl:h-6")}
            />
            <p className="text-yellow-400 3xl:text-base text-[0.85rem]">
              A verdadeira transformação acontece nos bastidores, no dia a dia,
              longe dos holofotes.{" "}
            </p>
          </div>
          <div className="w-full flex items-center 3xl:px-5 3xl:py-6  p-4 gap-6 bg-[#3F0808]/50 rounded-lg">
            <LockIcon
              className={clsx("text-red-500", "w-7 h-6", "3xl:w-10 3xl:h-10")}
            />
            <p className="text-red-500 3xl:text-base text-[0.85rem]">
              O Modo Caverna segue um protocolo bem definido, mas é flexível o
              suficiente para se adaptar à sua realidade.
            </p>
          </div>
          <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
            Posso te dar um conselho?
          </p>
          <div className="w-full flex items-center  3xl:px-5 3xl:py-6  p-4 gap-6 bg-[#44430D80]/50 rounded-lg">
            <AlertOctagonIcon
              className={clsx("text-yellow-400", "w-7 h-5", "3xl:w-10 3xl:h-8")}
            />
            <p className="text-yellow-400 3xl:text-base text-[0.85rem]">
              Não pegue leve! Quanto mais disciplinado e comprometido você for,
              maior será o impacto dessa jornada na sua vida.
            </p>
          </div>
          <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
            A decisão é sua. Vamos lá! 🚀
          </p>
          <Image
            src={"/images/triangle-balloon.svg"}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px] top-24"
          />
        </div>
      </div>
      <footer className="flex w-full h-32 justify-center items-end  pb-11 gap-4 border-t">
        <Button onClick={onBack} className="px-5" variant="outline">
          Voltar
        </Button>
        <AutoSubmitButton onClick={onNext}>
          Ok. Me leve ao próximo passo!
        </AutoSubmitButton>
      </footer>
    </div>
  );
}
