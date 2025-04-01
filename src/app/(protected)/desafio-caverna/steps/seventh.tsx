import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import Image from 'next/image'
import Link from 'next/link'

export function SeventhStep() {
  return (
    <div className="flex flex-col relative flex-1 w-[140dvh] justify-between items-start">
      <div className="flex items-start pl-10 pb-8 gap-16">
        <Image
          src={'/images/lobo/apontando.webp'}
          alt="Capitão Caverna"
          width={228}
          height={374}
        />
        <div className="flex flex-col relative w-[611px] px-16 py-12 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">
            Enquanto estou criando a tela do seu Desafio Caverna, deixa eu te
            dar alguns avisos importantes.
          </h1>
          <p className="text-zinc-400">
            Como se preparar para suportar o desafio?
          </p>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-card rounded-lg">
            <span className="text-red-500">1</span>
            <p className="text-muted-foreground">
              Sua jornada começa apenas amanhã. Aproveite esse tempo para
              organizar seus rituais e rotina. Isso vai te ajudar a manter a
              disciplina desde o início.
            </p>
          </div>
          <div className="w-full flex items-center px-5 py-6 gap-6 bg-card rounded-lg">
            <span className="text-red-500">2</span>
            <p className="text-muted-foreground">
              Encare os próximos dias com seriedade e compromisso. Essa é a
              única maneira de garantir que o desafio realmente funcione.
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
      <footer className="flex w-full h-32 justify-center items-end  pb-11 gap-4">
        <Link href={'/desafio-caverna/dashboard/tour'}>
          <AutoSubmitButton>Entendido, Capitão!</AutoSubmitButton>
        </Link>
      </footer>
    </div>
  )
}
