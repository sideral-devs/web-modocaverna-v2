'use client'
import { ProductivityChart } from '@/components/charts/productivity'
import { Header, HeaderClose } from '@/components/header'
import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import PomodoroTimer from '@/components/pomodoro'
import { ProtectedRoute } from '@/components/protected-route'
import { Card } from '@/components/ui/card'
import dayjs from 'dayjs'
import { AlarmClock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ChecklistDialog } from './checklist-dialog'
import { Board } from './tasks'

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const lastOpenedTimestamp = localStorage.getItem('checklistModalLastOpened')

    if (!lastOpenedTimestamp) {
      setIsOpen(true)
      return
    }

    const lastOpened = dayjs(parseInt(lastOpenedTimestamp, 10))
    const nextOpenTime = lastOpened.add(1, 'day').hour(4).minute(0).second(0)

    if (dayjs().isAfter(nextOpenTime)) {
      setIsOpen(true)
    }
  }, [])

  return (
    <ProtectedRoute>
      <UpgradeModalTrigger>
        <div className="flex flex-col w-full min-h-screen items-center gap-[36px] overflow-y-auto scrollbar-minimal">
          <Header>
            <div className="flex w-fit items-center px-3 py-2 gap-1 border border-cyan-400 text-cyan-400 rounded-full">
              <AlarmClock size={16} />
              <span className="uppercase text-[10px] font-semibold">
                Flow Produtividade
              </span>
            </div>
            <HeaderClose />
          </Header>
          <section className="grid grid-cols-1 md:grid-cols-2 w-full max-w-8xl gap-6 p-4 py-0">
            <PomodoroTimer />
            <Card className="flex flex-col w-full h-80 xl:h-96 p-5 gap-10">
              <div className="flex w-full items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-[0.1rem]" />
                  <span className="text-sm">Produtividade</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-[0.1rem]" />
                  <span className="text-sm">Estudos</span>
                </div>
              </div>
              <ProductivityChart className="flex-1 max-w-full max-h-full overflow-hidden" />
            </Card>
          </section>
          <div className="w-full h-1 bg-zinc-800" />
          <section className="flex flex-col w-full max-w-8xl gap-6 p-4 pt-0 pb-32">
            <h2 className="text-xl font-semibold">Quadro de tarefas</h2>
            <div className="position-relative">
              <div className="w-full absolute left-0 h-[2px] bg-zinc-800" />
            </div>
            <Board isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          </section>
          <ChecklistDialog open={isOpen} setOpen={setIsOpen} />
        </div>
      </UpgradeModalTrigger>
    </ProtectedRoute>
  )
}
