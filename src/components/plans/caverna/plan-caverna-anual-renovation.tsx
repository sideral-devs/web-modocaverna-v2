import { Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import { useUser } from '@/hooks/queries/use-user'
import { Dayjs } from 'dayjs'

interface PlanUpdateToAnnualProps {
  selectedPlan: string
  setSelectedPlan: (plan: string) => void
  getPlanUrl: () => string
  renovationDate: Dayjs
  today: Dayjs
}

export function PlanAnnualRenovation({
  selectedPlan,
  setSelectedPlan,
  renovationDate,
  today,
}: PlanUpdateToAnnualProps) {
  const { data: user } = useUser()

  const isAnnualPlan = user?.plan === 'ANUAL'

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-2">
          {renovationDate < today
            ? 'Renove seu Plano Cavernoso'
            : 'Aproveite seu plano'}
        </h2>
      </div>

      <RadioGroup
        defaultValue="monthly"
        value={selectedPlan}
        onValueChange={setSelectedPlan}
        className="flex flex-col gap-4"
      >
        {isAnnualPlan && (
          <div>
            {
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
            }
          </div>
        )}
      </RadioGroup>

      <div className="mt-6">
        {renovationDate < today && (
          <Button
            onClick={() =>
              window.open(
                'https://payment.ticto.app/O6439F777?utm_source=upgrade-mensal',
                '_blank',
              )
            }
            className="w-full h-[40px] bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Renovar Plano {selectedPlan === 'yearly' ? 'Anual' : 'Mensal'}{' '}
            <Lightning className="ml-2" weight="fill" />
          </Button>
        )}
      </div>
    </div>
  )
}
