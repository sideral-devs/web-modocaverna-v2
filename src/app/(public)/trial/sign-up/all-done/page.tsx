import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PhaseCounter } from '../PhaseCounter'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen overflow-hidden items-center p-4">
      <div className="flex flex-col w-full flex-1 max-w-[590px] items-center p-4 pb-16 gap-7">
        <Image
          src={'/images/logo-icon.svg'}
          alt="Logo"
          width={32}
          height={27}
        />
        <PhaseCounter current={4} total={3} />
        <div className="flex flex-col w-full max-w-lg gap-6">
          <div className="flex flex-col gap-2">
            <span className="flex w-fit px-3 py-1 text-sm font-semibold text-yellow-700 bg-yellow-200 rounded-full">
              7 dias de Avaliação Gratuita
            </span>
            <h1 className="text-2xl font-semibold">
              Você acaba de ganhar um presente!
            </h1>
          </div>
          <p className="text-sm text-zinc-400">
            Você acaba de ganhar 7 dias de teste gratuito do Modo Caverna e
            poderá utilizar todas as ferramentas e funcionalidades que o sistema
            oferece durante esse tempo.
          </p>
          <div className="flex flex-col gap-2">
            <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#32323280]/50 rounded-lg">
              <span className="text-red-500">1</span>
              <p className="text-muted-foreground">Acesse a plataforma</p>
            </div>
            <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#32323280]/50 rounded-lg">
              <span className="text-red-500">2</span>
              <p className="text-muted-foreground">
                Aproveite todas as funcionalidade abaixo:
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {resources.map((res) => (
              <div key={res} className="flex items-center gap-2">
                <CheckIcon className="text-emerald-400" />
                <span className="text-xs text-zinc-400">{res}</span>
              </div>
            ))}
          </div>
          <Link href={'/dashboard'} className="mt-24 self-center">
            <AutoSubmitButton className="w-24">Acessar</AutoSubmitButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

const resources = [
  'Gerenciamento de rotina',
  'Organização de leitura',
  'Flow',
  'Finanças pessoais',
  'Desafio Modo Caverna',
  'Definição de metas',
  'Agenda integrada com Google',
  'Área de conteúdos completa',
  'Comunidade Alcateia',
  'Suporte imediato',
]
