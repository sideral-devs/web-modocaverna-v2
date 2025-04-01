import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useChallengerStore } from '@/store/challenge'
import { PlusIcon, XIcon } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

export function FifthStep({
  onNext,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { setCompromisses } = useChallengerStore()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(staticValues)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  function getUserAddedValues() {
    return values.filter((value) => !staticValues.includes(value))
  }

  function handleSaveInfo() {
    // if (!selectedOptions.length) {
    //   toast.error('Selecione pelo menos um item!')
    //   return
    // }
    // setCompromisses(selectedOptions.map((val) => `❌ ${val}`))
    setCompromisses(
      values
        .filter((value) => !staticValues.includes(value))
        .map((val) => `❌ ${val}`),
    )
    onNext()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem = formData.get('new-item') as string

    if (!newItem.trim()) return

    setValues((prevValues) => [...prevValues, newItem.trim()])
    e.currentTarget.reset()

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }

  function handleSelectOption(option: string) {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((opt) => opt !== option)
      } else {
        return [...prevOptions, option]
      }
    })
  }

  function handleRemoveOption(option: string) {
    if (values.length === 1) {
      toast.error('Selecione pelo menos um item!')
      return
    }
    setValues((prevOptions) => prevOptions.filter((opt) => opt !== option))
  }

  return (
    <div className="flex flex-col w-full relative flex-1 items-center">
      <div className="flex flex-col flex-1 w-full max-w-md gap-10">
        <h1 className="text-2xl">
          Quais hábitos e comportamentos você se compromete em abdicar durante o
          desafio?
        </h1>
        <div
          className="flex flex-col h-60 gap-5 overflow-y-auto overflow-x-hidden scrollbar-minimal"
          ref={scrollRef}
        >
          <div className="flex w-fit h-8 items-center justify-center px-3 py-2 bg-red-900 text-red-400 rounded-full">
            <span className="text-xs uppercase">Obrigatório</span>
          </div>
          <ul className="flex flex-col flex-1 gap-3">
            {values.map((value) => (
              <ListItem
                key={value}
                value={value}
                onSelect={handleSelectOption}
                onRemove={handleRemoveOption}
                selected={selectedOptions.includes(value)}
              />
            ))}
          </ul>
        </div>
        <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
          <p className="text-sm">Deseja acrescentar algo a mais?</p>
          <div className="flex w-full items-center gap-2">
            <Input
              placeholder="Digite aqui"
              name="new-item"
              className="w-full h-10 flex-1"
              containerClassName="w-full"
            />
            <Button className="w-10 h-10" type="submit">
              <PlusIcon size={16} />
            </Button>
          </div>
          <span className="text-[10px] text-zinc-400">
            Itens extras adicionados ({getUserAddedValues().length})
          </span>
        </form>
      </div>
      <footer className="flex w-full h-32 justify-center items-end pb-11 gap-4">
        <Button onClick={handleSaveInfo} className="px-5">
          Estou pronto, Capitão!
        </Button>
      </footer>
    </div>
  )
}

function ListItem({
  value,
  // onSelect,
  onRemove,
  selected,
}: {
  value: string
  onSelect: (arg: string) => void
  onRemove: (arg: string) => void
  selected: boolean
}) {
  return (
    <li
      className={cn(
        'flex relative w-fit max-w-full items-center px-4 py-[10px] gap-2 rounded-full cursor-pointer group',
        selected ? 'bg-red-900 text-red-400' : 'bg-card text-zinc-400 ',
      )}
      // onClick={() => onSelect(value)}
    >
      <XIcon className="text-red-500 stroke-2" size={16} />
      <span className="truncate">{value}</span>
      {!staticValues.includes(value) && (
        <XIcon
          className="text-white absolute left-0 top-0 -translate-y-1/4 p-1 bg-card rounded-full hidden group-hover:block cursor-pointer"
          size={16}
          onClick={() => onRemove(value)}
        />
      )}
    </li>
  )
}

const staticValues = [
  'Não ir a festas e viagens',
  'Reduzir consumo de açúcar e fast food',
  'Limitar redes sociais: 30 min por dia',
  'Não abrir redes sociais antes de dormir e ao acordar',
]
