'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { ChatDialog } from '../dialogs/ChatDialog'
import { DesafioDashboardHeader } from './header'

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const [chatModalOpen, setChatModalOpen] = useState(false)

  const { data: user } = useUser()

  useEffect(() => {
    const opened = localStorage.getItem('chatModalOpened')

    if (
      !opened &&
      user &&
      Number(user.tutorial_complete) &&
      Number(user.login_streak) > 1
    ) {
      setChatModalOpen(true)
      localStorage.setItem('chatModalOpened', 'true')
    }
  }, [user])

  if (user && !Number(user.tutorial_complete)) {
    return redirect('/onboarding')
  }

  if (user && user.plan !== 'DESAFIO') {
    return redirect('/dashboard')
  }

  if (user && user.desafio_started_trial) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-screen items-center pt-6 gap-8 relative overflow-y-auto scrollbar-minimal">
        <DesafioDashboardHeader />
        <div className="flex w-full flex-1 max-w-8xl min-h-0 p-4 pb-0">
          <div className="flex flex-col flex-1 w-full h-full gap-5">
            <div className="flex overflow-x-auto min-h-8 data-[tutorial-id=hubs] scrollbar-minimal">
              <Link href={'/dashboard/desafio/members-area'}>
                <Tab active={pathname.includes('/members-area')}>
                  Comece por aqui
                </Tab>
              </Link>
              <Link href={'/dashboard/desafio/desafio-caverna'}>
                <Tab active={pathname.includes('/desafio-caverna')}>
                  Desafio caverna
                </Tab>
              </Link>
              <Link href={'/dashboard/desafio/indique-e-ganhe'}>
                <Tab active={pathname.includes('/indique-e-ganhe')}>
                  Indique e ganhe
                </Tab>
              </Link>
              <Link href={'/dashboard/desafio/bonus'}>
                <Tab active={pathname.includes('/bonus')}>Bônus Exclusivos</Tab>
              </Link>
            </div>
            {children}
          </div>
        </div>
        <div
          className="w-16 h-16 absolute right-5 bottom-4"
          data-tutorial-id="chat-desafio"
        />
        <ChatDialog
          open={chatModalOpen}
          setIsOpen={setChatModalOpen}
          tutorialId="chat-desafio"
        />
      </div>
    </ProtectedRoute>
  )
}

function Tab({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-[6px] text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        active && 'bg-primary text-foreground',
      )}
    >
      {children}
    </div>
  )
}
