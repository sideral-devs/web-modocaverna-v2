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

export function OrdemNoCaos({ value }: { value: string }) {
  return (
    <TabsContent value={value}>
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 w-full h-full md:max-h-[676px] gap-1">
        <DreamboardCard />
        <FinanceCard />
        <KnowledgeCard />
        <NotesCard />
      </div>
    </TabsContent>
  )
}
