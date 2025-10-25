import { Button } from '@/components/ui/button'
import { LockKeyholeIcon, ShieldAlert } from 'lucide-react'
import Image from 'next/image'

export function ConnectStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 justify-between flex-col w-full">

      <div>
        <h1 className="font-semibold leading-tight text-center text-2xl mb-12 lg:text-3xl">
          <span className="text-primary">Seja bem-vindo(a) ao</span>
          <br />
          <span>Desafio Caverna</span>
          <span className='text-xl relative -top-2'>®</span>
        </h1>

        <div className='flex items-center p-6 w-full mb-5 rounded-xl text-red-500 backdrop-blur-sm gap-6 border border-[#7C1111] bg-[#3F080880]'>
          <ShieldAlert className='size-5' />
          <h3 className='text-sm w-fit'><span className='font-bold'>Atenção:</span> cada etapa será crucial para sua jornada. Avance apenas depois de ler e entender as intruções</h3>
        </div>


        <div className='flex w-full justify-end mb-5'>
          <Button onClick={() => onNext()} size="lg">Entendido!</Button>
        </div>
      </div>

      <div className='flex justify-center mb-10'>
        <Image className='h-64 w-auto' alt='' width={250} height={250} src="/images/onboarding/connectStep.svg" />
      </div>
    </div>
  )
}
