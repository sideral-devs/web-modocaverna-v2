// 'use client'
// import { useUser } from '@/hooks/queries/use-user'
// import { api } from '@/lib/api'
// import { modals } from '@/lib/constants'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { useEffect, useState } from 'react'
// import { useTourMenu } from '@/store/tour-menu'

// export default function PageDialog() {
//   const [isOpen, setIsOpen] = useState(true)
//   const queryClient = useQueryClient()
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const { open: tourOpen } = useTourMenu()
//   const {
//     data: poups,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ['modalsActive'],
//     queryFn: async () => {
//       const res = await api.get('/poups/user/active')
//       return res.data as Poup[]
//     },
//     retry: 0,
//   })

//   const currentPopup = poups?.[currentIndex]
//   const { data: user } = useUser()
//   const ModalComponent = currentPopup ? modals[currentPopup.title] : null

//   useEffect(() => {
//     if (!isOpen && currentPopup && Number(user?.tutorial_complete)) {
//       api
//         .put(`/poups/user/read/${currentPopup.id}`)
//         .then(() => {
//           const nextIndex = currentIndex + 1

//           if (poups && nextIndex < poups.length) {
//             setCurrentIndex(nextIndex)
//             setIsOpen(true)
//           } else {
//             queryClient.invalidateQueries({ queryKey: ['modalsActive'] }) // Atualiza a lista
//           }
//         })
//         .catch((err) => {
//           console.error('Erro ao marcar popup como lido:', err)
//         })
//     }
//   }, [isOpen])

//   if (
//     tourOpen ||
//     isLoading ||
//     isError ||
//     !currentPopup ||
//     !ModalComponent ||
//     !Number(user?.tutorial_complete)
//   )
//     return null

//   return (
//     <ModalComponent isOpen={isOpen} setOpen={setIsOpen} poup={currentPopup} />
//   )
// }
