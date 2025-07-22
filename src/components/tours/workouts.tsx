'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Plano Semanal de Treinos',
    description:
      'Organize seus treinos por dia da semana. Disciplina no corpo acelera clareza na mente.',
    elementId: 'plano-treino',
    dialogPosition: 'top',
  },
  {
    id: 2,
    title: 'Cartões de Exercício',
    description:
      'Cada dia traz os exercícios definidos com volume e instrução. É só seguir com intensidade e presença.',
    elementId: 'cartoes-exercicio',
    dialogPosition: 'top',
  },
  // {
  //   id: 3,
  //   title: 'Check de Execução',
  //   description:
  //     'Marque o treino realizado. Um ritual simples que reforça o hábito.',
  //   elementId: 'check-execucao',
  //   dialogPosition: 'bottom',
  // },
  {
    id: 3,
    title: 'Registro de Shape (Evolução Visual)',
    description:
      'Tire fotos e registre medidas. Evolução não se nota de um dia pro outro, mas se constrói em silêncio. Aqui você acompanha sua própria transformação.',
    elementId: 'registro-shape',
    dialogPosition: 'right',
  },
]

export function WorkoutsTour({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneWorkoutsTour = localStorage.getItem('doneWorkoutsTour')
    if (
      (startTour === 'true' || doneWorkoutsTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneWorkoutsTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      redirect={false}
      origin="/exercicios"
    />
  )
}
