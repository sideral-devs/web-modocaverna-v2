'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Quadro dos Sonhos',
    description:
      'Visualize o que você quer conquistar. Aqui é onde seus sonhos ganham forma e ficam à vista — pra te lembrar diariamente o porquê da sua luta',
    elementId: 'dreamboard',
    dialogPosition: 'bottom',
  },
  {
    id: 3,
    title: 'Cartas para o Futuro',
    description:
      'Escreva para o seu eu de amanhã, da próxima semana ou do fim do desafio. Visão clara do futuro gera atitude no presente.',
    elementId: 'future-cards',
    dialogPosition: 'top',
  },
]

export function AttractionLawTour({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneAttractionLawTour = localStorage.getItem('doneAttractionLawTour')
    if (
      (startTour === 'true' || doneAttractionLawTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneAttractionLawTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      redirect={false}
      origin="/lei-da-atracao"
    />
  )
}
