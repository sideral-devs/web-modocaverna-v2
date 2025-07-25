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

interface PlanCavernosoProps {
  selectedPlan: string
  setSelectedPlan: (plan: 'yearly' | 'monthly') => void
  isUpdatePlan: boolean
  getPlanUrl: () => string
  isOnboarding?: boolean
}

const PLAN_FEATURES = [
  'Curso Modo Caverna',
  'Desafio Caverna',
  'Flow produtividade',
  'Agenda de compromissos',
  'Gerenciamento de Rotina',
  'Rituais',
  'Treinos',
  'Refeições',
  'Gestão de Finanças',
  'Registro de Metas',
  'Lei da atração',
  'Acervo de Conhecimento',
  'Anotações nativas',
  'Lembretes rápidos',
  'Área de cursos completa',
  'Comunidade alcateia',
  'Ranking de prêmios',
  'Indique e ganhe',
  'Suporte via chat',
] as const

export function PlanCavernosoNonOnboarding({
  selectedPlan,
  setSelectedPlan,
  isUpdatePlan,
  getPlanUrl,
  isOnboarding,
}: PlanCavernosoProps) {
  const { data: user } = useUser()
  const [showAllBenefits, setShowAllBenefits] = useState(false)

  const isOnTrial = user?.plan === 'TRIAL' || user?.plan === 'DESAFIO'
  const isAnnualPlan = user?.plan === 'ANUAL'
  const isInactive = user?.status_plan === 'INATIVO'
  const initialFeaturesToShow = selectedPlan === 'monthly' ? 6 : 4
  const featuresToShow = showAllBenefits
    ? PLAN_FEATURES
    : PLAN_FEATURES.slice(0, initialFeaturesToShow)

  return (
    <div
      className={cn(
        'flex flex-col w-full bg-zinc-900 rounded-3xl border-2 border-red-500 transition-all duration-500 ease-in-out',
        showAllBenefits
          ? 'h-auto overflow-visible'
          : 'md:h-[550px] 3xl:h-[650px] overflow-hidden',
      )}
    >
      <div className="flex flex-col relative gap-2">
        {
          <div className="flex absolute top-4  border border-zinc-700 right-4 items-center bg-zinc-800 rounded-full p-1 w-fit">
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
          </div>
        }
        <div
          className={cn(
            'w-full gap-2 flex p-6 pb-0 flex-col',
            isAnnualPlan && 'mb-3',
          )}
        >
          <Avatar className="w-8 h-8 mb-2 rounded-none">
            <AvatarImage
              src={'/images/logo-icon.svg'}
              className="object-contain"
            />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold">Plano Cavernoso</h2>
          <p className="text-zinc-400 font-medium mb-4">
            {isAnnualPlan
              ? 'Aproveite seu plano com economia de 50%'
              : 'Explore todas as ferramentas da plataforma'}
          </p>
        </div>
        {!isUpdatePlan && (isOnTrial || isInactive) && (
          <div className="flex px-3 mb-3 items-center flex-col gap-2">
            <Button
              onClick={() => window.open(getPlanUrl(), '_blank')}
              className={cn(
                'w-full text-base h-[70px]',
                isOnboarding && 'h-[60px]',
              )}
            >
              Fazer upgrade
              <Lightning className="!w-4 !h-4" weight="fill" />{' '}
            </Button>
            {selectedPlan === 'yearly' && (
              <span className="text-zinc-400 font-normal text-xs">
                *cobrado anualmente
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          'relative flex flex-col h-flit border-t border-x border-b bg-zinc-800 rounded-3xl',
          isOnboarding && 'h-auto overflow-hidden',
        )}
      >
        {!isAnnualPlan && (
          <div
            className={`border-b mt-4 md:sticky top-0 p-6 flex justify-between items-start`}
          >
            <div className="flex items-start flex-col gap-2">
              {selectedPlan === 'yearly' && (
                <Badge className="text-emerald-400 mb-2 bg-emerald-900">
                  Economize 50%
                </Badge>
              )}
              {selectedPlan === 'yearly' ? (
                <h2 className="text-white flex items-end gap-2 mb-2 font-semibold text-3xl">
                  12x <span className="text-2xl">de R$30</span>
                </h2>
              ) : (
                <h2 className="text-white flex items-end gap-2 mb-2 font-semibold text-3xl">
                  R$ 49 <span className="text-2xl">/mês</span>
                </h2>
              )}
              <span className="text-zinc-400 font-medium text-sm">
                {selectedPlan === 'yearly' && 'ou R$299 à vista'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-col">
              <span className="text-yellow-50 font-medium text-xs">
                +50 mil usuários
              </span>
              <div className="flex items-center gap-2">
                <Star fill="#F9CB15" size={16} weight="fill" />
                <Star fill="#F9CB15" size={16} weight="fill" />
                <Star fill="#F9CB15" size={16} weight="fill" />
                <Star fill="#F9CB15" size={16} weight="fill" />
                <Star fill="#F9CB15" size={16} weight="fill" />
              </div>
            </div>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-zinc-400 mb-4">
            {isAnnualPlan
              ? 'Ferramentas inclusas no seu plano:'
              : 'Ferramentas contempladas'}
          </h3>
          <ul className="flex flex-col gap-4 overflow-y-auto">
            {featuresToShow.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        {!showAllBenefits && (
          <div className="absolute flex items-end py-[32px] justify-center bottom-0 w-full h-52 bg-gradient-to-t from-zinc-800 via-zinc-800 to-transparent">
            <span
              onClick={() => setShowAllBenefits(!showAllBenefits)}
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
