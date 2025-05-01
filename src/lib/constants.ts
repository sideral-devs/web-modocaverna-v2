import DialogCaveStore from '@/app/(protected)/dashboard/dialogs/DialogCaveStore'

export const videos = {
  mindfulness: '67980d2e921b5eb7e8739cea',
  caveRite: '678a9550d66c86f1df86d814',
  challengeTutorial: '67f0291bea0f253b2d1d4ef4',
  challengeTourFinal: '67f3b59d902b8a612190ed20',
  onboardingTutorial: '67f0299ed75d2074cce0f8af',
  codeTutorial: '673ba95084647c000ad93566',
  affiliateTutorial: '67fea6ca3ea2667a8e542ebd',
}

export const modals: Record<
  string,
  (props: {
    isOpen: boolean
    setOpen: (open: boolean) => void
    poup: Poup
  }) => JSX.Element
> = {
  'Vista-se como um Lobo Cavernoso! 🔺🐺': DialogCaveStore,
}
export const WEEK_DAYS = [
  { short: 'Dom', long: 'Domingo', workoutIndex: 0 },
  { short: 'Seg', long: 'Segunda', workoutIndex: 1 },
  { short: 'Ter', long: 'Terça', workoutIndex: 2 },
  { short: 'Qua', long: 'Quarta', workoutIndex: 3 },
  { short: 'Qui', long: 'Quinta', workoutIndex: 4 },
  { short: 'Sex', long: 'Sexta', workoutIndex: 5 },
  { short: 'Sab', long: 'Sábado', workoutIndex: 6 },
]
