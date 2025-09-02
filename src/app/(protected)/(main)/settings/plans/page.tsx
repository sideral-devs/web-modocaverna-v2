'use client'
import { PlanDesafio } from '@/components/plans/caverna/leftCollumn/plan-desafio'
import { PlanCavernaNonOnboarding } from '@/components/plans/caverna/plan-caverna-nonOnboarding'
import { PlanCavernosoActive } from '@/components/plans/cavernoso/plan-cavernoso-active'
import { PlanCavernosoYearlyExpired } from '@/components/plans/cavernoso/plan-cavernoso-expired'
import { PlanCavernosoMonthlyExpired } from '@/components/plans/cavernoso/plan-cavernoso-monthly-expired '
import { PlanCavernosoUpdate } from '@/components/plans/cavernoso/plan-update-for-annual'
import { PlanUpdateToAnnual } from '@/components/plans/cavernoso/plan-update-to-annual'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import dayjs from 'dayjs'
import { useState } from 'react'

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const { data: user } = useUser()
  // const { data } = useUser()
  // const user = data
  //   ? {
  //       ...data,
  //       plan: 'MENSAL',
  //       status_plan: 'EXPIRADO',
  //     }
  //   : undefined

  if (!user) return null

  const isOnTrial = user.plan === 'TRIAL'
  const isExpired = user.status_plan === 'EXPIRADO'

  function getPlanUrl() {
    switch (selectedPlan) {
      case 'yearly':
        return env.NEXT_PUBLIC_YEARLY_PLAN
      case 'monthly':
        return env.NEXT_PUBLIC_MONTHLY_PLAN
      default:
        return env.NEXT_PUBLIC_YEARLY_PLAN
    }
  }

  return (
    <div className="w-full flex flex-col justify-start items-start col-span-3 gap-10">
      {isExpired && <ExpiredAlert user={user} />}
      <div className="grid md:grid-cols-2 gap-8 w-full">
        <CurrentPlan
          isTrial={isOnTrial}
          user={user}
          getPlanUrl={getPlanUrl}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
        <UpgradePlan
          user={user}
          getPlanUrl={getPlanUrl}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      </div>
    </div>
  )
}

function CurrentPlan({
  user,
  isTrial,
  getPlanUrl,
  selectedPlan,
  setSelectedPlan,
}: {
  user: User
  isTrial?: boolean
  getPlanUrl: () => string
  selectedPlan: string
  setSelectedPlan: (arg: string) => void
}) {
  const isExpired = user.status_plan === 'EXPIRADO'

  switch (user.plan) {
    case 'MENSAL':
      return (
        <PlanUpdateToAnnual
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          getPlanUrl={getPlanUrl}
        />
      )
    case 'ANUAL':
      return isExpired ? (
        <PlanCavernosoUpdate
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          getPlanUrl={getPlanUrl}
        />
      ) : (
        <PlanCavernosoActive
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={false}
          getPlanUrl={getPlanUrl}
          isExpired={isExpired}
          className="col-span-2"
        />
      )

    default:
      return <PlanDesafio isTrial={isTrial} />
  }
}

function UpgradePlan({
  user,
  getPlanUrl,
  selectedPlan,
  setSelectedPlan,
}: {
  user: User
  getPlanUrl: () => string
  selectedPlan: string
  setSelectedPlan: (arg: string) => void
}) {
  const isExpired = user.status_plan === 'EXPIRADO'

  switch (user.plan) {
    case 'MENSAL':
      return (
        <PlanCavernosoMonthlyExpired
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={true}
          getPlanUrl={getPlanUrl}
        />
      )
    case 'ANUAL':
      return isExpired ? (
        <PlanCavernosoYearlyExpired
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={false}
          getPlanUrl={getPlanUrl}
        />
      ) : null
    default:
      return (
        <PlanCavernaNonOnboarding
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          isUpdatePlan={false}
          getPlanUrl={getPlanUrl}
        />
      )
  }
}

function ExpiredAlert({ user }: { user: User | undefined }) {
  return (
    <div className="flex border border-red-500 bg-red-900/20 rounded-lg p-4 justify-between items-center w-full gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="w-8 h-8 rounded-none">
          <AvatarImage src="/images/logo-icon.svg" className="object-contain" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
        <p className="text-lg text-white">
          {user && user.plan !== 'TRIAL'
            ? `Sua Assinatura expirou em ${dayjs(user.data_de_renovacao).format('DD [de] MMMM [de] YYYY')}`
            : user?.status_plan === 'EXPIRADO'
              ? 'Sua avaliação gratuita expirou'
              : `Sua avaliação gratuita encerra em ${dayjs(user?.data_de_renovacao).diff(dayjs(), 'days') + 1}  dia(s)`}
        </p>
      </div>
      {/* <h3 className="text-red-500 font-bold">
          {user && user.plan === 'TRIAL' ? 'Upgrade' : ''}
        </h3> */}
    </div>
  )
}
