'use client'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { useState } from 'react'
import { PlanDesafio } from '@/components/plans/caverna/leftCollumn/plan-desafio'
import { PlanUpdateToAnnual } from '@/components/plans/cavernoso/plan-update-to-annual'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from 'dayjs'
import { PlanCavernosoActive } from '@/components/plans/cavernoso/plan-cavernoso-active'
import { PlanCavernosoYearlyExpired } from '@/components/plans/cavernoso/plan-cavernoso-expired'
import { PlanCavernosoUpdate } from '@/components/plans/cavernoso/plan-update-for-annual'
import { PlanCavernosoNonOnboarding } from '@/components/plans/cavernoso/plan-cavernoso-nonOnboarding'
import { PlanCavernaNonOnboarding } from '@/components/plans/caverna/plan-caverna-nonOnboarding'
import { PlanCavernosoMonthlyExpired } from '@/components/plans/cavernoso/plan-cavernoso-monthly-expired '

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const { data: user } = useUser()

  if (!user) return null

  const isOnTrial = user.plan === 'TRIAL'
  const isExpired = user.status_plan === 'EXPIRADO'
  const isMonthlyPlan = user.plan === 'MENSAL'
  const isAnnualPlan = user.plan === 'ANUAL'
  const isChallengePlan = user.plan === 'DESAFIO'
  const renovationDate = dayjs(user.data_de_renovacao)
  const today = dayjs()
  const challengeTrial =
    user.plan === 'DESAFIO' &&
    dayjs(user.data_de_compra).add(8, 'day').isAfter(dayjs())

  function getPlanUrl() {
    const indicationCode = user?.codigo_indicacao
      ? `&pid=${user.codigo_indicacao}`
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

  function renderHeader() {
    return (
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
    )
  }

  function renderExpiredAlert() {
    return (
      <div className="flex border border-red-500 bg-red-900/20 rounded-lg p-4 justify-between items-center w-full gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-8 h-8 rounded-none">
            <AvatarImage
              src="/images/logo-icon.svg"
              className="object-contain"
            />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <p className="text-lg text-white">
            {user && user.plan !== 'TRIAL'
              ? `Sua Assinatura expirou em ${dayjs(user.data_de_renovacao).format('DD [de] MMMM [de] YYYY')}`
              : 'Sua avaliação gratuita expirou'}
          </p>
        </div>
        <h3 className="text-red-500 font-bold">
          {user && user.plan === 'TRIAL' ? 'Upgrade' : ''}
        </h3>
      </div>
    )
  }
  function renderTrialExpiredAlert() {
    return (
      <div className="flex border border-red-500 bg-red-900/20 rounded-lg p-4 justify-between items-center w-full gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-8 h-8 rounded-none">
            <AvatarImage
              src="/images/logo-icon.svg"
              className="object-contain"
            />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <p className="text-lg text-white"> Sua avaliação gratuita expirou </p>
        </div>
        <h3 className="text-red-500 font-bold"> Upgrade </h3>
      </div>
    )
  }

  // Caso: Plano Trial
  if (isOnTrial) {
    return (
      <div className="flex flex-col justify-start items-start col-span-3 gap-10">
        {renderHeader()}
        {isExpired && renderExpiredAlert()}
        <PlanDesafio />
        <PlanCavernosoNonOnboarding
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={false}
          getPlanUrl={getPlanUrl}
        />
      </div>
    )
  }
  // Caso 1: Plano Desafio Trial ou Desafio Expirado
  if (isChallengePlan && challengeTrial) {
    return (
      <div className="flex flex-col justify-start items-start col-span-3 gap-10">
        {renderHeader()}
        <div className="flex flex-row gap-8 w-full">
          <PlanDesafio isTrial={challengeTrial} />
          <PlanCavernaNonOnboarding
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            isUpdatePlan={false}
            getPlanUrl={getPlanUrl}
          />
        </div>
      </div>
    )
  } else if (isChallengePlan && !challengeTrial) {
    return (
      <div className="flex flex-col justify-start items-start col-span-3 gap-10">
        {renderHeader()}
        {renovationDate < today
          ? renderExpiredAlert()
          : renderTrialExpiredAlert()}
        <div className="flex flex-row gap-8 w-full">
          <PlanDesafio />
          <PlanCavernaNonOnboarding
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            isUpdatePlan={false}
            getPlanUrl={getPlanUrl}
          />
        </div>
      </div>
    )
  }

  // Caso: Plano Mensal
  if (isMonthlyPlan) {
    return (
      <div className="flex flex-col justify-start items-start col-span-3 gap-10">
        {renderHeader()}
        {isExpired && renderExpiredAlert()}
        {!isExpired && (
          <h2 className="text-3xl font-medium">Aproveite seu plano</h2>
        )}
        <div className="flex items-start w-full gap-4">
          <div className="w-full">
            <div className="w-[85%]">
              <PlanUpdateToAnnual
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                getPlanUrl={getPlanUrl}
              />
            </div>
          </div>
          <PlanCavernosoMonthlyExpired
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            isUpdatePlan={true}
            getPlanUrl={getPlanUrl}
          />
        </div>
      </div>
    )
  }

  // Caso: Plano Anual
  if (isAnnualPlan) {
    if (!isExpired) {
      return (
        <div className="flex flex-col justify-start items-start col-span-3 gap-10">
          {renderHeader()}
          <div className="flex items-start w-full gap-4">
            <PlanCavernosoActive
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              isUpdatePlan={false}
              getPlanUrl={getPlanUrl}
              isExpired={isExpired}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col  justify-start items-start col-span-3 gap-10">
          {renderHeader()}
          {renderExpiredAlert()}
          <div className="w-full flex flex-row">
            <div className="w-full">
              <div className="w-[85%]">
                <PlanCavernosoUpdate
                  selectedPlan={selectedPlan}
                  setSelectedPlan={setSelectedPlan}
                  getPlanUrl={getPlanUrl}
                />
              </div>
            </div>
            <PlanCavernosoYearlyExpired
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              isUpdatePlan={false}
              getPlanUrl={getPlanUrl}
            />
          </div>
        </div>
      )
    }
  }

  // Fallback (caso nenhum plano seja identificado)
  return (
    <div className="flex flex-col justify-start items-start col-span-3 gap-10">
      {renderHeader()}
      <p>Seu plano não foi identificado.</p>
    </div>
  )
}
