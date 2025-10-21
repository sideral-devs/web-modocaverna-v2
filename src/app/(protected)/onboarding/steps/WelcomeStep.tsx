import { Button } from '@/components/ui/button'
import Image from 'next/image'
export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex items-center flex-1 mt-16 flex-col w-full p-4 gap-8">
      <Image
        src={'/images/logo-icon.svg'}
        alt="Logo"
        width={57}
        height={48}
      />
      <h1 className="font-semibold leading-tight text-center text-2xl lg:text-3xl">
        <span className="text-primary">Seja bem-vindo(a) ao</span>
        <br />
        <span>Desafio Caverna</span>
        <span className='text-xl relative -top-2'>®</span>
      </h1>
      <p className="lg:text-lg opacity-80 text-center mb-6 max-w-96">
        Você está preparado(a) para a jornada mais
        transformadora da sua vida?
      </p>

      <Button
        onClick={() => onNext()}
        size="lg"
        className="uppercase w-fit"
      >
        Estou pronto(a)!
      </Button>
    </div>
  )
}
