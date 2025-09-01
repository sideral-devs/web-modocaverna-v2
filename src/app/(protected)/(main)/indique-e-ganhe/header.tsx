'use client'
import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import { Button } from '@/components/ui/button'
import { MessageCircleQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AffiliatesHeader() {
  const router = useRouter()

  return (
    <Header>
      {/* <h1 className="hidden md:block text-xl font-semibold">
        Indique e Ganhe{' '}
      </h1> */}
      <HeaderTitle className="relative left-4" title="Indique e ganhe" />
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          className="hidden lg:flex h-11 items-center group justify-center px-5 gap-2 rounded-xl transition-all duration-200 hover:bg-white/90"
          onClick={() => {
            router.replace('/indique-e-ganhe?startTour=true')
          }}
        >
          <MessageCircleQuestion className="text-primary" />
        </Button>
        <HeaderClose to="central-caverna" />
      </div>
    </Header>
  )
}
