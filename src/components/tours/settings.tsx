'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Perfil Pessoal',
    description:
      'Atualize seu nome, foto e informações básicas. Um guerreiro se apresenta com clareza.',
    elementId: 'settings-user',
    dialogPosition: 'right',
  },
  {
    id: 2,
    title: 'Plano e Assinatura',
    description:
      'Veja seu plano atual e altere quando quiser. O plano Cavernoso libera tudo: hábitos, financeiro completo, treinos, benefícios e muito mais.',
    elementId: 'settings-subscription',
    dialogPosition: 'bottom',
  },
]

export function SettingsTour({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams()
  const startTour = params.get('startTour')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const doneSettingsTour = localStorage.getItem('doneSettingsTour')
    if (
      (startTour === 'true' || doneSettingsTour !== 'true') &&
      !active &&
      !disabled
    ) {
      setActive(true)
      localStorage.setItem('doneSettingsTour', 'true')
    }
  }, [startTour, disabled])

  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setActive}
      redirect={false}
      origin="/settings"
    />
  )
}
