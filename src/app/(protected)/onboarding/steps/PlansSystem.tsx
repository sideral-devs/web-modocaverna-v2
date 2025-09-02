import { PlanCavernosoOnboarding } from '@/components/plans/cavernoso/plan-cavernoso-onboarding'
import { PlanDesafio } from '@/components/plans/caverna/leftCollumn/plan-desafio'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import Image from 'next/image'
import { useState } from 'react'

export function PlansSystem({ onNext }: { onNext: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const { data: user } = useUser()

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

  const isMonthlyPlan = user?.plan === 'MENSAL'

  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 3xl:pb-16  3xl:gap-2 gap-2">
      <div className="flex flex-col justify-between gap-8">
        <div className="flex items-start gap-16">
          <Image
            src={'/images/lobo/bracos-cruzados.png'}
            alt="Capitão Caverna"
            className="absolute top-2 -left-56"
            width={204}
            height={401}
          />
          <div className="flex flex-col relative w-[911px] 3xl:p-4 p-4 gap-6 border border-zinc-700 rounded-lg">
            <div className="flex justify-between gap-5">
              <PlanDesafio />
              <PlanCavernosoOnboarding
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                isUpdatePlan={isMonthlyPlan}
                getPlanUrl={getPlanUrl}
                isOnboarding={true}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <AutoSubmitButton onClick={onNext}>
          Você está certo, Capitão!
        </AutoSubmitButton>
      </div>
    </div>
  )
}
