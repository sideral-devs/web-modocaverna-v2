import { Check, X } from 'lucide-react'

export function PlanDesafio() {
  return (
    <div className="flex  w-80 bg-gradient-to-b from-[#2a2a2a] from-[12%] to-zinc-900 rounded-2xl">
      <div className="flex flex-col py-8 gap-6 w-full">
        <div className="flex items-center justify-center">
          <h3 className=""> Plano Desafio Caverna </h3>

          {/* <div className="flex items-end text-emerald-400 gap-2">
          <h3 className="text-5xl">
            R$
            {selectedPlan === 'yearly' ? 299 : 49}
          </h3>
          <span>/ {selectedPlan === 'yearly' ? 'ano' : 'mês'}</span>
        </div> */}
        </div>
        <div className="w-full h-[1px] bg-zinc-700" />
        <div className="flex flex-col pb-5 px-6 gap-6">
          <span className="flex w-fit px-3 py-1 text-xs font-semibold bg-red-700  rounded-full">
            6 meses de Acesso
          </span>
          <ul className="flex flex-col gap-5">
            <li className="flex items-center gap-4">
              <Check size={16} className="text-emerald-400" />
              <span className="text-xs text-zinc-400">
                Desafio Modo caverna
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Flow Produtividade
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Gestão de Metas Anuais
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Agenda Integrada ao Google
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Gestão Financeira Pessoal
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Assistente Pessoal com IA
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Organização de Biblioteca
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Acesso a Cursos e Vídeos
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Conteúdos Exclusivos
              </span>
            </li>
            <li className="flex items-center gap-4">
              <X size={16} className="text-primary" />
              <span className="text-xs line-through text-zinc-400">
                Suporte Humanizado via Chat
              </span>
            </li>
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
