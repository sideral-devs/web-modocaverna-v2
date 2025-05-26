/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meal } from '@/lib/api/meals'
import {
  BowlFood,
  DotsThree,
  NotePencil,
  Pill,
  Trash,
  Copy,
} from '@phosphor-icons/react'
import * as Popover from '@radix-ui/react-popover'
import { Button } from '../ui/button'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { WEEK_DAYS } from '@/lib/constants'

interface MealCardProps {
  meal: Meal
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: (selectedDays: string[]) => void
  isFirst?: boolean
  isLast?: boolean
}

function DuplicateMealDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedDays: string[]) => void
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const currentDay = new Date()
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .toUpperCase()

  const allShortDays = WEEK_DAYS.map((d) => d.short)
  const allSelected = selectedDays.length === allShortDays.length

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDays([])
    } else {
      setSelectedDays(
        allShortDays.filter((day) => day.toUpperCase() + '.' !== currentDay),
      )
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedDays)
    onOpenChange(false)
    setSelectedDays([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Duplicar refeição</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-4">
          <p className="text-sm text-zinc-400">
            Selecione os dias da semana para duplicar esta refeição:
          </p>

          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2">
              {WEEK_DAYS.map((day) => {
                return (
                  <Button
                    key={day.short}
                    type="button"
                    variant={
                      selectedDays.includes(day.short) ? 'default' : 'outline'
                    }
                    disabled={day.short.toUpperCase() + '.' === currentDay}
                    onClick={() => {
                      if (selectedDays.includes(day.short)) {
                        setSelectedDays(
                          selectedDays.filter((d) => d !== day.short),
                        )
                      } else {
                        setSelectedDays([...selectedDays, day.short])
                      }
                    }}
                    className={`border ${
                      selectedDays.includes(day.short)
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'border-zinc-700 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    {day.short}
                  </Button>
                )
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className={`mb-2 px-4 py-2 rounded-lg font-semibold transition-colors w-fit self-start
              ${allSelected ? 'bg-white text-black shadow-md' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'}
            `}
          >
            {allSelected ? 'Limpar seleção' : 'Todos'}
          </button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={selectedDays.length === 0}>
            Duplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function MealCard({
  meal,
  onEdit,
  onDelete,
  onDuplicate,
}: MealCardProps) {
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false)

  return (
    <div className="relative flex gap-8">
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        <div className="text-red-500 font-medium whitespace-nowrap">
          {meal.hora_refeicao}
        </div>
        <div className="w-px h-full absolute top-8 bg-zinc-800" />
        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 relative z-10" />
      </div>

      {/* Card Content */}
      <div className="bg-zinc-800 relative rounded-2xl flex-1">
        <div className="flex border-b border-zinc-700 pb-6 px-0 items-start justify-between p-4 pt-2">
          <div className="flex flex-col gap-2 px-8 pt-6 pb-4">
            <h4 className="text-lg font-medium">{meal.nome_refeicao}</h4>
            <p className="text-zinc-400 font-normal">
              {meal.observacoes || 'Sem observação.'}
            </p>
          </div>
          <div className="absolute top-2 right-2">
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button variant="outline" size="icon">
                  <DotsThree weight="bold" size={24} />
                </Button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  className="bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg"
                  sideOffset={5}
                >
                  <div className="p-1">
                    <button
                      onClick={onEdit}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-md transition-colors"
                    >
                      <NotePencil size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => setDuplicateDialogOpen(true)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-md transition-colors"
                    >
                      <Copy size={16} />
                      Duplicar
                    </button>
                    <button
                      onClick={onDelete}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash size={16} />
                      Excluir
                    </button>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex w-full border-r border-zinc-700 flex-col gap-2 px-8 pt-6 pb-20 overflow-y-auto">
            <div className="flex items-center mb-4 gap-2">
              <BowlFood weight="bold" className="text-red-500" size={24} />
              <h4 className="text-lg font-medium">Alimentos</h4>
            </div>
            <div className="flex flex-col gap-2">
              {meal.alimentos.length > 0 ? (
                meal.alimentos.map((alimento: any) => {
                  return (
                    <div
                      key={alimento.alimento_id}
                      className="flex bg-zinc-700 justify-between pl-4 pr-2 rounded-2xl py-2 items-center gap-2"
                    >
                      <p>{alimento.nomeAlimento}</p>
                      <div className="text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                        {alimento.quantidade}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-zinc-400">*Sem alimentos adicionados.</p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 px-8 pt-6 pb-4">
            <div className="flex items-center mb-4 gap-2">
              <Pill weight="bold" className="text-red-500" size={24} />
              <h4 className="text-lg font-medium">Suplementos</h4>
            </div>
            <div className="flex flex-col gap-2">
              {meal.suplementos.length > 0 ? (
                meal.suplementos.map((suplemento) => (
                  <div
                    key={suplemento.suplemento_id}
                    className="flex bg-zinc-700 justify-between pl-4 pr-2 rounded-2xl py-2 items-center gap-2"
                  >
                    <p>{suplemento.nome}</p>
                    <div className="text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                      {suplemento.comprado}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400">Nenhum suplemento</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <DuplicateMealDialog
        open={duplicateDialogOpen}
        onOpenChange={setDuplicateDialogOpen}
        onConfirm={onDuplicate || (() => {})}
      />
    </div>
  )
}
