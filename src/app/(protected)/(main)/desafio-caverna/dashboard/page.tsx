'use client'
import { ChallengePoints } from '@/components/challenge-points'
import {
  Header,
  HeaderBack,
  HeaderClose,
  HeaderTitle,
} from '@/components/header'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { BadgeCheckIcon, ChevronDown, Loader2, XIcon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ChallengeAbandoned } from './challenge-abandoned'
import { ChallengeStartsTomorrow } from './challenge-starts-tomorrow'
import { CommandmentDialog } from './commandment-dialog.tsx'
import { DailyRegisterDialog } from './daily-register'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

export default function Page() {
  const [commandmentDialogOpen, setCommandmentDialogOpen] = useState(false)
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false)
  const [commandment, setCommandment] = useState<DesafioCommandment | null>(
    null,
  )
  const [initialChallenge, setInitialChallenge] = useState<Challenge | null>(
    null,
  )
  const [isAbandonLoading, setIsAbandonLoading] = useState(false)
  const queryClient = useQueryClient()

  // 1. Recupera dados do localStorage no client-side
  useEffect(() => {
    const storedChallenge = localStorage.getItem('new-challenge-data')
    if (storedChallenge) {
      try {
        const parsed = JSON.parse(storedChallenge)
        if (parsed?.id) {
          setInitialChallenge(parsed)
          localStorage.removeItem('new-challenge-data')
        }
      } catch {
        localStorage.removeItem('new-challenge-data')
      }
    }
  }, [])

  // 2. Consulta da API com prioridade para dados locais
  const { data: apiChallenge, isFetched } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
    enabled: !initialChallenge, // Só faz fetch se não tiver dados locais
    staleTime: 0,
    retry: 1,
  })

  // 3. Merge dos dados (local + API)
  const challenge = initialChallenge || apiChallenge

  const { mutateAsync: startChallengeFn } = useMutation({
    mutationFn: async () => {
      await api.put('/desafios/start')
    },
    onSuccess: () => {
      toast.success('Desafio iniciado!')
      queryClient.invalidateQueries({ queryKey: ['challenge'] })
    },
  })

  async function handleUpdateCommandmentStatus(id: number, completed: boolean) {
    if (!challenge) return

    const rollback = challenge
    try {
      const commandment = challenge.desafio_commandment.find(
        (item: { id: number }) => item.id === id,
      )
      if (!commandment) return

      const updated: Challenge = {
        ...challenge,
        desafio_commandment: challenge.desafio_commandment.map((item) =>
          item.id === id ? { ...item, completed } : item,
        ),
      }
      queryClient.setQueryData(['challenge'], updated)
      await api.put(`/desafios/commandment/${id}/toggle`)
      queryClient.invalidateQueries({ queryKey: ['challenge'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.setQueryData(['challenge'], rollback)
    }
  }

  async function handleLeave() {
    try {
      setIsAbandonLoading(true)
      await api.put('/desafios/abandon')
      queryClient.invalidateQueries({ queryKey: ['challenge'] })
      window.location.href = '/dashboard' // Hard redirect
    } catch {
      toast.error('Não foi possível fazer isso no momento!')
    }
  }

  useEffect(() => {
    const data = dayjs(challenge?.data_de_inicio)
    const today = dayjs().startOf('day')
    const isSameOrBefore = data.isSame(today) || data.isBefore(today)

    if (
      challenge &&
      challenge.status_desafio === 'pausado' &&
      challenge.array_dias.length > 0 &&
      isSameOrBefore
    ) {
      startChallengeFn()
    }
  }, [challenge, startChallengeFn])

  useEffect(() => {
    if (
      challenge &&
      challenge.status_desafio === 'iniciado' &&
      dayjs().hour() >= 19 &&
      !challenge.hojeInfo
    ) {
      setChallengeDialogOpen(true)
    }
  }, [challenge])

  // 4. Controle absoluto de redirecionamentos
  useEffect(() => {
    if (!isFetched) return

    const shouldRedirect =
      !challenge ||
      ['finalizado', 'abandonado'].includes(challenge.status_desafio)

    if (shouldRedirect) {
      window.location.href = '/desafio-caverna'
    }
  }, [challenge, isFetched])

  if (
    challenge &&
    challenge.status_desafio === 'iniciado' &&
    challenge.hojeInfo &&
    ((challenge.modalidade === 'cavernoso_40' && challenge.dia_atual === 40) ||
      (challenge.modalidade === 'express' && challenge.dia_atual === 30) ||
      (challenge.modalidade === 'cavernoso' && challenge.dia_atual === 60))
  ) {
    return redirect('/desafio-caverna/registro-final')
  }

  if (!challenge) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col w-full h-screen items-center overflow-hidden bg-zinc-900',
      )}
    >
      <Header containerClassName="justify-center md:justify-between">
        <div className="absolute left-0 md:hidden">
          <HeaderBack />
        </div>
        <div className="md:hidden">
          <HeaderTitle title="Desafio Caverna" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Image src={'/images/logo.svg'} alt="Logo" width={132} height={35} />
          {challenge && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary border border-primary"
                >
                  Abandonar desafio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col w-[80%] p-7 gap-6">
                  <div className="flex flex-col gap-3">
                    <DialogTitle className="text-lg">
                      Tem certeza que deseja abandonar o desafio?
                    </DialogTitle>
                    <p className="text-sm text-zinc-400">
                      Essa ação pode ser irreversível...
                    </p>
                  </div>
                </div>
                <DialogFooter className="p-4 border-t">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DialogClose>
                  <Button
                    onClick={handleLeave}
                    className="w-[120px]"
                    disabled={isAbandonLoading}
                  >
                    {isAbandonLoading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <span>Abandonar!</span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="hidden xl:flex flex-col gap-2">
          <span className="text-xs text-zinc-500">Legenda</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border rounded" />
              <span className="text-sm">Dia futuro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex w-5 h-5 items-center justify-center border rounded">
                <XIcon size={16} />
              </div>
              <span className="text-sm">Dia nulo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex w-5 h-5 items-center justify-center border rounded">
                <span className="text-emerald-500 text-xs">+1</span>
              </div>
              <span className="text-sm">Dia positivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex w-5 h-5 items-center justify-center border rounded">
                <span className="text-red-500 text-xs">-1</span>
              </div>
              <span className="text-sm">Dia negativo</span>
            </div>
          </div>
        </div>
        {challenge ? (
          <ChallengePoints challenge={challenge} />
        ) : (
          <Skeleton className="w-64 h-4" />
        )}
        <HeaderClose />
      </Header>
      <div className="flex flex-1 w-full max-w-[1512px] mx-auto overflow-hidden">
        <div className="flex flex-col w-72 lg:w-96 h-full border-r bg-black overflow-hidden">
          <div className="flex flex-col p-5 gap-8 border-b">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">Os Mandamentos Caverna</h2>
              <p className="text-sm text-zinc-400">
                Os princípios essenciais para vencer o desafio de 40 dias. Eles
                fortalecem sua mentalidade, disciplina e hábitos para atingir o
                máximo desempenho no Modo Caverna. Siga-os e transforme sua
                rotina.
              </p>
            </div>
            {challenge ? (
              <div className="flex flex-col w-full gap-4">
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold">Seu progresso</span>
                  <span className="text-xs text-zinc-400">
                    {
                      challenge.desafio_commandment.filter(
                        (item: { completed: boolean }) =>
                          item.completed === true,
                      ).length
                    }
                    /{challenge.desafio_commandment.length}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-border rounded-full relative">
                  <div
                    className="absolute -translate-y-1/2 h-[5px] bg-emerald-400 rounded-full"
                    style={{
                      width: `${(challenge.desafio_commandment.filter((item: { completed: boolean }) => item.completed === true).length / challenge.desafio_commandment.length) * 100}%`,
                      left: 0,
                    }}
                  />
                </div>
              </div>
            ) : (
              <Skeleton className="w-full h-3" />
            )}
          </div>
          <div className="flex flex-col h-full max-h-full p-5 pb-32 overflow-y-auto scrollbar-minimal">
            {challenge ? (
              <Accordion
                collapsible
                type="single"
                className="flex flex-col gap-[10px]"
              >
                {challenge.desafio_commandment.map((item) => (
                  <AccordionItem
                    className={cn(
                      'border p-0 rounded-lg',
                      item.completed ? 'border-emerald-700' : 'border-border',
                    )}
                    value={String(item.id)}
                    key={item.id}
                  >
                    <AccordionTrigger
                      className={cn('w-full max-w-full p-4')}
                      noIcon
                    >
                      <div className="flex flex-1 max-w-full gap-2">
                        <span className="w-full flex-1 truncate">
                          {item.commandment.number}. {item.commandment.title}
                        </span>
                        {item.completed && (
                          <div className="flex items-center justify-center w-4 h-4 border border-emerald-400 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <div className="flex flex-col max-h-36 px-4 py-2 gap-4 overflow-y-auto scrollbar-minimal">
                        <p className="text-sm text-zinc-400">
                          {item.commandment.short_description}
                        </p>
                        <Button
                          size="sm"
                          className="w-fit min-h-9"
                          onClick={() => {
                            setCommandment(
                              item as unknown as DesafioCommandment,
                            )
                            setCommandmentDialogOpen(true)
                          }}
                        >
                          Ver mais
                        </Button>
                      </div>
                      {challenge.status_desafio !== 'pausado' && (
                        <div className="flex w-full p-3 gap-2 border-t">
                          <Checkbox
                            className="rounded-full border-emerald-400 data-[state=checked]:bg-emerald-400"
                            checked={item.completed}
                            disabled={challenge.status_desafio === 'pausado'}
                            onCheckedChange={(val) => {
                              const checked = val.valueOf() === true || false
                              handleUpdateCommandmentStatus(item.id, checked)
                            }}
                          />
                          <span>Marcar como concluído</span>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}{' '}
              </Accordion>
            ) : (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton className="w-full h-6" key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full flex-1 max-h-full overflow-y-hidden scrollbar-minimal">
          <div className="flex items-center p-6 gap-6 border-b">
            <div className="flex items-center gap-2 text-emerald-400">
              <BadgeCheckIcon />
              <h2 className="text-xl">Objetivo</h2>
            </div>
            {challenge ? (
              <p>{challenge?.textarea_oque_deseja}</p>
            ) : (
              <Skeleton className="w-full h-7" />
            )}
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col border-r overflow-hidden w-full">
              <div className="grid grid-cols-5 h-full">
                {challenge &&
                  challenge.array_dias.map(
                    (
                      item: {
                        data: string
                        status:
                          | 'positiveCheck'
                          | 'negativeCheck'
                          | 'nulo'
                          | string
                      },
                      index: number,
                    ) => {
                      const date = dayjs(item.data, 'DD-MM-YYYY')
                      const isPast =
                        dayjs().isAfter(date.add(1, 'day').startOf('day')) ||
                        (dayjs().isSame(date, 'date') &&
                          dayjs().hour() >= 19 &&
                          challenge.hojeInfo)

                      return (
                        <div
                          className={cn(
                            'relative min-h-10 max-h-40 px-4 py-2 border',
                            isPast ? 'bg-card' : '',
                          )}
                          key={index}
                        >
                          <span className="text-zinc-400">{index + 1}</span>
                          <span className="absolute right-4 bottom-2">
                            {(() => {
                              switch (item.status) {
                                case 'positiveCheck':
                                  return (
                                    <span className="text-emerald-400">+1</span>
                                  )
                                case 'negativeCheck':
                                  return (
                                    <span className="text-red-400">-1</span>
                                  )
                                case 'nulo':
                                  return isPast ? <span>X</span> : null
                                default:
                                  return null
                              }
                            })()}
                          </span>
                        </div>
                      )
                    },
                  )}{' '}
              </div>{' '}
            </div>
            <div className="hidden lg:flex flex-col min-w-80 max-h-[100%] ">
              <div className="flex flex-col flex-1 p-4 gap-6 overflow-y-auto scrollbar-minimal border-b">
                <span className="w-fit text-xs font-semibold uppercase px-4 py-2 border rounded-full">
                  NOVOS HÁBITOS
                </span>
                <ul className="flex flex-col gap-4">
                  {challenge
                    ? challenge.array_falhar.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="text-xs text-zinc-400 break-words"
                          >
                            {item}
                          </li>
                        ),
                      )
                    : Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton className="w-full h-4" key={index} />
                      ))}
                </ul>
              </div>
              <div className="flex flex-col flex-1 p-4 gap-6 overflow-y-auto scrollbar-minimal">
                <span className="w-fit text-xs font-semibold uppercase px-4 py-2 border rounded-full">
                  RENÚNCIAS
                </span>
                <ul className="flex flex-col gap-4">
                  {challenge
                    ? challenge.array_comprometimento.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="text-xs text-zinc-400 break-words"
                          >
                            {item}
                          </li>
                        ),
                      )
                    : Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton className="w-full h-4" key={index} />
                      ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {challenge &&
        challenge.status_desafio === 'pausado' &&
        dayjs(challenge.data_de_inicio).isAfter(dayjs().endOf('day')) && (
          <ChallengeStartsTomorrow />
        )}
      {challenge && challenge.status_desafio === 'abandonado' && (
        <ChallengeAbandoned />
      )}
      {challenge && commandment && (
        <CommandmentDialog
          id={commandment.id}
          initialData={commandment.commandment}
          open={commandmentDialogOpen}
          setOpen={setCommandmentDialogOpen}
        />
      )}
      {challenge && (
        <DailyRegisterDialog
          challenge={challenge}
          open={challengeDialogOpen}
          setOpen={setChallengeDialogOpen}
        />
      )}
    </div>
  )
}
