import { cn } from '@/lib/utils'
import { Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUser } from '@/hooks/queries/use-user'

interface PlanUpdateToAnnualProps {
  selectedPlan: string
  setSelectedPlan: (plan: string) => void
  getPlanUrl: () => string
}

export function PlanUpdateToAnnual({
  selectedPlan,
  setSelectedPlan,
  getPlanUrl,
}: PlanUpdateToAnnualProps) {
  const { data: user } = useUser()

  const isActive = user?.plan === 'ATIVO'
  const isMonthlyPlan = user?.plan === 'MENSAL'
  const isAnnualPlan = user?.plan === 'ANUAL'

  if (!isActive) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-medium mb-2">Economize 50%</h2>
        <p className="text-zinc-400 font-medium mb-4">
          Faça o upgrade para o Plano Anual e economize 50% em seu plano.
        </p>
      </div>

      <RadioGroup
        defaultValue="monthly"
        value={selectedPlan}
        onValueChange={setSelectedPlan}
        className="flex flex-col gap-4"
      >
        {/* Current Plan */}
        <div
          className={cn(
            'flex flex-col w-full rounded-lg border relative p-4',
            selectedPlan === 'monthly'
              ? 'border-red-500 bg-zinc-900'
              : 'border-zinc-700 bg-zinc-800/50',
          )}
        >
          <div className="flex items-center gap-4">
            {/* <RadioGroupItem value="monthly" id="monthly" /> */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="monthly" className="text-lg">
                {isMonthlyPlan ? 'Mensal' : 'Anual'}
              </Label>
              {isMonthlyPlan ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">R$ 49</span>
                  <span className="text-zinc-400">/mês</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">R$ 299</span>
                  <span className="text-zinc-400">/ano</span>
                </div>
              )}
            </div>

            <span className="text-yellow-500 absolute right-4 top-4 font-medium text-sm">
              Assinatura atual
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-zinc-400 mb-2 font-medium text-sm">
            Faça o upgrade
          </h4>
          {/* Upgrade Plan */}
          {isAnnualPlan && (
            <div
              className={cn(
                'flex flex-col w-full rounded-lg border relative p-4 px-3',
                selectedPlan === 'yearly'
                  ? 'border-red-500 bg-zinc-900'
                  : 'border-zinc-700 bg-zinc-800/50',
              )}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value="yearly" id="yearly" />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="monthly" className="text-lg">
                    Anual
                  </Label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">12x de R$ 30</span>
                    <span className="text-zinc-400">ou R$299/ano</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      <div className="mt-6">
        <Button
          onClick={() => window.open(getPlanUrl(), '_blank')}
          className="w-full h-[40px] bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          Ativar Plano {selectedPlan === 'yearly' ? 'Anual' : 'Mensal'}{' '}
          <Lightning className="ml-2" weight="fill" />
        </Button>
      </div>
    </div>
  )
}
