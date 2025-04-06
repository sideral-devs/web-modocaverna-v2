'use client'
import { BoxCountdown } from '@/components/box-countdown'
import { DreamboardMaker } from '@/components/dreamboard/dreamboard-maker'
import { Header, HeaderClose } from '@/components/header'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { MailIcon, PencilIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EditObjetiveDialog } from './edit-objective'
import { NewLockedMessageDialog } from './new-locked-message'
import { OpenedMessageDialog } from './opened-message-dialog'
import EditableObjectiveItem from '@/components/dreamboard/EditableObjectiveItem'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

const YearBar = dynamic(() => import('./year-bar'), {
  loading: () => <Skeleton className="w-full h-6 bg-zinc-900" />,
})
const GoalsGrid = dynamic(() => import('./goals-grid'), {
  loading: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <Skeleton className="w-full h-[300px] px-4 py-6 gap-6 border rounded-3xl bg-zinc-900" />
      <Skeleton className="w-full h-[300px] px-4 py-6 gap-6 border rounded-3xl bg-zinc-900" />
      <Skeleton className="w-full h-[300px] px-4 py-6 gap-6 border rounded-3xl bg-zinc-900" />
    </div>
  ),
})

export default function Page() {
  const queryClient = useQueryClient()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'))
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [currentMessage, setCurrentMessage] = useState<LockedMessage | null>(
    null,
  )
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false)
  const [openedMessageDialogOpen, setOpenedMessageDialogOpen] = useState(false)

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })
  const { data: lockedMessages } = useQuery({
    queryKey: ['locked-messages'],
    queryFn: async () => {
      const response = await api.get('/locked-messages/find')
      return response.data as LockedMessage[]
    },
  })

  const years = useMemo(() => {
    if (goals) {
      return goals.map((goal) => goal.ano)
    }
  }, [goals])

  async function handleCheckGoal(index: number, checked: boolean) {
    if (!currentGoal) return
    if (Number(selectedYear) < dayjs().year()) return

    // const rollback = goal
    try {
      const found = currentGoal.objetivos.lista[index]
      if (!found) return

      await api.put(`/metas/update/${selectedYear}`, {
        ano: selectedYear,
        objetivos: {
          lista: { ...found, checked },
        },
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  }
  async function updateGoalList(index: number, newValue: string) {
    if (!currentGoal) return
    if (Number(selectedYear) < dayjs().year()) return
    try {
      const found = currentGoal.objetivos.lista[index]
      if (!found) return
      await api.put(`/metas/update/${selectedYear}`, {
        ano: selectedYear,
        objetivos: {
          lista: {
            valor: newValue,
            item: found.item,
            ano: found.ano,
            checked: found.checked,
          },
        },
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  }

  useEffect(() => {
    if (goals) {
      setCurrentGoal(goals.find((goal) => goal.ano === selectedYear) || null)
    }
  }, [goals, selectedYear])

  return (
    <div className="flex flex-col w-full min-h-screen items-center gap-10 overflow-y-auto scrollbar-minimal">
      <Header className="border-0">
        <div className="flex w-fit items-center px-3 py-2 gap-1 border rounded-full">
          <span className="uppercase text-[10px] font-semibold">
            Lei da atração
          </span>
        </div>
        <HeaderClose />
      </Header>
      <section className="flex flex-col items-center w-full bg-gradient-to-b from-black to-zinc-800 to-[75%] gap-4">
        <div className="grid grid-cols-5 flex-1 w-full max-w-8xl p-4 gap-4">
          {currentGoal ? (
            <div className="flex flex-col col-span-2 md:h-[640px] p-4 gap-2 bg-zinc-800 border-t rounded-2xl shadow-lg">
              <div className="flex w-full items-center justify-between">
                <div className="flex w-fit items-center px-3 py-2 gap-1 border border-zinc-500 rounded-full">
                  <span className="text-[14px] font-semibold">
                    Objetivo principal
                  </span>
                </div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      disabled={Number(selectedYear) < dayjs().year()}
                      className="disabled:cursor-not-allowed"
                    >
                      <PencilIcon size={16} />
                    </button>
                  </DialogTrigger>
                  <EditObjetiveDialog
                    currentObjective={currentGoal.objetivos.principal}
                    currentYear={Number(currentGoal.ano)}
                    onClose={() => setEditDialogOpen(false)}
                  />
                </Dialog>
              </div>
              <div className="flex flex-col gap-2 ">
                <Image
                  height={25}
                  width={30}
                  alt="Quote"
                  src={'/icons/quote.svg'}
                />
                <p className="px-2 relative left-6 bottom-2 break-words max-w-[26vw]  overflow-y-scroll scrollbar-minimal max-h-[8dvw] lg:max-w-[26dvw]  ">
                  {currentGoal.objetivos.principal}
                </p>
              </div>
              <div className="w-full h-[1px] bg-border" />
              <div className="flex flex-col gap-4 lg:gap-4">
                <div className="flex w-fit items-center px-3 py-2 gap-1 border border-zinc-500 rounded-full">
                  <span className="text-[14px] font-semibold">
                    O que preciso fazer?
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {currentGoal.objetivos.lista.length > 0 ? (
                    currentGoal.objetivos.lista.map((item, index) => (
                      <EditableObjectiveItem
                        key={item.valor + index}
                        item={item}
                        index={index}
                        handleCheckGoal={handleCheckGoal}
                        selectedYear={selectedYear}
                        onSave={(index: number, newValue: string) => {
                          updateGoalList(index, newValue)
                        }}
                      />
                    ))
                  ) : (
                    <span className="text-zinc-400 text-sm">
                      Nenhum objetivo registrado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col col-span-2 md:h-[730px] p-4 gap-8 bg-zinc-800 border rounded-2xl">
              <Skeleton className="w-[80%] h-4 bg-zinc-700" />
              <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-4 bg-zinc-700" />
                <Skeleton className="w-full h-4 bg-zinc-700" />
              </div>
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
              <Skeleton className="w-full h-4 bg-zinc-700" />
            </div>
          )}
          <div className="flex flex-col col-span-3 gap-6">
            {currentGoal ? (
              <DreamboardMaker
                year={Number(selectedYear)}
                startingContent={currentGoal.fotos.map((foto) => ({
                  id: foto.id,
                  height: Number(foto.height),
                  width: Number(foto.width),
                  x: Number(foto.x),
                  y: Number(foto.y),
                  rotation: foto.rotation,
                  src: `${env.NEXT_PUBLIC_PROD_URL}${foto.foto}`,
                }))}
              />
            ) : (
              <Skeleton className="flex flex-col flex-1 items-center gap-8 w-full" />
            )}
          </div>
        </div>
        <div className="w-full h-[1px] bg-border" />
        <div className="flex flex-col w-full max-w-8xl p-4 gap-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MailIcon size={20} />
            Cartas para o Futuro
          </h2>
          <div className="flex w-full gap-2 overflow-x-auto scrollbar-minimal">
            {lockedMessages ? (
              <>
                {lockedMessages.map((message, index) => (
                  <div
                    className="flex flex-col w-64 min-w-64 h-72 p-2 bg-zinc-900 border rounded-xl
                    bg-cover bg-center bg-no-repeat
                    "
                    style={{
                      backgroundImage: `url(${
                        dayjs(message.data_abertura).toDate() < new Date()
                          ? '/images/locked-messages/bau-aberto.png'
                          : '/images/locked-messages/bau-fechado.png'
                      })`,
                    }}
                    key={index}
                  >
                    <span className="flex w-fit h-fit p-[3px] rounded bg-cyan-700 text-cyan-400 text-xs">
                      Criada em{' '}
                      {dayjs(message.data_fechamento).format('DD MMM YYYY')}
                    </span>
                    <div className="flex flex-1 items-center justify-center"></div>

                    <BoxCountdown
                      targetDate={dayjs(message.data_abertura).toDate()}
                      onClick={() => {
                        setOpenedMessageDialogOpen(true)
                        setCurrentMessage(message)
                      }}
                    />
                  </div>
                ))}
                <Dialog
                  open={newMessageDialogOpen}
                  onOpenChange={setNewMessageDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="flex w-64 min-w-64 h-72 items-center justify-center bg-zinc-900 border rounded-xl">
                      <span className="text-red-500 text-sm">+ Nova carta</span>
                    </button>
                  </DialogTrigger>
                  <NewLockedMessageDialog
                    onClose={() => setNewMessageDialogOpen(false)}
                  />
                </Dialog>
                {currentMessage && (
                  <Dialog
                    open={openedMessageDialogOpen}
                    onOpenChange={setOpenedMessageDialogOpen}
                  >
                    <OpenedMessageDialog message={currentMessage} />
                  </Dialog>
                )}
              </>
            ) : (
              Array.from({ length: 3 }, (_, index) => (
                <Skeleton
                  className="w-64 min-w-64 h-72 bg-zinc-900"
                  key={index}
                />
              ))
            )}
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center w-full bg-black">
        <div className="flex flex-col w-full max-w-8xl p-4 gap-12">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Minhas metas para</h2>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              {years && (
                <SelectContent>
                  {years.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>
          <div className="flex flex-col w-full px-8 gap-12">
            <YearBar />
            <GoalsGrid goal={currentGoal} goals={goals} />
          </div>
        </div>
      </section>
    </div>
  )
}
