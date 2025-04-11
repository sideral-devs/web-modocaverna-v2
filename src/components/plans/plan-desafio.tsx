//  import dayjs from 'dayjs'
import { Check } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PlanDesafio({ user }: { user: User }): JSX.Element {
  const listToolsDesafio = [
    'Curso Modo Caverna',
    'Desafio Caverna',
    'Indique e ganhe',
    'Suporte via chat',
  ]
  return (
    <div className="flex h-[455px] w-[337px] border border-zinc-700 rounded-2xl">
      <div className="flex flex-col pt-10 gap-6 w-full">
        <div className="flex flex-col gap-8 pb-4 px-5 items-start justify-center">
          <h4 className="text-yellow-300 text-[14px]">Seu plano atual</h4>
          <h3 className=" text-xl"> Plano Caverna </h3>
          {/* <p className="text-xs">
              Assinatura garantida até{" "}
              <strong className="text-red-700">{dayjs(user.data_de_renovacao).format('DD/MM/YYYY')}</strong>
            </p> */}

          {/* <div className="flex items-end text-emerald-400 gap-2">
          <h3 className="text-5xl">
            R$
            {selectedPlan === 'yearly' ? 299 : 49}
          </h3>
          <span>/ {selectedPlan === 'yearly' ? 'ano' : 'mês'}</span>
        </div> */}
        </div>

        <div className="flex flex-col h-full bg-zinc-800 py-5 px-6 rounded-2xl gap-6">
          <h5 className="text-sm text-zinc-400">Você tem acesso a:</h5>
          <ul className="flex flex-col gap-5">
            {listToolsDesafio &&
              listToolsDesafio.map((tool, index) => (
                <li key={index} className="flex items-center gap-4">
                  <Check size={16} className="text-amber-400" />
                  <span className="text-sm">{tool}</span>
                </li>
              ))}
          </ul>
          {/* <Link
          href={getPlanUrl()}
          target="_blank"
          className="align-center justify-center flex"
        >
          <Button className="mt-6">Desbloquear Funcionalidades</Button>
        </Link> */}
        </div>
      </div>
    </div>
  )
}
