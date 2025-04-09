import { PlanCavernoso } from '@/components/plans/plan-cavernoso'
import { PlanDesafio } from '@/components/plans/plan-desafio'
import AutoSubmitButton from '@/components/ui/autoSubmitButton'
import Image from 'next/image'

export function PlansSystem({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col relative flex-1 justify-between items-center p-4 pb-16 gap-24">
      <div className="flex flex-col justify-between gap-8">
        <div className="flex items-start gap-16">
          <Image
            src={'/images/lobo/bracos-cruzados.png'}
            alt="Capitão Caverna"
            className="absolute -top-2 -left-56"
            width={204}
            height={401}
          />
          <div className="flex flex-col relative w-[711px] px-12 py-8 gap-6 border border-zinc-700 rounded-lg">
            <div className="flex justify-between gap-5">
              <PlanDesafio />
              <PlanCavernoso />
            </div>
          </div>
          <Image
            src={'/images/triangle-balloon.svg'}
            width={54}
            height={14}
            alt="balloon"
            className="absolute top-20 -left-[34px]"
          />
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
