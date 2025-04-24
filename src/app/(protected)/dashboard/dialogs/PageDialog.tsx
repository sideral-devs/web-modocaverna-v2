'use client'
import { api } from '@/lib/api'
import { modals } from '@/lib/constants'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function PageDialog() {
  const [isOpen, setIsOpen] = useState(true)
  const queryClient = useQueryClient()
  const [currentIndex, setCurrentIndex] = useState(0)
  const {
    data: poups,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['modalsActive'],
    queryFn: async () => {
      const res = await api.get('/poups/user/active')
      return res.data as Poup[]
    },
  })

  const currentPopup = poups?.[currentIndex]
  const ModalComponent = currentPopup ? modals[currentPopup.title] : null

  useEffect(() => {
    if (!isOpen && currentPopup) {
      api
        .put(`/poups/user/read/${currentPopup.id}`)
        .then(() => {
          const nextIndex = currentIndex + 1

          if (poups && nextIndex < poups.length) {
            setCurrentIndex(nextIndex)
            setIsOpen(true)
          } else {
            queryClient.invalidateQueries({ queryKey: ['modalsActive'] }) // Atualiza a lista
          }
        })
        .catch((err) => {
          console.error('Erro ao marcar popup como lido:', err)
        })
    }
  }, [isOpen])

  if (isLoading || isError || !currentPopup || !ModalComponent) return null

  return (
    <ModalComponent isOpen={isOpen} setOpen={setIsOpen} poup={currentPopup} />
  )
}
