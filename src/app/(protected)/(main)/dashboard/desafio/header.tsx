'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { MembersAreaChecklistDialog } from '@/components/modals/MembersAreaChecklistDialog'
import { SidebarMenuTrigger } from '@/components/sidebar-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { UserDropdown } from '@/components/user-dropdown'
import { useUser } from '@/hooks/queries/use-user'
import {
  ArrowRight,
  CheckIcon,
  DollarSign,
  Gift,
  MenuIcon,
  Star,
  X,
  ZapIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  CHALLENGE_CHECKLIST_ID,
  MEMBERS_AREA_FLOATING_CARD_KEY,
  WATCH_COURSE_CHECKLIST_ID,
} from '@/constants/storageKeys'
import {
  MEMBERS_AREA_CHECKLIST_EVENT,
  markChecklistItem,
  readMembersChecklist,
} from '@/lib/members-area-checklist'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { UpgradeDialogExpiredTrial } from '../UpgradeDialogExpiredTrial'

type FloatingState = {
  visible: boolean
  collapsed: boolean
  unlocked: boolean
}

const defaultFloatingState: FloatingState = {
  visible: false,
  collapsed: false,
  unlocked: false,
}

export function DesafioDashboardHeader() {
  const { data: user } = useUser()
  const router = useRouter()
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [checklistProgress, setChecklistProgress] = useState<
    Record<string, boolean>
  >({})
  const [floatingState, setFloatingState] =
    useState<FloatingState>(defaultFloatingState)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [activatingReward, setActivatingReward] = useState(false)

  const checklistItems = useMemo(
    () => [
      {
        id: WATCH_COURSE_CHECKLIST_ID,
        label: 'Assistir o curso Modo Caverna',
        href: '/dashboard/desafio/members-area/watch/1/1/1',
        completed: Boolean(checklistProgress[WATCH_COURSE_CHECKLIST_ID]),
      },
      {
        id: CHALLENGE_CHECKLIST_ID,
        label: 'Iniciar o Desafio Caverna',
        href: '/dashboard/desafio/desafio-caverna',
        completed: Boolean(checklistProgress[CHALLENGE_CHECKLIST_ID]),
      },
      {
        id: 'indicate',
        label: 'Acessar Indique e Ganhe',
        href: '/dashboard/desafio/indique-e-ganhe',
        completed: Boolean(checklistProgress.indicate),
      },
    ],
    [checklistProgress],
  )

  const allChecklistCompleted = useMemo(
    () =>
      checklistItems.length > 0 &&
      checklistItems.every((item) => item.completed),
    [checklistItems],
  )

  const showRewardView = allChecklistCompleted && !user?.desafio_started_trial
  const floatingCardVisible = floatingState.visible

  const persistFloatingCard = useCallback((state: FloatingState) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
      MEMBERS_AREA_FLOATING_CARD_KEY,
      JSON.stringify(state),
    )
  }, [])

  const updateFloatingState = useCallback(
    (updater: (prev: FloatingState) => FloatingState) => {
      setFloatingState((prev) => {
        const next = updater(prev)
        if (
          next.visible === prev.visible &&
          next.collapsed === prev.collapsed &&
          next.unlocked === prev.unlocked
        ) {
          return prev
        }
        persistFloatingCard(next)
        return next
      })
    },
    [persistFloatingCard],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateProgress = () => {
      setChecklistProgress(readMembersChecklist())
    }

    updateProgress()
    window.addEventListener(MEMBERS_AREA_CHECKLIST_EVENT, updateProgress)

    const storedFloating = window.localStorage.getItem(
      MEMBERS_AREA_FLOATING_CARD_KEY,
    )
    if (storedFloating) {
      try {
        const parsed = JSON.parse(storedFloating) as FloatingState
        setFloatingState({
          visible: Boolean(parsed.visible),
          collapsed: Boolean(parsed.collapsed),
          unlocked: Boolean(parsed.unlocked),
        })
      } catch {
        window.localStorage.removeItem(MEMBERS_AREA_FLOATING_CARD_KEY)
      }
    }

    return () =>
      window.removeEventListener(MEMBERS_AREA_CHECKLIST_EVENT, updateProgress)
  }, [])

  const handleChecklistItemClick = useCallback((id: string) => {
    if (id === WATCH_COURSE_CHECKLIST_ID || id === CHALLENGE_CHECKLIST_ID) {
      return
    }

    const updated = markChecklistItem(id)
    if (updated) {
      setChecklistProgress(updated)
    }
  }, [])

  const handleOpenChecklist = () => {
    setChecklistOpen(true)
    updateFloatingState((prev) =>
      prev.unlocked ? prev : { ...prev, unlocked: true },
    )
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setChecklistOpen(nextOpen)
    if (!nextOpen) {
      updateFloatingState((prev) => {
        if (!prev.unlocked || prev.visible) {
          return prev
        }
        return { ...prev, visible: true, collapsed: false }
      })
    }
  }

  const handleFloatingCollapseToggle = (collapse: boolean) => {
    updateFloatingState((prev) => {
      if (!prev.visible || prev.collapsed === collapse) {
        return prev
      }
      return { ...prev, collapsed: collapse }
    })
  }

  const handleRedeemReward = () => {
    setRewardDialogOpen(true)
  }

  const handleActivateReward = async () => {
    try {
      setActivatingReward(true)
      await api.post('/desafio-start-trial')
      updateFloatingState((prev) => ({ ...prev, visible: false }))
      router.push('/dashboard?startTour=true&tourRedirect=true')
    } catch {
      toast.error('Não foi possível ativar o benefício agora.')
    } finally {
      setActivatingReward(false)
      setRewardDialogOpen(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <MembersAreaChecklistDialog
        open={checklistOpen}
        onOpenChange={handleDialogOpenChange}
        items={checklistItems}
        onItemAction={handleChecklistItemClick}
      />
      <RewardDialog
        open={rewardDialogOpen}
        onOpenChange={setRewardDialogOpen}
        onActivate={handleActivateReward}
        loading={activatingReward}
        userName={user?.name}
      />
      {floatingCardVisible ? (
        <FloatingChecklistCard
          items={checklistItems}
          collapsed={floatingState.collapsed}
          showRewardView={showRewardView}
          onCollapseToggle={handleFloatingCollapseToggle}
          onItemAction={handleChecklistItemClick}
          onRedeemReward={handleRedeemReward}
        />
      ) : null}
      <header className="flex w-full max-w-8xl items-center justify-between px-5">
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/dashboard/desafio/members-area">
            <div className="flex h-11 items-center justify-center px-3 rounded-xl">
              <Image
                src={'/icons/logo-completo.svg'}
                alt="Logo"
                width={130}
                height={40}
              />
            </div>
          </Link>
        </div>
        <SidebarMenuTrigger>
          <div className="flex lg:hidden h-11 items-center justify-center bg-card px-3 rounded-xl">
            <MenuIcon className="text-primary" />
          </div>
        </SidebarMenuTrigger>
        {user.desafio_started_trial ? (
          <div className="flex max-w-sm lg:max-w-[600px] bg-card rounded-lg px-4 py-2 gap-3 items-center justify-center">
            <Link href="settings/plans" prefetch={false}>
              <div className="flex w-full items-center justify-center text-white">
                <div className="flex flex-col">
                  <span className="text-green-600">
                    Seu acesso ao Desafio Caverna continua ativo.
                  </span>
                  <p className="text-xs">
                    O teste do Plano Cavernoso com ferramentas extras terminou.
                  </p>
                  <span className="text-xs text-yellow-500">
                    Quer manter os recursos avançados? Aproveite o desconto!
                  </span>
                </div>
              </div>
            </Link>
            <div className="flex">
              <UpgradeDialogExpiredTrial>
                <Button
                  className="flex rounded-xl text-[10px] pulsating-shadow lg:max-w-32 gap-1 px-2"
                  size="sm"
                >
                  <ZapIcon className="fill-white" size={16} />
                  <span className="w-full break-words whitespace-normal text-[10px] uppercase">
                    Fazer upgrade com desconto
                  </span>
                </Button>
              </UpgradeDialogExpiredTrial>
            </div>
          </div>
        ) : (
          <div
            onClick={showRewardView ? handleRedeemReward : handleOpenChecklist}
            className="flex max-w-sm lg:max-w-[600px] bg-card cursor-pointer rounded-lg px-4 py-2 gap-3 items-center justify-center"
          >
            <div className="flex w-full items-center justify-center gap-4">
              <div className="flex flex-col w-7 h-7 items-center justify-center bg-white rounded-full">
                <CheckIcon
                  className="text-primary"
                  size={16}
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    'font-semibold',
                    showRewardView ? 'text-yellow-400' : 'text-red-500',
                  )}
                >
                  {showRewardView
                    ? 'Parabéns! Checklist concluído'
                    : 'Você destravou um presente secreto'}
                </span>
                <p className="text-xs opacity-60">
                  {showRewardView
                    ? 'Seu presente está pronto para ser ativado.'
                    : 'Clique aqui e veja se você está pronto para receber.'}
                </p>
              </div>
            </div>
            <div className="flex ml-2">
              <Button
                className={cn(
                  'flex rounded-xl text-[10px] gap-1 px-3',
                  showRewardView
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'text-primary pulsating-shadow',
                )}
                size="sm"
                variant={showRewardView ? 'default' : 'secondary'}
              >
                <ZapIcon
                  className={cn(
                    'size-4',
                    showRewardView ? 'text-white' : 'text-primary',
                  )}
                />
                <span
                  className={cn(
                    'w-full text-[10px] uppercase',
                    showRewardView ? 'text-white' : 'text-primary',
                  )}
                >
                  {showRewardView
                    ? 'Resgatar recompensa'
                    : allChecklistCompleted
                      ? 'Checklist concluído'
                      : 'Ver checklist'}
                </span>
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Link href="/indique-e-ganhe">
            <div className="hidden lg:flex h-11 items-center group hover:bg-green-500 justify-center bg-card px-5 gap-2 rounded-xl">
              <DollarSign
                className="text-green-500 group-hover:text-white"
                size={20}
              />
              <span className="text-sm">Indique e Ganhe</span>
            </div>
          </Link>
          <UserDropdown />
        </div>
      </header>
    </>
  )
}

type FloatingChecklistCardProps = {
  items: Array<{
    id: string
    label: string
    href?: string
    completed?: boolean
  }>
  collapsed: boolean
  showRewardView: boolean
  onCollapseToggle: (collapsed: boolean) => void
  onItemAction: (id: string) => void
  onRedeemReward: () => void
}

function FloatingChecklistCard({
  items,
  collapsed,
  showRewardView,
  onCollapseToggle,
  onItemAction,
  onRedeemReward,
}: FloatingChecklistCardProps) {
  const completed = items.filter((item) => item.completed).length
  const total = items.length
  const progress = total > 0 ? (completed / total) * 100 : 0

  if (collapsed) {
    return (
      <button
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-semibold uppercase text-white shadow-2xl"
        onClick={() => onCollapseToggle(false)}
      >
        <Gift className="h-4 w-4" />
        {showRewardView
          ? 'Resgatar recompensa'
          : `Checklist ${completed}/${total}`}
      </button>
    )
  }

  if (showRewardView) {
    return (
      <div className="fixed bottom-6 left-6 z-[9999999999] w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#09090B] p-4 py-6 shadow-2xl backdrop-blur-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Star className="h-4 w-4 text-yellow-400" />
              Parabéns! Você conquistou todos os objetivos
            </div>
            <p className="text-xs text-white/60">
              Sua recompensa está pronta para ser desbloqueada.
            </p>
          </div>
          <button
            className="rounded-full border border-white/15 p-1 text-white/70 transition hover:text-white"
            onClick={() => onCollapseToggle(true)}
            aria-label="Minimizar checklist"
          >
            <X className="h-4 w-4 rotate-90" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex flex-col items-center justify-center py-3 text-white">
            <span className="text-lg font-semibold">{completed}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
              Completos
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-3 text-white">
            <span className="text-lg font-semibold text-yellow-400">
              {Math.round(progress)}%
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
              Progresso
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-3 text-white">
            <ZapIcon className="h-4 w-4 text-red-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
              Finalizado
            </span>
          </div>
        </div>
        <button
          className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:border-white/30 hover:bg-white/10"
          onClick={onRedeemReward}
        >
          <span className="flex items-center  gap-2 text-sm font-semibold">
            <Gift className="h-4 w-4 text-primary" />
            Resgatar Recompensa
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9999999999] w-[320px] rounded-2xl border border-white/10 bg-[#09090B] p-4 shadow-2xl backdrop-blur-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Complete e Ganhe</p>
          <p className="text-xs text-white/60">
            {completed}/{total} missões concluídas
          </p>
        </div>
        <button
          className="rounded-full border border-white/15 p-1 text-white/70 transition hover:text-white"
          onClick={() => onCollapseToggle(true)}
          aria-label="Minimizar checklist"
        >
          <X className="h-4 w-4 rotate-90" />
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => (
          <FloatingChecklistRow
            key={item.id}
            item={item}
            index={index}
            onItemAction={onItemAction}
            onCollapseToggle={onCollapseToggle}
          />
        ))}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
          <span>Progresso</span>
          <span>
            {completed}/{total}
          </span>
        </div>
        <Progress value={progress} className="mt-1 h-1.5 bg-white/10" />
      </div>
    </div>
  )
}

function FloatingChecklistRow({
  item,
  index,
  onItemAction,
  onCollapseToggle,
}: {
  item: { id: string; label: string; href?: string; completed?: boolean }
  index: number
  onItemAction: (id: string) => void
  onCollapseToggle: (collapsed: boolean) => void
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-white/30">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
          item.completed
            ? 'bg-primary text-black'
            : 'bg-black/60 text-white/70',
        )}
      >
        {item.completed ? <CheckIcon size={14} /> : index + 1}
      </div>
      <span
        className={cn(
          'text-sm',
          item.completed ? 'text-white/40 line-through' : 'text-white',
        )}
      >
        {item.label}
      </span>
    </div>
  )

  const handleClick = () => {
    onItemAction(item.id)
    onCollapseToggle(true)
  }

  if (!item.href) {
    return (
      <button type="button" className="w-full text-left" onClick={handleClick}>
        {content}
      </button>
    )
  }

  return (
    <Link href={item.href} onClick={handleClick}>
      {content}
    </Link>
  )
}

type RewardDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onActivate: () => void
  loading: boolean
  userName?: string | null
}

function RewardDialog({
  open,
  onOpenChange,
  onActivate,
  loading,
  userName,
}: RewardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-none bg-transparent p-0 text-white shadow-2xl sm:rounded-[32px]">
        <div className="flex flex-col gap-8 rounded-[32px] bg-[#09090B] lg:flex-row">
          <div className="relative flex items-end justify-center rounded-t-[32px] bg-gradient-to-b from-zinc-900 via-zinc-900 to-black px-10 pt-8 lg:rounded-tl-[32px] lg:rounded-bl-[32px]">
            <Image
              src="/images/lobo/apontando.png"
              alt="Mascote Modo Caverna"
              width={250}
              height={420}
              priority
              className="drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-t-[32px] border border-white/5 lg:rounded-tl-[32px] lg:rounded-bl-[32px]" />
          </div>
          <div className="flex flex-1 h-full justify-center flex-col gap-6 px-8 pb-10 pt-8">
            <DialogHeader className="justify-center items-start border-b-0 p-0 text-left">
              <p className="flex justify-center mb-2 w-full items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-4 w-4" />
                </span>
                Presente desbloqueado
              </p>
              <h3 className="text-3xl text-center mb-2 w-full font-semibold">
                Parabéns, {userName?.split(' ')[0] || 'Caverna'}!
              </h3>
              <DialogDescription className="text-base text-center text-zinc-300">
                Você ganhou{' '}
                <span className="font-semibold text-yellow-300">
                  7 dias de acesso grátis
                </span>{' '}
                à Central Caverna. Conheça as ferramentas que vão turbinar sua
                produtividade, foco e organização.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center flex-col gap-3 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Acesso completo às ferramentas premium
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Suporte prioritário e conteúdo exclusivo
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Cancele a qualquer momento
              </div>
            </div>
            <Button
              size="lg"
              className="w-full bg-primary text-white hover:bg-primary/90"
              onClick={onActivate}
              disabled={loading}
            >
              {loading ? 'Ativando...' : 'Ativar agora'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
