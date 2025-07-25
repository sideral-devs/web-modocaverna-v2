'use client'

import { useSearchParams } from 'next/navigation'
import { MutableRefObject, useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Cabeçalho e Navegação',
    description:
      'Aqui no topo, você acessa os filtros, configurações da agenda e sincronização com o Google. Controle total do seu tempo em poucos cliques.',
    elementId: 'calendar-header',
    dialogPosition: 'bottom',
  },
  {
    id: 2,
    title: 'Visão Semanal e Diária',
    description:
      'Visualize seus compromissos da semana ou de um único dia com clareza. Clique em qualquer horário para adicionar novas tarefas.',
    elementId: 'calendar-views',
    dialogPosition: 'bottomLeft',
  },
  {
    id: 3,
    title: 'Botão de novo compromisso',
    description:
      'Quer agendar algo novo? É só clicar no botão ‘+’. Rápido, simples e organizado como deve ser.',
    elementId: 'add-event-button',
    dialogPosition: 'bottom',
  },
  // {
  //   id: 4,
  //   title: 'Integração com o Flow',
  //   description:
  //     'Se um compromisso for de foco, você poderá ativar o modo Flow direto daqui. Planejamento e execução andando juntos.',
  //   elementId: 'flow-toggle',
  //   dialogPosition: 'right',
  // },
]

export function CalendarTour({
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
    const doneCalendarTour = localStorage.getItem('doneCalendarTour')
    if (
      (startTour === 'true' || doneCalendarTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneCalendarTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      containerRef={containerRef}
      redirect={false}
      origin="/agenda"
    />
  )
}
