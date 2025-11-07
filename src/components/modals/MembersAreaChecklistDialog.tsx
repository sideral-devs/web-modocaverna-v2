import Image from 'next/image'
import Link from 'next/link'
import { Check, Gift, Play } from 'lucide-react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type ChecklistItem = {
  id: string
  label: string
  description?: string
  href?: string
  completed?: boolean
}

type MembersAreaChecklistDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: ChecklistItem[]
  onItemAction?: (id: string) => void
}

export function MembersAreaChecklistDialog({
  open,
  onOpenChange,
  items,
  onItemAction,
}: MembersAreaChecklistDialogProps) {
  const total = items.length
  const completed = items.filter((item) => item.completed).length
  const progress = total > 0 ? (completed / total) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-none bg-transparent p-0 text-white shadow-2xl sm:rounded-[32px]">
        <div className="flex flex-col gap-8 rounded-[32px] bg-[#09090B] lg:flex-row">
          <div className="relative flex items-end justify-center rounded-t-[32px] bg-gradient-to-b from-zinc-900 via-zinc-900 to-black px-10 pt-8 lg:rounded-tl-[32px] lg:rounded-bl-[32px]">
            <Image
              src="/images/lobo/apontando.png"
              alt="Mascote Modo Caverna apontando"
              width={250}
              height={420}
              priority
              className="drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-t-[32px] border border-white/5 lg:rounded-tl-[32px] lg:rounded-bl-[32px]" />
          </div>

          <div className="flex flex-1 flex-col gap-6 px-8 pb-10 pt-8">
            <DialogHeader className="items-start border-b-0 p-0 text-left">
              <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-4 w-4" />
                </span>
                Complete e Ganhe
              </p>
              <DialogTitle className="text-3xl font-semibold">
                Complete o checklist e ganhe um presente!
              </DialogTitle>
              <DialogDescription className="text-base text-zinc-300">
                Siga os 3 passos para desbloquear o beneficio especial preparado
                pela alcateia.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  index={index}
                  onItemAction={onItemAction}
                />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                <span>Progresso</span>
                <span>
                  {completed}/{total || 0}
                </span>
              </div>
              <Progress value={progress} className="h-2 bg-white/5" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ChecklistRow({
  item,
  index,
  onItemAction,
}: {
  item: ChecklistItem
  index: number
  onItemAction?: (id: string) => void
}) {
  const isDisabled = !item.href
  const handleAction = () => {
    if (isDisabled) return
    onItemAction?.(item.id)
  }
  const rowContent = (
    <>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-sm font-semibold transition-all',
            item.completed
              ? 'bg-primary text-black border-primary/40'
              : 'bg-black/40 text-white/60',
          )}
        >
          {item.completed ? (
            <Check className="h-5 w-5" />
          ) : (
            (index + 1).toString().padStart(2, '0')
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-base font-medium leading-tight">
            {item.label}
          </span>
          {item.description ? (
            <span className="text-sm text-white/60">{item.description}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-red-700 to-primary px-3 py-2 text-white">
        <Play className="h-4 w-4 fill-white" />
      </div>
    </>
  )

  if (isDisabled) {
    return (
      <div
        className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 opacity-60"
        aria-disabled="true"
      >
        {rowContent}
      </div>
    )
  }

  return (
    <DialogClose asChild>
      <Link
        href={item.href || ""}
        onClick={handleAction}
        className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.04] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.08]"
      >
        {rowContent}
      </Link>
    </DialogClose>
  )
}
