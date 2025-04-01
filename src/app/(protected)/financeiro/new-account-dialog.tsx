'use client'
import { Button } from '@/components/ui/button'
import { CircleCheckbox } from '@/components/ui/circle-checkbox'
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
import { cn, moneyMask, parseMoney } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(customParseFormat)

const banks = [
  'Bradesco',
  'Banco do Brasil',
  'Caixa Econômica Federal',
  'Itaú Unibanco',
  'Santander',
  'Nubank',
  'Inter',
  'Banco Safra',
  'BTG Pactual',
  'Banrisul',
  'Banco Original',
  'C6 Bank',
  'Banco Neon',
  'Banco Pan',
  'Sicredi',
  'Sicoob',
  'Banco Daycoval',
  'Banco Topázio',
  'XP Investimentos',
  'Banco Modal',
  'Banco Votorantim',
  'Banco do Nordeste',
  'Banco da Amazônia',
  'Banco Sofisa',
  'PagBank (PagSeguro)',
  'Outro',
] as const

const criptos = {
  BTC: 'BTC - Bitcoin',
  ETH: 'ETH - Ethereum',
  BNB: 'BNB - Binance Coin',
  SOL: 'SOL - Solana',
  XRP: 'XRP - Ripple',
  DOGE: 'DOGE - Dogecoin',
  ADA: 'ADA - Cardano',
  DOT: 'DOT - Polkadot',
  AVAX: 'AVAX - Avalanche',
  SHIB: 'SHIB - Shiba Inu',
  Outros: 'Outro',
} as const

const accountTypes = {
  conta_corrente: 'Corrente',
  poupanca: 'Poupança',
  investimentos: 'Investimentos',
  outros: 'Outros',
  salario: 'Conta Salário',
  universitaria: 'Conta Universitária',
  digital: 'Conta Digital',
  conjunta: 'Conta Conjunta',
  empresarial: 'Conta Empresarial',
} as const

const schema = z.object({
  bank: z.enum(
    [...banks, ...(Object.keys(criptos) as [keyof typeof criptos])],
    {
      message: 'Obrigatório',
    },
  ),
  category: z.enum(['pessoa_fisica', 'pessoa_juridica', 'Cripto'], {
    message: 'Obrigatório',
  }),
  observation: z.string().optional(),
  balance: z.string().min(1, { message: 'Obrigatório' }),
  type: z.enum(
    [...(Object.keys(accountTypes) as [keyof typeof accountTypes]), 'Cripto'],
    {
      message: 'Obrigatório',
    },
  ),
})

type RegisterData = z.infer<typeof schema>

export function NewAccountDialog({
  refetch,
  setIsOpen,
}: {
  refetch: () => void
  setIsOpen: (open: boolean) => void
}) {
  const [selectedType, setSelectedType] = useState<'fiat' | 'cripto'>('fiat')
  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = form

  const bank = watch('bank')
  const category = watch('category')
  const type = watch('type')

  function handleSelect(option: typeof selectedType) {
    setSelectedType(option)
    if (option === 'cripto') {
      setValue('category', 'Cripto')
      setValue('type', 'Cripto')
    } else {
      reset({
        category: undefined,
        type: undefined,
      })
    }
  }

  async function handleRegister(data: RegisterData) {
    try {
      await api.post('/carteiras/store', {
        agencia: '',
        banco: data.bank,
        categoria: data.category,
        conta: '',
        decricao: data.observation,
        numero: '',
        saldo: parseMoney(data.balance),
        tipo: data.type,
        titulo: '',
      })
      toast.success('Carteira adicionada')
      setIsOpen(false)
      reset({
        bank: undefined,
        category: undefined,
        observation: '',
        balance: '',
        type: undefined,
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
        <DialogTitle>Adicionar conta</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="flex flex-col px-4 py-8 gap-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="type" className="text-sm font-medium">
                Tipo
              </label>
              <div className="flex w-full gap-2">
                <SelectedOption
                  label="Moeda fiduciária"
                  selected={selectedType === 'fiat'}
                  setSelected={handleSelect}
                  value="fiat"
                />
                <SelectedOption
                  label="Cripto"
                  selected={selectedType === 'cripto'}
                  setSelected={handleSelect}
                  value="cripto"
                />
              </div>
            </div>
            {selectedType === 'fiat' ? (
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="bank" className="text-sm font-medium">
                  Banco
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Select
                    onValueChange={(val) =>
                      setValue('bank', val as RegisterData['bank'])
                    }
                    value={bank}
                  >
                    <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 ">
                      {banks.map((bank) => (
                        <SelectItem
                          key={bank}
                          value={bank}
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bank && (
                    <span className="text-red-400 text-xs">
                      {errors.bank.message}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="bank" className="text-sm font-medium">
                  Moeda
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Select
                    onValueChange={(val) =>
                      setValue('bank', val as RegisterData['bank'])
                    }
                    value={bank}
                  >
                    <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 ">
                      {Object.entries(criptos).map(([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bank && (
                    <span className="text-red-400 text-xs">
                      {errors.bank.message}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="balance" className="text-sm font-medium">
                Saldo
              </label>
              <div className="flex flex-col w-full gap-2">
                <Input
                  placeholder="R$ 0,00"
                  {...register('balance')}
                  onChange={(e) => {
                    const formatted = moneyMask(e.target.value)
                    if (formatted !== 'NaN') {
                      setValue('balance', `R$ ${formatted}`)
                    } else {
                      setValue('balance', 'R$ 0,00')
                    }
                  }}
                />
                {errors.balance && (
                  <span className="text-red-400 text-xs">
                    {errors.balance.message}
                  </span>
                )}
              </div>
            </div>
            {selectedType === 'fiat' && (
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="category" className="text-sm font-medium">
                  Pessoa
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Select
                    onValueChange={(val) => {
                      setValue('category', val as RegisterData['category'])
                    }}
                    value={category}
                  >
                    <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 ">
                      <SelectItem
                        value="pessoa_fisica"
                        className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                      >
                        Pessoa física
                      </SelectItem>
                      <SelectItem
                        value="pessoa_juridica"
                        className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                      >
                        Pessoa Jurídica
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
            )}
            {selectedType === 'fiat' && (
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="type" className="text-sm font-medium">
                  Tipo de conta
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Select
                    value={type}
                    onValueChange={(val) =>
                      setValue('type', val as RegisterData['type'])
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 ">
                      {Object.entries(accountTypes).map(([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <span className="text-red-400 text-xs">
                      {errors.type.message}
                    </span>
                  )}
                </div>
              </div>
            )}
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

function SelectedOption({
  value,
  label,
  selected,
  setSelected,
}: {
  value: 'fiat' | 'cripto'
  label: string
  selected: boolean
  setSelected: (arg: 'fiat' | 'cripto') => void
}) {
  return (
    <button
      className={cn(
        'flex w-full h-24 items-center p-3 gap-2 rounded-lg border',
        selected ? 'bg-zinc-700' : '',
      )}
      onClick={() => setSelected(value)}
    >
      <CircleCheckbox checked={selected} className="scale-[0.8]" />
      <p className="text-xs text-zinc-400">{label}</p>
    </button>
  )
}
