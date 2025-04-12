'use client'

import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { useState } from 'react'

import { PlanCavernoso } from '@/components/plans/plan-cavernoso'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Lightning } from '@phosphor-icons/react'
import { PlanUpdateToAnnual } from '@/components/plans/plan-update-to-annual'
import { Check, ToggleLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlanDesafio } from '@/components/plans/plan-desafio'

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
        {/* FIRST PLAN */}
        {/* TODO: Use when the user is not on the Cavernoso Annual plan */}
        {/* <PlanUpdateToAnnual
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          getPlanUrl={getPlanUrl}
        /> */}

        {/* TODO: Use when the user is on the free trial */}
        <PlanDesafio />
        {/* SECOND PLAN */}
        <PlanCavernoso
          selectedPlan={selectedPlan}
          onPlanChange={setSelectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={false}
        />
      </div>
    </div>
  )
}
