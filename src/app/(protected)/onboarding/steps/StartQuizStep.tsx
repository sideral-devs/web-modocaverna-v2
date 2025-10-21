import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CheckCircle, Clock1 } from 'lucide-react'

export function StartQuizStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-2xl lg:text-3xl mb-3">Momento da Verdade</h1>
        <p className="lg:text-lg text-center mb-16">
          <p className="opacity-80">
            O Modo Caverna não é para todos. é para quem está disposto
            a abandonar o conforto da ilusão
          </p>
        </p>
      </div>

      <p className='font-semibold text-lg mb-6'>
        Para identificar seu perfil Caverna é necessário:
      </p>

      <div className="w-full flex justify-center gap-2.5 md:gap-4 mb-8">
        <div className="flex min-w-48 items-center p-4 md:p-5 gap-3 md:gap-4 text-sm bg-[#3F3F4680] border rounded-lg">
          <CheckCircle className='text-primary' size={25} />
          <p className="text-base">
            5 perguntas <br />diretas
          </p>
        </div>
        <div className="flex min-w-48 items-center p-4 md:p-5 gap-3 md:gap-4 text-sm bg-[#3F3F4680] border rounded-lg">
          <Clock1 className='text-primary' size={25} />
          <p className="text-base">
            Menos de 1 <br />minuto
          </p>
        </div>

      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onNext}
          size="lg"
          className="uppercase transition-all duration-300 hover:-translate-y-1 hover:opacity-90 hover:button-shadow"
        >
          COMEÇAR
        </Button>
      </div>
    </div>
  )
}
