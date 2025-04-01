'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { moneyMask, parseMoney } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(customParseFormat)

const categoryDisplayMap = {
  lazer: 'Lazer',
  saude: 'Saúde',
  educacao: 'Educação',
  servicos: 'Serviços',
  mercado: 'Mercado',
  alimentacao: 'Alimentação',
  contas: 'Contas de Casa',
  transporte: 'Transporte',
  vestuario: 'Vestuário',
  premio: 'Prêmio',
  aluguel: 'Aluguel',
  assinaturas: 'Assinaturas e Serviços',
  outros: 'Outros',
} as const

const paymentMethodDisplayMap = {
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  pix: 'PIX',
  boleto: 'Boleto Bancário',
  transferencia: 'Transferência Bancária',
  dinheiro: 'Dinheiro',
  cheque: 'Cheque',
  paypal: 'PayPal',
} as const

const schema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  type: z.enum(['custo_fixo', 'custo_variavel'], {
    message: 'Obrigatório',
  }),
  category: z.enum(
    Object.keys(categoryDisplayMap) as [keyof typeof categoryDisplayMap],
    {
      message: 'Obrigatório',
    },
  ),
  customCategory: z.string().optional(),
  value: z.string().min(1, { message: 'Obrigatório' }),
  date: z.date({ message: 'Obrigatório' }),
  paymentMethod: z.enum(
    Object.keys(paymentMethodDisplayMap) as [
      keyof typeof paymentMethodDisplayMap,
    ],
    {
      message: 'Obrigatório',
    },
  ),
  observation: z.string().optional(),
  checked: z.boolean().optional(),
})

type RegisterData = z.infer<typeof schema>

export function NewExpenseDialog({
  refetch,
  setIsOpen,
}: {
  refetch: () => void
  setIsOpen: (open: boolean) => void
}) {
  const [date, setDate] = useState<Date | undefined>()
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
    },
  })

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = form

  const category = watch('category')

  function handleCheck(val: CheckedState) {
    const checked = val.valueOf() === true || false
    setValue('checked', checked)
  }

  async function handleRegister(data: RegisterData) {
    try {
      await api.post('/transacoes/store', {
        tipo: data.type,
        categoria:
          data.category === 'outros' && data.customCategory
            ? data.customCategory
            : data.category,
        descricao: data.observation,
        valor: parseMoney(data.value),
        data: dayjs(data.date).format('YYYY-MM-DD[T]HH:mm:ss'),
        titulo: data.title,
        checked: data.checked,
      })
      toast.success('Custo adicionado')
      setIsOpen(false)
      reset({
        title: '',
        category: undefined,
        customCategory: undefined,
        type: undefined,
        date: new Date(),
        value: '',
        observation: '',
      })
      refetch()
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

  return (
    <DialogContent className="max-h-[85%] bg-zinc-900 overflow-y-auto scrollbar-minimal">
      <DialogHeader>
        <DialogTitle>Adicionar custo</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="flex flex-col px-4 py-8 gap-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <div className="flex flex-col w-full gap-2">
                <Input placeholder="Insira o título" {...register('title')} />
                {errors.title && (
                  <span className="text-red-400 text-xs">
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="value" className="text-sm font-medium">
                  Custo
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input
                    placeholder="R$ 0,00"
                    {...register('value')}
                    onChange={(e) => {
                      const formatted = moneyMask(e.target.value)
                      if (formatted !== 'NaN') {
                        setValue('value', `R$ ${formatted}`)
                      } else {
                        setValue('value', 'R$ 0,00')
                      }
                    }}
                  />
                  {errors.value && (
                    <span className="text-red-400 text-xs">
                      {errors.value.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="date" className="text-sm font-medium">
                  Data de pagamento
                </label>
                <div className="flex flex-col w-full gap-2">
                  <DatePicker
                    className="flex h-11 w-full items-center rounded-lg border border-input text-white bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="dd/mm/aaaa"
                    date={date}
                    setDate={(date) => {
                      if (!date) return
                      setValue('date', date)
                      setDate(date)
                    }}
                  />
                  {errors.date && (
                    <span className="text-red-400 text-xs">
                      {errors.date.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="type" className="text-sm font-medium">
                Tipo
              </label>
              <div className="flex flex-col w-full gap-2">
                <Select
                  onValueChange={(val) => {
                    setValue('type', val as RegisterData['type'])
                  }}
                >
                  <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 ">
                    <SelectItem
                      value="custo_fixo"
                      className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                    >
                      Custo Fixo
                    </SelectItem>
                    <SelectItem
                      value="custo_variavel"
                      className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                    >
                      Custo Variável
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <span className="text-red-400 text-xs">
                    {errors.type.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full gap-3">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria
              </label>
              <div className="flex flex-col w-full gap-2">
                <Select
                  onValueChange={(val) =>
                    setValue('category', val as RegisterData['category'])
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 ">
                    {Object.entries(categoryDisplayMap).map(
                      ([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <span className="text-red-400 text-xs">
                    {errors.category.message}
                  </span>
                )}
              </div>
            </div>
            {category === 'outros' && (
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="customCategory" className="text-sm font-medium">
                  Categoria Customizada (opcional)
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input
                    placeholder="Insira a categoria customizada"
                    {...register('customCategory')}
                  />
                  {errors.customCategory && (
                    <span className="text-red-400 text-xs">
                      {errors.customCategory.message}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="paymentMethod" className="text-sm font-medium">
                Forma de pagamento
              </label>
              <div className="flex flex-col w-full gap-2">
                <Select
                  onValueChange={(val) => {
                    setValue(
                      'paymentMethod',
                      val as RegisterData['paymentMethod'],
                    )
                  }}
                >
                  <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 ">
                    {Object.entries(paymentMethodDisplayMap).map(
                      ([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <span className="text-red-400 text-xs">
                    {errors.paymentMethod.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="observation" className="text-sm font-medium">
                Observação (Opcional)
              </label>
              <div className="flex flex-col w-full gap-2">
                <Textarea
                  rows={9}
                  placeholder="Insira a descrição"
                  {...register('observation')}
                />
              </div>
            </div>
            <span className="flex items-center gap-2 text-sm">
              <Checkbox onCheckedChange={handleCheck} />
              Efetivado
            </span>
          </div>
        </div>
      </FormProvider>
      <DialogFooter className="border-t p-4">
        <Button onClick={handleSubmit(handleRegister)} loading={isSubmitting}>
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
