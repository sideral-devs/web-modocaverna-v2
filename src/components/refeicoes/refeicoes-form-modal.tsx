import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import type { FormattedFood, Meal, Supplement } from '@/lib/api/meals'
import { BowlFood, Pill, Plus, Trash } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { X } from 'lucide-react'
import { WEEK_DAYS } from '@/lib/constants'

interface MealFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    data: Omit<Meal, 'created_at' | 'updated_at' | 'horario_id'>,
  ) => Promise<void>
  initialData?: Meal
}

export function MealFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: MealFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())

  const [nome, setNome] = useState(initialData?.nome_refeicao ?? '')
  const [horario, setHorario] = useState(initialData?.hora_refeicao ?? '')
  const [observacoes, setObservacoes] = useState(initialData?.observacoes ?? '')
  const [alimentos, setAlimentos] = useState<Partial<FormattedFood>[]>(
    initialData?.alimentos ?? [],
  )
  const [suplementos, setSuplementos] = useState<Partial<Supplement>[]>(
    initialData?.suplementos ?? [],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean the alimentos array to remove created_at and updated_at
      const cleanedAlimentos = alimentos?.map(
        ({ nomeAlimento, quantidade }) => ({
          nomeAlimento,
          quantidade,
        }),
      )

      // Clean the suplementos array to only include necessary fields
      const cleanedSuplementos = suplementos.map(({ nome, comprado }) => ({
        nome,
        comprado,
      }))

      await onSubmit({
        nome_refeicao: nome,
        hora_refeicao: horario,
        observacoes,
        alimentos: cleanedAlimentos as FormattedFood[],
        suplementos: cleanedSuplementos as Supplement[],
        dia_semana: selectedDay,
      })

      setNome('')
      setHorario('')
      setObservacoes('')
      setAlimentos([{ nomeAlimento: '', quantidade: '' }])
      setSuplementos([])

      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setNome('')
      setHorario('')
      setObservacoes('')
      setAlimentos([])
      setSuplementos([])
      setSelectedDay(new Date().getDay())
    } else if (initialData) {
      setNome(initialData.nome_refeicao)
      setHorario(initialData.hora_refeicao)
      setObservacoes(initialData.observacoes ?? '')
      setAlimentos(initialData.alimentos)
      setSuplementos(initialData.suplementos)
      setSelectedDay(initialData.dia_semana)
    }
  }, [open, initialData])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 select-none ring-0  border-zinc-800 !p-0 max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader className="p-4 relative w-full border-b border-zinc-700 bg-zinc-900 z-10">
          <DialogTitle className="flex justify-between items-center w-full">
            <div className="flex items-start px-3 py-2 gap-1 border border-yellow-500 rounded-full">
              <span className="uppercase text-[10px] text-yellow-500 font-semibold">
                {initialData ? 'Editar' : 'Adicionar'} refeição
              </span>
            </div>
          </DialogTitle>

          <div className="absolute cursor-pointer right-2 top-4">
            <DialogClose asChild>
              <X size={16} className="text-zinc-400" />
            </DialogClose>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
              <div className="space-y-2 px-4">
                <label className="text-sm text-zinc-400">Dia da semana</label>
                <div className="grid grid-cols-7 gap-2">
                  {WEEK_DAYS.map((day, index) => (
                    <Button
                      key={day.short}
                      type="button"
                      variant={selectedDay === index ? 'default' : 'outline'}
                      onClick={() => setSelectedDay(index)}
                      className={`${
                        selectedDay === index
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'border-zinc-700 text-zinc-400 hover:text-zinc-300'
                      }`}
                    >
                      {day.short}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid border-b px-4 mb-6 pb-4 pt-0 grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Nome
                  </label>
                  <Input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome"
                    className="w-full bg-zinc-800 rounded-lg px-4 py-3 border-none placeholder:text-zinc-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Horário
                  </label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={horario}
                      onChange={(e) => setHorario(e.target.value)}
                      className="w-full bg-zinc-800 rounded-lg pl-10 pr-4 py-3 border-none appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                          stroke="#71717A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 4.5V8L10 9"
                          stroke="#71717A"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 border-b pb-6">
                <div className="flex items-center gap-2">
                  <BowlFood size={20} className="text-zinc-400" />
                  <span className="text-lg">Alimentos</span>
                </div>
                <p className="text-sm mb-4 text-zinc-500">
                  Adicione todos os alimentos consumidos
                </p>

                <div className="space-y-2 flex flex-col items-start w-full">
                  {alimentos?.map((alimento, index) => (
                    <div key={index} className="flex w-full items-center gap-4">
                      <Input
                        type="text"
                        value={alimento.nomeAlimento}
                        onChange={(e) =>
                          setAlimentos(
                            alimentos?.map((a, i) =>
                              i === index
                                ? { ...a, nomeAlimento: e.target.value }
                                : a,
                            ),
                          )
                        }
                        placeholder="Digite o nome"
                        className="flex-1 bg-zinc-800 border-none rounded-lg px-4 py-3 placeholder:text-zinc-600"
                        required
                      />
                      <Input
                        type="text"
                        value={alimento.quantidade}
                        onChange={(e) => {
                          setAlimentos(
                            alimentos?.map((a, i) =>
                              i === index
                                ? { ...a, quantidade: e.target.value }
                                : a,
                            ),
                          )
                        }}
                        placeholder="Qtd"
                        className="flex-2 bg-zinc-800 border-none rounded-lg px-4 py-3 placeholder:text-zinc-600"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setAlimentos(alimentos?.filter((_, i) => i !== index))
                        }
                        className="hover:bg-red-500/10"
                      >
                        <Trash className="text-red-500" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setAlimentos([
                        ...(alimentos ?? []),
                        { nomeAlimento: '', quantidade: '' },
                      ])
                    }
                    className="flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                  >
                    <Plus size={16} />
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="px-4 w-full border-b pb-6 pt-6">
                <div className="flex items-center gap-2">
                  <Pill size={20} className="text-zinc-400" />
                  <span className="text-lg">Suplementos</span>
                </div>
                <p className="text-sm mb-4 text-zinc-500">
                  Adicione todos os suplementos consumidos
                </p>

                <div className="space-y-2 flex flex-col items-start w-full">
                  {suplementos.map((suplemento, index) => (
                    <div key={index} className="flex w-full items-center gap-4">
                      <Input
                        type="text"
                        value={suplemento.nome}
                        onChange={(e) =>
                          setSuplementos(
                            suplementos.map((s, i) =>
                              i === index ? { ...s, nome: e.target.value } : s,
                            ),
                          )
                        }
                        placeholder="Digite o nome"
                        className="flex-1 bg-zinc-800 border-none rounded-lg px-4 py-3 placeholder:text-zinc-600"
                        required
                      />
                      <Input
                        type="text"
                        value={suplemento.comprado}
                        onChange={(e) => {
                          setSuplementos(
                            suplementos.map((s, i) =>
                              i === index
                                ? { ...s, comprado: e.target.value }
                                : s,
                            ),
                          )
                        }}
                        placeholder="Qtd"
                        className="flex-2 bg-zinc-800 border-none rounded-lg px-4 py-3 placeholder:text-zinc-600"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setSuplementos(
                            suplementos.filter((_, i) => i !== index),
                          )
                        }
                        className="hover:bg-red-500/10"
                      >
                        <Trash className="text-red-500" size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setSuplementos([
                        ...suplementos,
                        { nome: '', comprado: '' },
                      ])
                    }
                    className="flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                  >
                    <Plus size={16} />
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="px-4 pt-6 pb-10">
                <label className="block text-lg mb-2">Observação</label>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Escreva algo"
                  className="w-full ring-0 focus-visible:ring-0 bg-zinc-800/50 rounded-lg px-4 py-3 border border-zinc-700 placeholder:text-zinc-600 resize-none h-32"
                />
              </div>
            </div>
          </div>

          <div className="p-2 border-t flex justify-end w-full border-zinc-700 sticky bottom-0 bg-zinc-900 z-10">
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              variant="outline"
              className="bg-red-500 hover:bg-red-600"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
