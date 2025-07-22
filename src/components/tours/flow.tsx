'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Visão Geral do Flow',
    description:
      'Essa é sua central de guerra. É aqui que você organiza, executa e monitora sua produtividade em tempo real.',
    elementId: undefined,
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'Pomodoro',
    description:
      'Use a técnica Pomodoro para manter o foco total em ciclos controlados. Quem controla o tempo, controla os resultados.',
    elementId: 'pomodoro-timer',
    dialogPosition: 'right',
  },
  {
    id: 3,
    title: 'Kanban de Tarefas',
    description:
      'Aqui você arrasta suas tarefas entre colunas: pendente, em execução e concluído. Visual, prático e direto. Ideal pra quem pensa com clareza e age com brutalidade.',
    elementId: 'kanban-board',
    dialogPosition: 'top',
  },
  {
    id: 4,
    title: 'Playlist de Foco e Quadro dos Sonhos',
    description:
      'Ative sua playlist de foco e mantenha o Quadro dos Sonhos visível. Motivação no campo de visão, execução na veia.',
    elementId: 'playlist-quadro-sonhos',
    dialogPosition: 'topLeft',
  },
  {
    id: 5,
    title: 'Análise de Foco',
    description:
      'Acompanhe quanto tempo real de foco você dedicou. Não é sobre fazer muito, é sobre fazer com presença.',
    elementId: 'foco-analise',
    dialogPosition: 'left',
  },
]

export function FlowTour({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneFlowTour = localStorage.getItem('doneFlowTour')
    if (
      (startTour === 'true' || doneFlowTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneFlowTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      redirect={false}
      origin="/flow-produtividade"
    />
  )
}
