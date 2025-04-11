import { PlanCavernoso } from '@/components/plans/plan-cavernoso'
import { PlanDesafio } from '@/components/plans/plan-desafio'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import { useUser } from '@/hooks/queries/use-user'
import Image from 'next/image'

export function PlansSystem({ onNext }: { onNext: () => void }) {
  const { data: user } = useUser()
  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16  3xl:gap-24 gap-16">
      <div className="flex flex-col justify-between gap-8">
        <div className="flex items-start gap-16">
          <Image
            src={'/images/lobo/bracos-cruzados.png'}
            alt="Capitão Caverna"
            className="absolute top-2 -left-56"
            width={204}
            height={401}
          />
          <div className="flex flex-col relative w-[811px] px-12 pb-8 gap-6rounded-lg">
            <div className="flex justify-center gap-5">
              {user && <PlanDesafio user={user} />}
              {user && <PlanCavernoso />}
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
