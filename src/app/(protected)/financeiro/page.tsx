import { Header, HeaderClose } from '@/components/header'
// import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { ProtectedRoute } from '@/components/protected-route'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
import { FinanceDashboard } from './dashboard'

const WalletsCard = dynamic(() => import('./cards/wallets-card'), {
  loading: () => <Skeleton className="w-full h-96" />,
})

const ExpenseCard = dynamic(() => import('./cards/expense-card'), {
  loading: () => <Skeleton className="w-full h-96" />,
})

export default function Page() {
  return (
    <ProtectedRoute>
      {/* <UpgradeModalTrigger> */}
      <div className="flex flex-col w-full min-h-screen items-center gap-10 overflow-y-auto scrollbar-minimal">
        <Header>
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-emerald-400 text-emerald-400 rounded-full">
            <span className="uppercase text-[10px] font-semibold">
              Minhas Finanças
            </span>
          </div>
          <HeaderClose to="ordem-no-caos" />
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
      </div>
      {/* </UpgradeModalTrigger> */}
    </ProtectedRoute>
  )
}
