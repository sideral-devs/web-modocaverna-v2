'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Planejamento de Refeições',
    description:
      'Defina com antecedência o que vai comer. Planejar é evitar sabotagem e garantir energia pra performar.',
    elementId: 'planejamento-refeicoes',
    dialogPosition: 'top',
  },
  {
    id: 2,
    title: 'Registro Diário',
    description:
      'Anote o que foi consumido. Não precisa ser perfeito — só presente. Quem registra, melhora. Quem mente pra si, repete o ciclo.',
    elementId: 'registro-diario',
    dialogPosition: 'top',
  },
  {
    id: 3,
    title: 'Consistência Visual',
    description:
      'Acompanhe sua sequência de disciplina. Alimentação alinhada com seus objetivos = corpo, mente e energia na mesma frequência.',
    elementId: 'consistencia-visual',
    dialogPosition: 'bottom',
  },
]

export function MealsTour({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneMealsTour = localStorage.getItem('doneMealsTour')
    if (
      (startTour === 'true' || doneMealsTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneMealsTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      redirect={false}
      origin="/refeicoes"
    />
  )
}
