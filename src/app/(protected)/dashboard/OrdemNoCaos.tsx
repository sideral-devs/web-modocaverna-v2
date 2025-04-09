import { Skeleton } from '@/components/ui/skeleton'
import { TabsContent } from '@/components/ui/tabs'
import dynamic from 'next/dynamic'

const NotesCard = dynamic(() => import('./cards/notes'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
const KnowledgeCard = dynamic(() => import('./cards/knowledge'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
const DreamboardCard = dynamic(() => import('./cards/dreamboard'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
const FinanceCard = dynamic(() => import('./cards/finance'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
const RemindersCard = dynamic(() => import('./cards/reminders'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
const GoalCard = dynamic(() => import('./cards/goals'), {
  loading: () => <Skeleton className="flex w-full h-full min-h-[300px]" />,
})
export function OrdemNoCaos({ value }: { value: string }) {
  return (
    <TabsContent value={value}>
      <div className="grid gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 w-full min-h-[336px] gap-2">
          <DreamboardCard />
          <GoalCard />
          <KnowledgeCard />
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 w-full h-[332px] gap-2">
          <FinanceCard />
          <RemindersCard />
          <NotesCard />
        </div>
      </div>
    </TabsContent>
  )
}
