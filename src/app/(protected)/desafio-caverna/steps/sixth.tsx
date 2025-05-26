import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useChallengerStore } from '@/store/challenge'
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function SixthStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { fail, setFail } = useChallengerStore()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(staticValues)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  function getUserAddedValues() {
    return values.filter((value) => !staticValues.includes(value))
  }

  function saveData(){
    // if (!selectedOptions.length) {
    if (!values.length) {
      toast.error('Selecione pelo menos um item!')
      return
    }
    // setFail(selectedOptions.map((val) => `✅ ${val}`))
    setFail(
      values
        // .filter((value) => !staticValues.includes(value))
        .map((val) => `✅ ${val}`),
    )
  }

  function handleSaveInfo() {
    saveData();
    onNext()
  }

  function handleBackStep (){
    saveData()
    onBack()
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

  useEffect(() => {
    if (fail && fail.length > 0) {
      setValues(fail.map((fail) => {
        return fail.replace('✅ ', '');
      }));
    }
  },  [fail])
  
  return (
    <div className="flex flex-col w-full relative flex-1 items-center">
      <div className="flex flex-col flex-1 w-full max-w-md gap-10">
        <h1 className="text-2xl">
          Quais hábitos e comportamentos você deseja implementar na sua rotina
          durante o desafio?
        </h1>
        <div
          className="flex flex-col h-60 gap-5 overflow-y-auto overflow-x-hidden scrollbar-minimal"
          ref={scrollRef}
        >
          <div className="flex w-fit h-8 items-center justify-center px-3 py-2 bg-emerald-900 text-emerald-300 rounded-full">
            <span className="text-xs uppercase">Sugestões</span>
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
      <Button onClick={handleBackStep} className="px-5" variant="outline">
          Voltar
        </Button>
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
        'flex relative group w-fit max-w-full items-center px-4 py-[10px] gap-2 rounded-full cursor-pointer',
        selected ? 'bg-emerald-900 text-emerald-300' : 'bg-card text-zinc-400 ',
      )}
      // onClick={() => onSelect(value)}
    >
      <CheckIcon className="text-emerald-300 stroke-2" size={16} />
      <span className="truncate">{value}</span>
      {/* {!staticValues.includes(value) && ( */}
      <XIcon
        className="text-white absolute left-0 top-0 -translate-y-1/4 p-1 bg-card rounded-full hidden group-hover:block cursor-pointer"
        size={16}
        onClick={() => onRemove(value)}
      />
      {/* )}{' '} */}
    </li>
  )
}

const staticValues = [
  'Leitura: De 15 a 30 minutos',
  'Ritual matinal e noturno: Seguir rotina estruturada pela manhã e à noite',
  'Exercício físico: Pelo menos 30 minutos',
  'Hidratação: Consumir ao menos 3 litros de água',
  'Espiritualidade: Dedicar ao menos 10 minutos para oração, meditação ou gratidão.',
  'Sono de qualidade: Dormir pelo menos 7 horas por noite',
  'Construção de liberdade: Dedicar ao menos 1 hora do dia para trabalhar na minha independência financeira.',
]
