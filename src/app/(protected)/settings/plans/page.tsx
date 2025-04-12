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

  const isOnTrial = user?.status_plan === 'TRIAL'
  const isExpired = user?.status_plan === 'EXPIRADO'
  // const isActive = user?.plan === 'ATIVO'
  const isMonthlyPlan = user?.plan === 'MENSAL'
  // const isAnnualPlan = user?.plan === 'ANUAL'

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

      <div className="flex items-start w-full gap-4">
        {/* FIRST COLUMN */}
        <PlanUpdateToAnnual
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          getPlanUrl={getPlanUrl}
        />

        {isOnTrial || (isExpired && <PlanDesafio />)}

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
