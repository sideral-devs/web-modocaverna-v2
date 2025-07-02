import { Button } from '@/components/ui/button'

export function CheckPointStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center p-4 gap-16">
      <div className="flex flex-col items-center gap-6">
        <h1 className="font-bold text-3xl lg:text-4xl">
          Seu Compromisso com o{' '}
          <span className="text-primary">Modo Caverna</span>
        </h1>
        <p className="lg:text-lg opacity-80">
          Cada tocha que se acende, revela quem você pode se tornar.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onNext} size="lg" className="uppercase">
          🔥 Assumo a responsabilidade
        </Button>
      </div>
    </div>
  )
}
