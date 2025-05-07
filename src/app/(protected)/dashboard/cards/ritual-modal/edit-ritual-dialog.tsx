'use client'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useCalendarDialogStore } from '@/store/calendar-dialog'
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
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SortableItem } from './sortable-item'

export function EditRitualDialog({
  openRecalculate,
  defaultTab = 'matinal',
}: {
  openRecalculate?: () => void
  defaultTab?: 'matinal' | 'noturno'
}) {
  const { ritualDefaultTab } = useCalendarDialogStore()
  const [currentTab, setCurrentTab] = useState<'matinal' | 'noturno'>(
    defaultTab,
  )
  const [newItem, setNewItem] = useState('')
  const queryClient = useQueryClient()

  const { data: morningRitual } = useQuery({
    queryKey: ['rituais-blocos-matinais'],
    queryFn: async () => {
      const res = await api.get('/blocos/find?tipo_ritual=1')
      const data = res.data as RitualResponseItem[]
      return data[0]
    },
  })

  const { data: nightRitual } = useQuery({
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

  const handleRemove = (item: string) => {
    const ritual = currentTab === 'matinal' ? morningRitual : nightRitual
    if (!ritual) return

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const ritual = currentTab === 'matinal' ? morningRitual : nightRitual
    if (!ritual) return

    if (newItem.trim()) {
      setNewItem('')
      updateBlocks.mutate({
        ...ritual,
        itens: [...ritual.itens, newItem.trim()],
      })
    }
  }

  useEffect(() => {
    setCurrentTab(ritualDefaultTab)
  }, [ritualDefaultTab])

  return (
    <DialogContent className="flex flex-col max-w-md h-[700px] max-h-[90%] p-0 bg-zinc-900 transition-all duration-200 overflow-hidden">
      <DialogHeader className="p-4 items-start">
        <DialogTitle className="flex px-3 py-1.5 border text-[10px] uppercase rounded-full border-white">
          Editar rituais
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto scrollbar-minimal">
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
          <TabsContent value="matinal" className="overflow-hidden">
            {morningRitual && (
              <div className="divide-y">
                <form
                  className="flex flex-col w-full px-4 py-6 gap-6"
                  onSubmit={handleSubmit}
                >
                  <div className="flex w-full items-center gap-4">
                    <Input
                      placeholder="Digite um novo item"
                      name="new-item"
                      className="w-full h-10 flex-1"
                      containerClassName="w-full"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                    />
                    <button type="submit">
                      <PlusIcon className="text-primary" />
                    </button>
                  </div>
                </form>
                <div className="flex flex-col px-4">
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
                            onRemove={() => handleRemove(item)}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="noturno" className="overflow-hidden">
            {nightRitual && (
              <div className="divide-y">
                <form
                  className="flex flex-col w-full px-4 py-6 gap-6"
                  onSubmit={handleSubmit}
                >
                  <div className="flex w-full items-center gap-4">
                    <Input
                      placeholder="Digite um novo item"
                      name="new-item"
                      className="w-full h-10 flex-1"
                      containerClassName="w-full"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                    />
                    <button type="submit">
                      <PlusIcon className="text-primary" />
                    </button>
                  </div>
                </form>
                <div className="flex flex-col px-4">
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
                            onRemove={() => handleRemove(item)}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <DialogFooter
        className={cn(
          'flex !flex-row w-full items-center p-4 border-t',
          openRecalculate ? '!justify-between' : '',
        )}
      >
        {openRecalculate && (
          <Button
            className="h-10 bg-zinc-700"
            variant="outline"
            onClick={() => {
              openRecalculate()
            }}
          >
            Recalcular Rituais
          </Button>
        )}
        <DialogClose asChild>
          <Button className="h-10">Salvar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
