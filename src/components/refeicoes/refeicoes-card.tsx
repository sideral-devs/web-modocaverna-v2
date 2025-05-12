import type { Meal } from '@/lib/api/meals'
import {
  BowlFood,
  DotsThree,
  NotePencil,
  Pill,
  Trash,
} from '@phosphor-icons/react'
import * as Popover from '@radix-ui/react-popover'
import { Button } from '../ui/button'

interface MealCardProps {
  meal: Meal
  onEdit?: () => void
  onDelete?: () => void
  isFirst?: boolean
  isLast?: boolean
}

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
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
                meal.alimentos.map((alimento) => (
                  <div
                    key={alimento.alimento_id}
                    className="flex bg-zinc-700 justify-between pl-4 pr-2 rounded-2xl py-2 items-center gap-2"
                  >
                    <p>{alimento.nome_alimento}</p>
                    <div className="text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                      {alimento.quantidade}
                    </div>
                  </div>
                ))
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
    </div>
  )
}
