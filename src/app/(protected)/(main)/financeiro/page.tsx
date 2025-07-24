'use client'
import { Header, HeaderClose } from '@/components/header'
import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { ProtectedRoute } from '@/components/protected-route'
import { StartTourButton } from '@/components/start-tour-button'
import { FinanceTour } from '@/components/tours/finance'

import { useRef } from 'react'
import ExpenseCard from './cards/expense-card'
import WalletsCard from './cards/wallets-card'
import { FinanceDashboard } from './dashboard'

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <ProtectedRoute>
      <UpgradeModalTrigger>
        <div
          className="flex flex-col w-full min-h-screen items-center gap-10 overflow-y-auto scrollbar-minimal relative"
          ref={containerRef}
        >
          <Header>
            <div className="flex w-fit items-center px-3 py-2 gap-1 border border-emerald-400 text-emerald-400 rounded-full">
              <span className="uppercase text-[10px] font-semibold">
                Minhas Finanças
              </span>
            </div>
            <div className="flex gap-2">
              <StartTourButton origin="/financeiro" />
              <HeaderClose to="ordem-no-caos" />
            </div>
          </Header>
          <section className="flex flex-col w-full max-w-8xl items-center gap-12 p-4">
            <h1 className="text-xl font-semibold">Minha carteira</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-8xl gap-3">
              <WalletsCard />
              <ExpenseCard />
            </div>
          </section>
          <div className="w-full h-1 bg-zinc-800" />
          <FinanceDashboard />
          <FinanceTour containerRef={containerRef} />
        </div>
      </UpgradeModalTrigger>
    </ProtectedRoute>
  )
}
