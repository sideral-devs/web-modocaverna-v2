'use client'

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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EditObjetiveDialog } from './edit-objective'
import EditableObjectiveItem from '@/components/dreamboard/EditableObjectiveItem'
import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { Pencil, PencilIcon } from 'lucide-react'

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
  const [list, setList] = useState<ObjectivesList[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })

  const years = useMemo(() => {
    if (goals) {
      return goals.map((goal) => goal.ano)
    }
  }, [goals])

  // async function handleCheckGoal(index: number, checked: boolean) {
  //   if (!currentGoal) return
  //   if (Number(selectedYear) < dayjs().year()) return

  //   // const rollback = goal
  //   try {
  //     const found = currentGoal.objetivos.lista[index]
  //     if (!found) return

  //     await api.put(`/metas/update/${selectedYear}`, {
  //       ano: selectedYear,
  //       objetivos: {
  //         lista: { ...found, checked },
  //       },
  //     })
  //     queryClient.refetchQueries({ queryKey: ['goals'] })
  //   } catch {
  //     toast.error('Algo deu errado. Tente novamente.')
  //     queryClient.invalidateQueries({ queryKey: ['goals'] })
  //   }
  // }
  async function handleItemChange() {
    if (!currentGoal) return
    if (Number(selectedYear) < dayjs().year()) return
    try {
      await api.put(`/metas/update-list/${selectedYear}`, {
        lista: list,
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  }
  const handleStopEditing = () => {
    handleItemChange()
  }
  const handleChange = (index: number, newValue: string) => {
    setList((prev) => {
      const novaLista = [...prev]
      novaLista[index].valor = newValue
      return novaLista
    })
  }

  useEffect(() => {
    if (goals) {
      setCurrentGoal(goals.find((goal) => goal.ano === selectedYear) || null)
    }
  }, [goals, selectedYear])

  useEffect(() => {
    if (currentGoal?.objetivos.lista) {
      setList(currentGoal.objetivos.lista)
    }
  }, [currentGoal])

  return (
    <UpgradeModalTrigger>
      <div className="flex flex-col w-full min-h-screen items-center gap-10 overflow-y-auto scrollbar-minimal">
        <Header className="border-0">
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-white rounded-full">
            <span className="uppercase text-[10px] text-white font-semibold ">
              {' '}
              Metas{' '}
            </span>
          </div>
          <HeaderClose to="ordem-no-caos" />
        </Header>
        <section className="flex flex-col items-center w-full gap-2 ">
          <div className="flex flex-row justify-between border-zinc-700 h-[360px] border-4 rounded-xl w-full max-w-8xl p-2 gap-4">
            {currentGoal ? (
              <div className="flex flex-col col-span-2 md:h-[350px] w-[50%] p-4   rounded-2xl shadow-lg">
                <div className="flex w-full items-center justify-between">
                  <div className="flex w-fit items-center px-3 py-2 gap-1 border border-zinc-500 rounded-full">
                    <span className="text-[14px] font-semibold">
                      Objetivo principal
                    </span>
                  </div>
                  <Dialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <button
                        disabled={Number(selectedYear) < dayjs().year()}
                        className="disabled:cursor-not-allowed"
                      >
                        <PencilIcon size={24} />
                      </button>
                    </DialogTrigger>
                    <EditObjetiveDialog
                      currentObjective={currentGoal.objetivos.principal}
                      currentYear={Number(currentGoal.ano)}
                      onClose={() => setEditDialogOpen(false)}
                    />
                  </Dialog>
                </div>
                <div className="flex flex-row h-full items-center justify-center">
                  <div className="relative bottom-24 left-4">
                    <Image
                      height={50}
                      width={50}
                      color="#808080"
                      alt="Quote"
                      src={'/icons/quote-2.svg'}
                    />
                  </div>
                  <div className="flex flex-col  max-w-[80%] h-auto gap-2  ">
                    <h1 className="text-2xl w-90 text-center mt-2 line-clamp-5 overflow-hidden">
                      {currentGoal.objetivos.principal}
                    </h1>
                  </div>
                  <div className="relative top-28  rotate-180 ">
                    <Image
                      height={50}
                      width={50}
                      color="#e4e4e"
                      alt="Quote"
                      src={'/icons/quote-2.svg'}
                    />
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
            {currentGoal ? (
              <div className="flex flex-col col-span-2  md:h-[340px] w-[50%] p-4 gap-2 bg-zinc-800 border-t border-zinc-600 rounded-2xl shadow-lg">
                <div className="flex flex-col gap-8 lg:gap-8">
                  <div className="flex flex-row w-full justify-between">
                    <div className="flex w-fit items-center px-3 py-2 gap-1 border border-zinc-500 rounded-full">
                      <span className="text-[14px] font-semibold">
                        O que preciso fazer?
                      </span>
                    </div>
                    <div className="cursor-pointer">
                      <Pencil
                        className={`relative bottom-1 right-1 mt-2 mr-2`}
                        size={24}
                        onClick={() => setIsEditing(!isEditing)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto relative bottom-3">
                    {list.length > 0 ? (
                      list.map((item, index) => (
                        <EditableObjectiveItem
                          key={item.valor + index}
                          item={item}
                          index={index}
                          handleCheckGoal={handleItemChange}
                          selectedYear={selectedYear}
                          isEditing={isEditing}
                          onChange={handleChange}
                          onStopEditing={handleStopEditing}
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
          </div>
        </section>
        <section className="flex flex-col items-center  w-full bg-black">
          <div className="flex flex-col w-full max-w-8xl items-center p-4 gap-12">
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
    </UpgradeModalTrigger>
  )
}
