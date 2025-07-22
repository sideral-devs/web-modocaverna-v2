'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Categorias de Postagem',
    description:
      'A comunidade é organizada em: Geral, Experiências, Indicações e Oportunidades. Poste no local certo para ter engajamento e gerar valor real.',
    elementId: 'categorias-postagem',
    dialogPosition: 'top',
  },
  {
    id: 2,
    title: 'Código de Conduta',
    description:
      'Ambiente de crescimento exige postura. Sem spam, sem distração. Aqui é foco, entrega e apoio mútuo.',
    elementId: 'codigo-conduta',
    dialogPosition: 'left',
  },
  {
    id: 3,
    title: 'Interação Estratégica',
    description:
      'Comente, contribua, compartilhe. Quanto mais você se conecta, mais avança. Networking aqui é arma de evolução.',
    elementId: 'interacao-estrategica',
    dialogPosition: 'bottom',
  },
]

export function CommunityTour({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneCommunityTour = localStorage.getItem('doneCommunityTour')
    if (
      (startTour === 'true' || doneCommunityTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneCommunityTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      redirect={false}
      origin="/comunidade"
    />
  )
}
