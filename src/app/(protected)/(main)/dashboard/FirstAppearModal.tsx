import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { LiveDialog } from './dialogs/LiveDialog'

export function FirstAppearModal({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)

  const Dialog = LiveDialog

  const CUSTOM_RULES = dayjs().isBefore(dayjs('2025-25-07')) // Alterar quando mudar o modal

  useEffect(() => {
    const hasAppeared = localStorage.getItem('liveModalAppeared')
    if (hasAppeared !== 'true' && !open && !disabled && CUSTOM_RULES) {
      setTimeout(() => {
        setOpen(true)
        localStorage.setItem('liveModalAppeared', 'true')
      }, 2000)
    }
  }, [disabled])

  return <Dialog open={open} setOpen={setOpen} />
}
