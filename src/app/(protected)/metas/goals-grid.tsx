'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  Banknote,
  BookIcon,
  BriefcaseBusiness,
  CarFront,
  GlobeIcon,
  GuitarIcon,
  PersonStanding,
  PlusIcon,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

export default function GoalsGrid({
  goal,
}: {
  goal: Goal | null
  goals: Goal[] | undefined
}) {
  const queryClient = useQueryClient()
  function handleCheckGoal(index: number, checked: boolean) {
    if (!goal) return
    // const rollback = goal
    try {
      const found = goal.metas_anuais[index]
      if (!found) return
      const data = {
        ano: found.ano,
        position: found.position,
        tipo: found.tipo,
        valor: found.valor,
        completo: checked ? 1 : 0,
      }
      api.put(`/metas/update/${goal.ano}`, {
        ano: found.ano,
        metas_anuais: data,
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    }
  }

  async function createGoal(newGoal: { tipo: string; valor: string }) {
    if (!values.some((v) => v.value === newGoal.tipo)) {
      toast.error('Tipo de meta inválido.')
      return
    }
    if (!goal) return

    const metasDoTipo = goal.metas_anuais.filter((m) => m.tipo === newGoal.tipo)
    const lastIndex = metasDoTipo.length > 0 ? metasDoTipo.length : 0

    const data = {
      ano: goal.ano,
      tipo: newGoal.tipo,
      valor: newGoal.valor,
      completo: 0,
      position: lastIndex + 1,
    }

    try {
      await api.put(`/metas/update/${goal.ano}`, {
        ano: goal.ano,
        metas_anuais: data,
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
      toast.success('Meta criada com sucesso!')
    } catch {
      toast.error('Erro ao criar meta. Tente novamente.')
    }
  }

  async function editGoal(index: number, valor: string) {
    if (!goal) return
    // const rollback = goal
    try {
      const found = goal.metas_anuais[index]
      if (!found) return
      const data = {
        ano: found.ano,
        position: found.position,
        tipo: found.tipo,
        valor,
        completo: found.completo ? 1 : 0,
      }
      await api.put(`/metas/update/${goal.ano}`, {
        ano: found.ano,
        metas_anuais: data,
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
      toast.success('Meta atualizada com sucesso!')
    } catch (error) {
      console.error(error)
      queryClient.refetchQueries({ queryKey: ['goals'] })
      toast.error('Não foi possível atualizar a Meta.')
    }
  }
  async function deleteGoal(tipo: string, position: number) {
    if (!goal) return
    console.log('tipo', tipo, position)
    try {
      await api.delete(`/metas/delete-one-goal/${goal.metas_id}`, {
        data: {
          tipo,
          position,
        },
      })
      queryClient.refetchQueries({ queryKey: ['goals'] })
      toast.success('Meta excluída com sucesso!')
    } catch (error) {
      console.error(error)
      queryClient.refetchQueries({ queryKey: ['goals'] })
      toast.error('Não foi possível excluir a Meta.')
    }
  }

  if (!goal) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Skeleton className="w-full h-[300px] px-4 py-6 gap-6 border rounded-3xl bg-zinc-900" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6">
      {values.map((item) => (
        <GoalColumn
          key={item.value}
          item={item}
          goal={goal}
          onCheckedChange={handleCheckGoal}
          onCreateGoal={createGoal}
          onUpdateGoal={editGoal}
          onDeleteGoal={deleteGoal}
        />
      ))}
    </div>
  )
}

function GoalColumn({
  goal,
  item,
  onCheckedChange,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
}: {
  goal: Goal
  item: (typeof values)[number]
  onCheckedChange: (index: number, checked: boolean) => void
  onCreateGoal: (newGoal: { tipo: string; valor: string }) => Promise<void>
  onUpdateGoal: (index: number, value: string) => void
  onDeleteGoal: (tipo: string, position: number) => Promise<void>
}) {
  const [isCreating, setIsCreating] = useState(false)
  const Icon = item.icon

  async function handleCreateGoal(title: string) {
    if (!title.trim()) {
      toast.error('O título não pode estar vazio.')
      return
    }
    setIsCreating(false)
    try {
      await onCreateGoal({ tipo: item.value, valor: title })
    } catch {
      toast.error('Erro ao criar a Meta.')
    }
  }

  return (
    <div className="flex flex-col h-[300px] px-4 py-6 gap-6 border rounded-3xl">
      <div className="flex w-full items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs">
          {Icon && <Icon size={20} />}
          {item.label}
        </h3>
        <PlusIcon
          className="text-primary cursor-pointer"
          onClick={() => setIsCreating(true)}
          size={16}
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 overflow-y-auto scrollbar-minimal">
        {goal.metas_anuais.some((goal) => goal.tipo === item.value)
          ? goal.metas_anuais
              .map((yearGoal, index) => ({
                tipo: yearGoal.tipo,
                label: yearGoal.valor || '',
                checked: !!yearGoal.completo,
                position: yearGoal.position,
                onCheckedChange: (checked: boolean) =>
                  onCheckedChange(index, checked),
                onUpdateLabel: (newLabel: string) =>
                  onUpdateGoal(index, newLabel),
                onDeleteLabel: (tipo: string, position: number) =>
                  onDeleteGoal(tipo, position),
              }))
              .filter((yearGoal) => yearGoal.tipo === item.value)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .map(({ ...yearGoal }, index) => (
                <GoalItem
                  key={`goal-${goal.ano}-${index}`}
                  disabled={Number(goal.ano) < dayjs().year()}
                  {...yearGoal}
                />
              ))
          : !isCreating && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-xs text-zinc-500 text-center">
                  Nenhuma Meta adicionada
                </p>
              </div>
            )}
        {isCreating && <CreatingGoal onCreate={handleCreateGoal} />}
      </div>
    </div>
  )
}

function GoalItem({
  tipo,
  position,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  onUpdateLabel,
  onDeleteLabel,
}: {
  tipo: string
  position: number
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  onUpdateLabel?: (value: string) => void
  onDeleteLabel?: (tipo: string, position: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(label)
  function handleEditGoal() {
    if (!value.trim()) {
      toast.error('O título não pode estar vazio.')
      return
    }
    setIsEditing(false)
    if (onUpdateLabel && value.trim() !== label) {
      onUpdateLabel(value)
    }
  }

  function handleBlur() {
    handleEditGoal()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleEditGoal()
    }
  }
  return (
    <div className="flex w-full justify-around p-2.5 bg-card border  rounded-lg">
      <div className=" truncate w-[80%]">
        {isEditing ? (
          <input
            autoFocus
            className="bg-transparent text-sm border-b border-gray-500 focus:outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <label
            className="text-xs cursor-pointer truncate max-w-[80%]"
            onClick={() => !disabled && setIsEditing(true)}
          >
            {label}
          </label>
        )}
      </div>
      <div className="flex flex-row justify-between  gap-6 w-[15%]">
        <div className="relative top-[2px] left-3 ">
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
          />
        </div>

        <div className="relative left-1">
          {!disabled && onDeleteLabel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="text-red-500 hover:text-red-700"
                  aria-label="Excluir meta"
                >
                  <XIcon size={18} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir essa meta? Essa ação não
                    poderá ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteLabel(tipo, position)}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  )
}

function CreatingGoal({
  onCreate,
}: {
  onCreate: (title: string) => Promise<void>
}) {
  const [value, setValue] = useState('')

  async function handleCreate() {
    try {
      await onCreate(value)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <div className="flex w-full  items-center justify-between p-3 bg-card border rounded-lg">
      <input
        autoFocus
        placeholder='Digite a Meta e aperte "Enter" para salvar'
        className="bg-transparent  w-[30vw] text-sm"
        onBlur={() => {
          handleCreate()
        }}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return
          handleCreate()
        }}
      />
    </div>
  )
}

const values = [
  {
    label: 'Saúde',
    icon: PersonStanding,
    value: 'saude',
  },
  {
    label: 'Conhecimento aplicável',
    icon: BookIcon,
    value: 'conhecimento_aplicavel',
  },
  {
    label: 'Finanças',
    icon: Banknote,
    value: 'financas',
  },
  {
    label: 'Conquistas Pessoais (Experiências)',
    icon: GlobeIcon,
    value: 'conquistas_pessoais',
  },
  {
    label: 'Habilidade e Hobbies',
    icon: GuitarIcon,
    value: 'habilidades_hobbies',
  },
  {
    label: 'Negócios/Profissional',
    icon: BriefcaseBusiness,
    value: 'negocios_profissional',
  },
  {
    label: 'Conquistas Materiais',
    icon: CarFront,
    value: 'conquistas_materiais',
  },
  {
    label: 'Tema livre',
    icon: null,
    value: 'tema_livre',
  },
]
