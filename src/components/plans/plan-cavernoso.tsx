// import dayjs from 'dayjs'
import { Check } from 'lucide-react'

export function PlanCavernoso() {
  const listToolsCavernoso = [
    'Curso Modo Caverna',
    'Desafio Caverna',
    'Flow produtividade',
    'Agenda de compromissos',
    'Gerenciamento de Rotina',
    'Rituais',
    'Gestão de Finanças',
    'Registro de Metas',
    'Lei da atração',
    'Acervo de Conhecimento',
    'Treino',
    'Alimentação',
    'Acervo de Conhecimento',
    'Gestão de Finanças',
    'Anotações nativas',
    'Lembretes rápidos',
    'Área de cursos completa',
    'Comunidade Alcateia',
    'Ranking de prêmios',
    'Indique e ganhe',
    'Suporte via chat',
    'Assistente Pessoal IA',
  ]

  return (
    <div className="flex h-[455px] w-[337px] border border-red-500 rounded-2xl">
      <div className="flex flex-col  gap-[1.5rem] w-full">
        <div className="bg-emerald-900/30 w-full rounded-tr-2xl rounded-tl-2xl rounded p-4">
          <p className="text-[13px] text-center text-emerald-400">
            Você ganhou 7 dias para experimentar todas as ferramentas do Plano
            Cavernoso!
          </p>
        </div>
        <div className="flex flex-col pb-1  gap-5 px-5 items-start justify-center">
          <h3 className=" text-xl  pb-[0.8rem]"> Plano Cavernoso </h3>

          {/* <div className="flex items-end text-emerald-400 gap-2">
          <h3 className="text-5xl">
            R$
            {selectedPlan === 'yearly' ? 299 : 49}
          </h3>
          <span>/ {selectedPlan === 'yearly' ? 'ano' : 'mês'}</span>
        </div> */}
        </div>

        <div className="flex flex-col  max-h-[298px]  bg-zinc-800 pt-5 pb-3 px-6 rounded-2xl gap-6">
          <h5 className="text-sm text-zinc-400">
            Acesso a todas as ferramentas:
          </h5>
          <ul className="flex max-h-[219px] overflow-auto flex-col gap-5  scrollbar-minimal">
            {listToolsCavernoso &&
              listToolsCavernoso.map((tool, index) => (
                <li key={index} className="flex items-center gap-4">
                  <Check size={16} className="text-zinc-400" />
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
