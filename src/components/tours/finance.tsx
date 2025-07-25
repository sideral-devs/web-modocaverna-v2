'use client'

import { useSearchParams } from 'next/navigation'
import { MutableRefObject, useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Dashboard Geral',
    description:
      'Veja o panorama geral do seu dinheiro. Controle vem da clareza — e clareza começa aqui.',
    elementId: 'dashboard-financeiro',
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'Lançamentos de Entradas e Saídas',
    description:
      'Anote tudo: o que entra e o que sai. Quem negligencia o pequeno, jamais controla o grande.',
    elementId: 'lancamentos-financeiros',
    dialogPosition: 'top',
  },
  {
    id: 3,
    title: 'Contas e Investimentos (Carteiras)',
    description:
      'Cadastre suas contas bancárias e investimentos. Essa aba representa o que está guardado — sua reserva de guerra.',
    elementId: 'carteiras-financeiras',
    dialogPosition: 'bottom',
  },
  {
    id: 4,
    title: 'Gráficos de Distribuição',
    description:
      'Visualize pra onde seu dinheiro vai. Gaste com intenção, corte o excesso, direcione com propósito.',
    elementId: 'graficos-financas',
    dialogPosition: 'bottom',
  },
]

export function FinanceTour({
  disabled,
  containerRef,
}: {
  disabled?: boolean
  containerRef?: MutableRefObject<HTMLDivElement | null>
}) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneFinanceTour = localStorage.getItem('doneFinanceTour')
    if (
      (startTour === 'true' || doneFinanceTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneFinanceTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      containerRef={containerRef}
      redirect={false}
      origin="/financeiro"
    />
  )
}
