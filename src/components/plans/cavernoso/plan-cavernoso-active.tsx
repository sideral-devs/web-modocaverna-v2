'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/queries/use-user'
import { cn } from '@/lib/utils'
import { Lightning } from '@phosphor-icons/react'
import { Star } from '@phosphor-icons/react/dist/ssr'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
interface PlanCavernosoProps {
  selectedPlan: string
  setSelectedPlan: (plan: 'yearly' | 'monthly') => void
  isUpdatePlan: boolean
  getPlanUrl: () => string
  isOnboarding?: boolean
  isExpired?: boolean
}

const PLAN_FEATURES = [
  'Desafio Caverna',
  'Curso Modo Caverna',
  'Flow Produtividade',
  'Gerenciamento de Rotina',
  'Agenda de Compromissos',
  'Treinos',
  'Rituais',
  'Refeições',
  'Registro de Metas',
  'Gestão de Finanças',
  'Acervo de Conhecimento',
  'Lei da atração',
  'Anotações nativas',
  'Lembretes rápidos',
  'Área de Cursos completa',
  'Comunidade Alcateia',
  'Ranking de Prêmios',
  'Indique e ganhe',
  'Suporte via chat',
] as const

export function PlanCavernosoActive({
  selectedPlan,
  setSelectedPlan,
  isUpdatePlan,
  getPlanUrl,
  isOnboarding,
  isExpired,
}: PlanCavernosoProps) {
  const { data: user } = useUser()
  const [showAllBenefits, setShowAllBenefits] = useState(false)
  const isAnnualPlan = user?.plan === 'ANUAL'
  const isInactive = user?.status_plan === 'INATIVO'
  return (
    <div
      className={cn(
        'flex flex-col transition-all duration-700 overflow-hidden w-full bg-zinc-900 rounded-3xl border-2 border-zinc-700',
        showAllBenefits || isAnnualPlan ? 'h-auto' : 'h-full',
        isOnboarding && '3xl:h-[650px] h-[550px]',
      )}
    >
      <div className="flex flex-col relative gap-2">
        {isInactive && (
          <div className="absolute top-4 right-4 flex items-center bg-zinc-800 border border-zinc-700 rounded-full p-1 w-fit">
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-all',
                selectedPlan === 'yearly'
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-200',
              )}
            >
              Anual
            </button>
            {!isUpdatePlan && (
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all',
                  selectedPlan === 'monthly'
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200',
                )}
              >
                Mensal
              </button>
            )}
          </div>
        )}

        <div className="flex flex-row">
          <div
            className={cn(
              'w-full gap-2 flex p-6 pb-0 flex-col',
              isAnnualPlan && 'mb-3',
            )}
          >
            <Avatar className="w-8 h-8 mb-2 rounded-none">
              <AvatarImage
                src="/images/logo-icon.svg"
                className="object-contain"
              />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">Plano Cavernoso</h2>
            <p className="text-zinc-400 font-medium mb-4">
              {isExpired
                ? 'Aproveite seu plano com economia de 50%'
                : 'Explore todas as ferramentas da plataforma'}
            </p>
          </div>
          <div className="w-full pt-7 pr-6">
            <div className="flex flex-col w-full rounded-lg border relative p-4 px-3 border-zinc-700 bg-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="yearly" className="text-lg">
                    Anual
                  </Label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl ">R$299</span>
                    <span className="">/ano</span>
                  </div>
                </div>
                <span className="text-yellow-500 absolute right-4 top-4 font-medium text-sm">
                  Assinatura atual
                </span>
              </div>
            </div>
          </div>
        </div>
        {!isUpdatePlan && isInactive && (
          <div className="flex px-3 mb-3 items-center flex-col gap-2">
            <Button
              onClick={() => window.open(getPlanUrl(), '_blank')}
              className={cn(
                'w-full text-base h-[70px]',
                isOnboarding && 'h-[60px]',
              )}
            >
              Fazer upgrade <Lightning className="!w-4 !h-4" weight="fill" />
            </Button>
            {selectedPlan === 'yearly' && (
              <span className="text-zinc-400 font-normal text-xs">
                *cobrado anualmente
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative flex flex-col h-fit border-t border-x border-b  bg-zinc-800 rounded-3xl">
        {!isAnnualPlan && (
          <div className="border-b sticky top-0 bg-zinc-800 p-6 flex justify-between items-start">
            <div className="flex items-start flex-col gap-2">
              {selectedPlan === 'yearly' && (
                <Badge className="text-emerald-400 mb-2 bg-emerald-900">
                  Economize 50%
                </Badge>
              )}
              <h2 className="text-white flex items-end gap-2 mb-2 font-semibold text-3xl">
                {selectedPlan === 'yearly' ? '12x de R$30' : 'R$ 49'}
                <span className="text-2xl">
                  {selectedPlan === 'yearly' ? '' : '/mês'}
                </span>
              </h2>
              <span className="text-zinc-400 font-medium text-sm">
                {selectedPlan === 'yearly'
                  ? 'ou R$299 à vista'
                  : 'ou R$49 à vista'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-col">
              <span className="text-yellow-50 font-medium text-xs">
                +50 mil usuários
              </span>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill="#F9CB15" size={16} weight="fill" />
                ))}
              </div>
            </div>
          </div>
        )}
        <ul
          className={cn(
            'flex flex-col gap-4 p-6',
            isOnboarding && 'overflow-y-auto scrollbar-minimal',
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            {PLAN_FEATURES.slice(0, 10).map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
            {PLAN_FEATURES.slice(11, 20).map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
          </div>
        </ul>

        {showAllBenefits && isAnnualPlan && (
          <div className="absolute flex items-end pb-8 justify-center bottom-0 w-full h-52 bg-gradient-to-t from-zinc-800 via-zinc-800 to-transparent">
            <span
              onClick={() => setShowAllBenefits(true)}
              className="text-red-500 cursor-pointer font-medium text-sm"
            >
              Ver todos os benefícios
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
