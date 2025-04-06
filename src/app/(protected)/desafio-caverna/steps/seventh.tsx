/* eslint-disable */
import AutoSubmitButton from "@/components/ui/autoSubmitButton";
import { api } from "@/lib/api";
import { useChallengerStore } from "@/store/challenge";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { se } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SeventhStep() {
  const {
    textarea_oque_motivou,
    textarea_oque_deseja,
    initialSituationPhotos,
    initialReasonPhotos,
    compromisses,
    fail,
  } = useChallengerStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleActivate() {
    try {
      setIsLoading(true);
      const response = await api.post("/desafios/store", {
        textarea_oque_motivou,
        textarea_oque_deseja,
        fotos_situacao_inicial: initialSituationPhotos,
        fotos_oque_motivou_inicial: initialReasonPhotos,
        array_comprometimento: compromisses,
        array_falhar: fail,
        modalidade: "cavernoso_40",
      });

      localStorage.setItem("new-challenge-data", JSON.stringify(response.data));

      localStorage.setItem("challenge-storage", "");

      window.location.href = "/desafio-caverna/dashboard";
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Algo deu errado. Tente novamente.");
      }
    }
  }

  return (
    <div className="flex flex-col relative flex-1 w-[140dvh] justify-between items-start">
      <div className="flex items-start pl-10 3xl:pb-8 pb-4 gap-16">
        <Image
          src={"/images/lobo/apontando.png"}
          alt="Capitão Caverna"
          width={228}
          height={374}
        />
        <div className="flex flex-col relative w-[611px] 3xl:px-12 3xl:py-8 px-8 py-6 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="3xl:text-xl text-lg">
            Enquanto estou criando a tela do seu Desafio Caverna, deixa eu te
            dar alguns avisos importantes.
          </h1>
          <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
            Como se preparar para suportar o desafio?
          </p>
          <div className="w-full flex items-center px-5 3xl:py-6 py-5 gap-6 bg-card rounded-lg">
            <span className="text-red-500">1</span>
            <p className="text-muted-foreground 3xl:text-base text-[0.85rem]">
              Sua jornada começa apenas amanhã. Aproveite esse tempo para
              organizar seus rituais e rotina. Isso vai te ajudar a manter a
              disciplina desde o início.
            </p>
          </div>
          <div className="w-full flex items-center px-5 3xl:py-6 py-5 gap-6 bg-card rounded-lg">
            <span className="text-red-500">2</span>
            <p className="text-muted-foreground 3xl:text-base text-[0.85rem]">
              Encare os próximos dias com seriedade e compromisso. Essa é a
              única maneira de garantir que o desafio realmente funcione.
            </p>
          </div>
          <Image
            src={"/images/triangle-balloon.svg"}
            width={54}
            height={14}
            alt="balloon"
            className="absolute -left-[54px] top-20"
          />
        </div>
      </div>
      <footer className="flex w-full h-32 justify-center items-end  pb-11 gap-4">
        <AutoSubmitButton
          onClick={handleActivate}
          disabled={isLoading}
          className="min-w-[160px] flex justify-center items-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <span>Entendido, Capitão!</span>
          )}
        </AutoSubmitButton>
      </footer>
    </div>
  );
}
