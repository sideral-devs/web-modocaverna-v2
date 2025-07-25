'use client'
import { MessageCircleQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function StartTourButton({ origin }: { origin: string }) {
  const router = useRouter()

  return (
    <Button
      variant="secondary"
      className="hidden lg:flex h-11 items-center group justify-center px-5 gap-2 rounded-xl transition-all duration-200 hover:bg-white/90"
      onClick={() => {
        router.replace(`${origin}?startTour=true`)
      }}
    >
      <MessageCircleQuestion className="text-primary" />
    </Button>
  )
}
