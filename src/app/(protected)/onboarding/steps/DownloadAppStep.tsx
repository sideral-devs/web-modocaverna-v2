import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { Button } from '@/components/ui/button'
import { SiAppstore, SiGoogleplay } from '@icons-pack/react-simple-icons'
import Image from 'next/image'
import Link from 'next/link'

export function DownloadAppStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16 gap-24">
      <div className="flex items-start gap-16">
        <Image
          src={'/images/lobo/Mostrando_app.webp'}
          alt="Capitão Caverna"
          width={271}
          height={403}
        />
        <div className="flex flex-col relative w-[611px] px-14 py-11 gap-6 border border-zinc-700 rounded-lg">
          <h1 className="text-2xl">O app já está disponível</h1>
          <p className="text-zinc-400">
            Você pode baixar o aplicativo na App Store ou no Google Play e
            acessá- lo diretamente do seu celular.
          </p>
          <p className="text-zinc-400">
            <strong className="text-white">
              Porém, para uma melhor experiência inicial,
            </strong>{' '}
            sugiro que você utilize a versão web no desktop.
          </p>
          <p className="text-zinc-400">
            Estou trabalhando em uma nova versão mobile, que vai ficar incrível
            e será lançada em breve!
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
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground">Faça o download</span>
        <div className="flex gap-2">
          <Link
            href={
              'https://play.google.com/store/apps/details?id=com.iurimeira.centralcaverna&hl=pt_BR'
            }
            target="_blank"
          >
            <Button variant="secondary">
              <SiGoogleplay className="text-red-500" />
              Playstore
            </Button>
          </Link>
          <Link
            href={'https://apps.apple.com/br/app/central-caverna/id6544803387'}
            target="_blank"
          >
            <Button variant="secondary">
              <SiAppstore className="text-red-500" />
              Appstore
            </Button>
          </Link>
        </div>
      </div>
      <AutoSubmitButton onClick={onNext}>Tudo bem, Capitão!</AutoSubmitButton>
    </div>
  )
}
