'use client'

import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'
import { ConfigRitualDialog } from './ritual-modal/config-ritual-dialog'
import { EditRitualDialog } from './ritual-modal/edit-ritual-dialog'
import { RecalculateRitualDialog } from './ritual-modal/recalculate-ritual-dialog'
import { SortableItem } from './ritual-modal/sortable-item'
export default function RitualsCard() {
  const [currentTab, setCurrentTab] = useState<'matinal' | 'noturno'>(
    new Date().getHours() >= 15 ? 'noturno' : 'matinal',
  )
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false)
  const [finishDialogOpen, setFinishDialogOpen] = useState(false)
  const [editRitualDialogOpen, setEditRitualDialogOpen] = useState(false)
  const [recalculateDialogOpen, setRecalculateDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: morningRitual, isFetched: morningFetched } = useQuery({
    queryKey: ['rituais-blocos-matinais'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=1')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const { data: nightRitual, isFetched: nightFetched } = useQuery({
    queryKey: ['rituais-blocos-noturnos'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=2')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const updateBlocks = useMutation({
    mutationFn: async (data: RitualResponseItem) => {
      await api.put('/blocos/update/' + data.id, data)
    },
    onMutate: async (data) => {
      const queryKey =
        data.tipo_ritual === 1
          ? 'rituais-blocos-matinais'
          : 'rituais-blocos-noturnos'

      await queryClient.cancelQueries({ queryKey: [queryKey] })

      queryClient.setQueryData([queryKey], data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rituais-blocos-matinais', 'rituais-blocos-noturnos'],
      })
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleRemove = (item: string, ritual: RitualResponseItem) => {
    const updated = {
      ...ritual,
      itens: ritual.itens.filter((i) => i !== item),
    }
    updateBlocks.mutate(updated)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const ritual = currentTab === 'matinal' ? morningRitual : nightRitual
    if (!ritual) return

    const oldIndex = ritual.itens.findIndex(
      (item, index) => item + index === active.id,
    )
    const newIndex = ritual.itens.findIndex(
      (item, index) => item + index === over.id,
    )

    const moved = arrayMove(ritual.itens, oldIndex, newIndex)
    updateBlocks.mutate({ ...ritual, itens: moved })
  }

  if (!morningFetched || !nightFetched) {
    return (
      <Skeleton className="flex flex-col w-full h-full min-h-[300px] relative overflow-hidden" />
    )
  }

  if (morningRitual && nightRitual) {
    return (
      <Card className="flex flex-col w-full h-full min-h-[300px] relative overflow-hidden">
        <CardHeader className="justify-between p-4">
          <div className="flex px-3 py-2 pt-[9px] border border-white rounded-full">
            <span className="text-[10px] text-white font-semibold">
              RITUAIS
            </span>
          </div>
          <Dialog
            open={editRitualDialogOpen}
            onOpenChange={setEditRitualDialogOpen}
          >
            <DialogTrigger>
              <Pencil className="text-primary cursor-pointer" size={20} />
            </DialogTrigger>
            <EditRitualDialog
              openRecalculate={() => {
                setEditRitualDialogOpen(false)
                setRecalculateDialogOpen(true)
              }}
            />
          </Dialog>
          <Dialog
            open={recalculateDialogOpen}
            onOpenChange={setRecalculateDialogOpen}
          >
            <RecalculateRitualDialog
              onClose={() => {
                setRecalculateDialogOpen(false)
                setFinishDialogOpen(true)
              }}
            />
          </Dialog>
          <FinishDialog open={finishDialogOpen} setOpen={setFinishDialogOpen} />
        </CardHeader>
        <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-minimal">
          <Tabs
            value={currentTab}
            onValueChange={(val) => setCurrentTab(val as 'matinal' | 'noturno')}
          >
            <TabsList className="w-full border-b px-4">
              <TabsTrigger
                value="matinal"
                className="p-3 text-sm relative data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none"
              >
                Matinal
              </TabsTrigger>
              <TabsTrigger
                value="noturno"
                className="p-3 text-sm relative data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary rounded-none"
              >
                Noturno
              </TabsTrigger>
            </TabsList>
            <TabsContent value="matinal">
              {morningRitual.itens.length > 0 ? (
                <div className="flex flex-col px-4 divide-y">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={morningRitual.itens.map(
                        (item, index) => item + index,
                      )}
                      strategy={verticalListSortingStrategy}
                    >
                      <ul className="divide-y">
                        {morningRitual.itens.map((item, index) => (
                          <SortableItem
                            key={index}
                            id={item + index}
                            index={index + 1}
                            text={item}
                            onRemove={() => handleRemove(item, morningRitual)}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                </div>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center relative">
                  <Image
                    src="/images/empty-states/empty_rituals.png"
                    alt="Nenhum objetivo encontrado"
                    width={140}
                    height={110}
                    className="opacity-50"
                  />
                  <div className="w-60">
                    <Dialog
                      open={editRitualDialogOpen}
                      onOpenChange={setEditRitualDialogOpen}
                    >
                      <DialogTrigger>
                        <p className="text-[13px] text-zinc-400 text-center">
                          Clique aqui para montar o seu Ritual Matinal.
                        </p>
                      </DialogTrigger>
                      <EditRitualDialog
                        openRecalculate={() => {
                          setEditRitualDialogOpen(false)
                          setRecalculateDialogOpen(true)
                        }}
                      />
                    </Dialog>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="noturno">
              {nightRitual.itens.length > 0 ? (
                <div className="flex flex-col px-4 divide-y">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={nightRitual.itens.map(
                        (item, index) => item + index,
                      )}
                      strategy={verticalListSortingStrategy}
                    >
                      <ul className="divide-y">
                        {nightRitual.itens.map((item, index) => (
                          <SortableItem
                            key={index}
                            id={item + index}
                            index={index + 1}
                            text={item}
                            onRemove={() => handleRemove(item, nightRitual)}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                </div>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center relative">
                  <Image
                    src="/images/empty-states/empty_rituals.png"
                    alt="Nenhum objetivo encontrado"
                    width={140}
                    height={110}
                    className="opacity-50"
                  />
                  <div className="w-60">
                    <Dialog
                      open={editRitualDialogOpen}
                      onOpenChange={setEditRitualDialogOpen}
                    >
                      <DialogTrigger>
                        <p className="text-[13px] text-zinc-400 text-center">
                          Clique aqui para montar o seu Ritual Noturno.
                        </p>
                      </DialogTrigger>
                      <EditRitualDialog
                        openRecalculate={() => {
                          setEditRitualDialogOpen(false)
                          setRecalculateDialogOpen(true)
                        }}
                      />
                    </Dialog>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] relative p-4 gap-5 overflow-hidden">
      <CardHeader className="justify-between">
        <div className="flex px-3 py-2 pt-[9px] border border-white rounded-full">
          <span className="text-[10px] font-semibold">RITUAIS</span>
        </div>
      </CardHeader>
      <div className="flex flex-col flex-1 items-center justify-center relative">
        <Image
          src="/images/empty-states/empty_rituals.png"
          alt="Nenhum objetivo encontrado"
          width={140}
          height={110}
          className="opacity-50"
        />
        <div className="w-60">
          <p className="text-[13px] text-zinc-400 text-center">
            Rituais constroem disciplina.
          </p>
          <p className="text-[13px] text-zinc-400 text-center">
            Crie seus Rituais e assuma o controle do seu dia.
          </p>
        </div>
      </div>
      <CardFooter className="p-0">
        <Dialog open={stepsDialogOpen} onOpenChange={setStepsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-100 text-primary ml-auto"
            >
              Criar Ritual
            </Button>
          </DialogTrigger>
          <ConfigRitualDialog
            onClose={() => {
              setStepsDialogOpen(false)
              setFinishDialogOpen(true)
            }}
          />
        </Dialog>
        <FinishDialog open={finishDialogOpen} setOpen={setFinishDialogOpen} />
      </CardFooter>
    </Card>
  )
}

function FinishDialog({
  open,
  setOpen,
  mode = 'created',
}: {
  open: boolean
  setOpen: (arg: boolean) => void
  mode?: 'created' | 'updated'
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[633px] max-h-[80%] rounded-3xl">
        <div className="flex flex-col flex-1 items-center justify-center gap-6">
          <Image
            src="/images/empty-states/empty_rituals.png"
            alt="Nenhum objetivo encontrado"
            width={140}
            height={110}
            className="opacity-50"
          />
          <DialogTitle>
            Rituais {mode === 'created' ? 'criados' : 'atualizados'} com sucesso
          </DialogTitle>
          <p className="text-zinc-400 text-xs text-center max-w-60">
            Acompanhe seus rituais na tela inicial da Central Caverna
          </p>
          <DialogClose asChild>
            <Button size="sm">Finalizar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
