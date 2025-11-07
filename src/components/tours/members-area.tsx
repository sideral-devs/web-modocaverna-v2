import { GuidedTour, TutorialStep } from './guided-tour'

const membersAreaSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Comece por aqui',
    description:
      'Use este destaque para retomar o curso atual. Veja aulas restantes e continue sua transformação imediatamente.',
    elementId: 'members-hero',
    dialogPosition: 'right',
  },
  {
    id: 2,
    title: 'Desafio Caverna',
    description:
      'Acesse rapidamente o passo a passo dos 40 dias. Aqui você registra sua evolução e mantém o ritmo da missão.',
    elementId: 'tab-desafio',
    dialogPosition: 'bottom',
  },
  {
    id: 3,
    title: 'Indique & Ganhe',
    description:
      'Entre nesta seção para aplicar as estratégias de indicação e desbloquear recompensas extras.',
    elementId: 'tab-indique',
    dialogPosition: 'bottom',
  },
  {
    id: 4,
    title: 'Bônus exclusivos',
    description:
      'Finalize explorando os bônus: conteúdos complementares e materiais especiais para turbinar seus resultados.',
    elementId: 'tab-bonus',
    dialogPosition: 'bottom',
  },
]

export function MembersAreaTour({
  active,
  setIsActive,
  redirect,
}: {
  active: boolean
  setIsActive: (active: boolean) => void
  redirect?: boolean
}) {
  return (
    <GuidedTour
      data={membersAreaSteps}
      active={active}
      setIsActive={setIsActive}
      redirect={redirect}
      origin="/dashboard/desafio/members-area"
    />
  )
}
