'use client'

import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { useState } from 'react'

import { PlanCavernoso } from '@/components/plans/plan-cavernoso'
import { PlanDesafio } from '@/components/plans/plan-desafio'
import { PlanUpdateToAnnual } from '@/components/plans/plan-update-to-annual'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlanAnnualRenovation } from '@/components/plans/plan-anual-renovation'

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const { data: user } = useUser()

  function getPlanUrl() {
    const indicationCode = user?.codigo_indicacao
      ? `&pid=${user.codigo_indicacao} `
      : ''

    switch (selectedPlan) {
      case 'yearly':
        return `${env.NEXT_PUBLIC_YEARLY_PLAN}${indicationCode}`
      case 'monthly':
        return `${env.NEXT_PUBLIC_MONTHLY_PLAN}${indicationCode}`
      default:
        return `${env.NEXT_PUBLIC_YEARLY_PLAN}${indicationCode}`
    }
  }

  // const isActive = user?.status_plan === 'ATIVO'
  // const isInactive = user?.status_plan === 'INATIVO'
  const isOnTrial = user?.plan === 'TRIAL'
  const isExpired = user?.status_plan === 'EXPIRADO'
  const isMonthlyPlan = user?.plan === 'MENSAL'
  const isAnnualPlan = user?.plan === 'ANUAL'
  const isChallengePlan = user?.plan === 'DESAFIO'

  return (
    <div className="flex flex-col justify-start items-start col-span-3 gap-10">
      <div className="flex flex-col w-full items-start gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings/account">
                Configurações
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Planos e Upgrades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isExpired && (
        <div className="flex border border-red-500 bg-red-900/20 rounded-lg p-4 justify-between items-center w-full gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-8 h-8 rounded-none">
              <AvatarImage
                src={'/images/logo-icon.svg'}
                className="object-contain"
              />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <p className="text-lg text-white">{`${user.plan !== 'TRIAL' ? 'Seu período de assinatura expirou' : 'Sua avaliação gratuita expirou'}`}</p>
          </div>
          <h3 className="text-red-500 font-bold">{`${user.plan !== 'TRIAL' ? 'Renovar' : 'Upgrade'}`}</h3>
        </div>
      )}

      {!isExpired && (
        <div className="">
          <h2 className="text-3xl font-medium">Aproveite seu plano </h2>
        </div>
      )}

      <div className="flex items-start w-full gap-4">
        {/* FIRST COLUMN */}
        {!isAnnualPlan && isMonthlyPlan ? (
          <PlanUpdateToAnnual
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            getPlanUrl={getPlanUrl}
          />
        ) : (
          <PlanAnnualRenovation
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            getPlanUrl={getPlanUrl}
          />
        )}

        {(isOnTrial || isChallengePlan) && <PlanDesafio />}

        {/* SECOND COLUMN */}
        <PlanCavernoso
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={isMonthlyPlan}
          getPlanUrl={getPlanUrl}
        />
      </div>
    </div>
  )
}
