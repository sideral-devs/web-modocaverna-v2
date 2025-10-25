import { Button } from '@/components/ui/button'
import { LockKeyholeIcon } from 'lucide-react'
import Image from 'next/image'

export function FirstStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col justify-between items-center flex-1">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold mb-2 w-full leading-tight text-[31px]">
          Sua confidencialidade está garantida!
        </h1>
        <p className="lg:text-lg opacity-80 mb-10 max-w-[595px]">
          Sinta-se seguro ao utilizar as ferramentas e participar dos desafios práticos do sistema.
        </p>
        <div className='flex items-center p-6 w-full mb-5 max-w-[595px] rounded-xl text-red-500 backdrop-blur-sm gap-6 border border-[#7C1111] bg-[#3F080880]'>
          <LockKeyholeIcon />
          <h3 className='w-full'>Seus dados pessoais e informações sensíveis estão protegidos com tecnologia de criptografia avançada.</h3>
        </div>
        <div className='flex w-full justify-end mb-5'>
          <Button onClick={() => onNext()} size="lg">Continuar</Button>
        </div>
      </div>



      <div className='flex justify-center mb-12 items-center'>
        <Image className='h-80 w-auto' alt='' width={250} height={250} src="/images/onboarding/firstStep.svg" />
      </div>
    </div>
  )
}
