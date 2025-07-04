import { Button } from '@/components/ui/button'

export function StartQuizStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col w-full items-center p-4 lg:px-16 gap-12">
      <div className="flex flex-col items-center gap-10">
        <h1 className="font-bold text-2xl lg:text-3xl">Momento da Verdade</h1>
        <p className="lg:text-lg text-center">
          <p className="lg:text-xl">O Modo Caverna não é para todos.</p>
          <p className="opacity-80">
            É para quem está disposto a abandonar o conforto da ilusão.
          </p>
        </p>
      </div>

      <div className="flex items-center p-6 gap-6 bg-red-700/10 rounded-lg border border-red-950">
        <span className="text-2xl">⚠️</span>
        <div className="flex flex-col gap-1">
          <span className="text-red-500 uppercase font-semibold">
            Seja brutalmente honesto.
          </span>
          <p className="text-sm">
            A verdade que você evitar aqui... vai te cobrar lá na frente.
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-6 gap-4 text-sm bg-white/10 border rounded-lg transition-all duration-200 hover:border-red-900 hover:-translate-y-1">
          <p className="text-2xl">🎯</p>
          <p className="text-center">5 perguntas diretas</p>
        </div>
        <div className="flex flex-col items-center p-6 gap-4 text-sm bg-white/10 border rounded-lg transition-all duration-200 hover:border-red-900 hover:-translate-y-1">
          <p className="text-2xl">🕚</p>
          <p className="text-center">Leva menos de 1 minuto</p>
        </div>
        <div className="flex flex-col items-center p-6 gap-4 text-sm bg-white/10 border rounded-lg transition-all duration-200 hover:border-red-900 hover:-translate-y-1">
          <p className="text-2xl">🔍</p>
          <p className="text-center">Descubra seu Perfil Caverna</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button onClick={onNext} size="lg" className="uppercase">
          OK, Vamos nessa!
        </Button>
      </div>
    </div>
  )
}
