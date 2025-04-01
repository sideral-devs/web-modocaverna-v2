import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'

export function PomodoroButton({
  props,
}: {
  props: React.ComponentProps<typeof Button>
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        buttonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return <Button ref={buttonRef} {...props} />
}
