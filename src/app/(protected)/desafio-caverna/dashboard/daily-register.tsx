'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CircleCheckbox } from '@/components/ui/circle-checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, CheckCheckIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export function DailyRegisterDialog({
  challenge,
  open,
  setOpen,
}: {
  challenge: Challenge
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  const queryClient = useQueryClient()
  const [answered, setAnswered] = useState(false)
  const [positiveChecked, setPositiveChecked] = useState<string[]>([])
  const [negativeChecked, setNegativeChecked] = useState<string[]>([])

  function handlePositiveCheck(option: string) {
    setPositiveChecked((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((opt) => opt !== option)
      } else {
        return [...prevOptions, option]
      }
    })
  }
  function handleNegativeCheck(option: string) {
    setNegativeChecked((prevOptions) => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter((opt) => opt !== option)
      } else {
        return [...prevOptions, option]
      }
    })
  }

  async function handleRegister(status: 'positiveCheck' | 'negativeCheck') {
    try {
      if (!challenge.dia_atual) throw new Error('Desafio não iniciado')
      await api.put('/desafios/assess', {
        dia: challenge.dia_atual,
        status,
        array_comprometimento: challenge.array_comprometimento.map((item) => {
          if (negativeChecked.includes(item)) {
            return {
              tarefa: item,
              feito: true,
            }
          } else {
            return {
              tarefa: item,
              feito: false,
            }
          }
        }),
        array_falhar: challenge.array_falhar.map((item) => {
          if (positiveChecked.includes(item)) {
            return {
              tarefa: item,
              feito: true,
            }
          } else {
            return {
              tarefa: item,
              feito: false,
            }
          }
        }),
      })
      toast.success('Avaliação salva!')
      queryClient.invalidateQueries({ queryKey: ['challenge'] })
      setAnswered(true)
    } catch {
      toast.error('Não foi possível salvar a avaliação!')
    }
  }

  if (answered) {
    return <AnsweredDialog open={open} setOpen={setOpen} />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col h-[85%] max-h-[900px] max-w-3xl items-center bg-zinc-800 border-zinc-700 p-0 gap-8 overflow-x-hidden">
        <DialogHeader className="w-full items-center p-6">
          <DialogTitle className="w-fit px-3 py-2 text-sm border border-white rounded-full uppercase">
            Registro Diário
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-1 w-full gap-8">
          <div
            className="grid grid-cols-2 w-full px-6 gap-5"
            style={{ flex: '0 0 60%' }}
          >
            <div className="flex flex-col px-5 py-4 gap-6 border rounded-lg">
              <span className="flex w-fit px-3 py-2 text-xs border rounded-full uppercase">
                Hábitos Obrigatórios
              </span>
              <div className="flex flex-col gap-4">
                {challenge.array_falhar.map((item, index) => (
                  <div key={item + index} className="flex items-center gap-3">
                    <Checkbox
                      className="rounded-full border-emerald-400 data-[state=checked]:bg-emerald-400"
                      onCheckedChange={() => handlePositiveCheck(item)}
                    />
                    <span className="text-zinc-400 truncate">
                      {item.replace('✅', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col px-5 py-4 gap-6 border rounded-lg">
              <span className="flex w-fit px-3 py-2 text-xs border rounded-full uppercase">
                Comportamentos Proibidos
              </span>
              <div className="flex flex-col gap-4">
                {challenge.array_comprometimento.map((item, index) => (
                  <div key={item + index} className="flex items-center gap-3">
                    <CircleCheckbox
                      onCheckedChange={() => handleNegativeCheck(item)}
                    />
                    <span className="text-zinc-400 truncate">
                      {item.replace('❌', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter
            className="flex sm:flex-col w-full items-center sm:justify-center gap-8 border-t"
            style={{ flex: '1 1 auto' }}
          >
            <div className="flex flex-col items-center gap-3">
              <Image
                src={'/images/logo-icon.svg'}
                alt="Logo"
                width={26}
                height={22}
              />
              <p className="text-center text-2xl max-w-md">
                De acordo com as marcações, como você avalia a sua conduta hoje?
              </p>
            </div>
            <div className="flex w-full items-center justify-center gap-3">
              <Button
                className="flex-1 max-w-24 text-red-300 bg-red-900"
                onClick={() => handleRegister('negativeCheck')}
              >
                Negativa
              </Button>
              <Button
                className="flex-1 max-w-24 text-emerald-300 bg-emerald-800"
                onClick={() => handleRegister('positiveCheck')}
              >
                Positiva
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AnsweredDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  const { data: challenge } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col max-w-[400px] h-full max-h-[520px] items-center bg-zinc-800 border-zinc-700 p-3 gap-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          {challenge &&
            (challenge.hojeInfo === 'positiveCheck' ? (
              <CheckCheckIcon size={32} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={32} className="text-red-500" />
            ))}
          <DialogTitle className="text-2xl font-semibold text-center max-w-64">
            {challenge ? (
              challenge.hojeInfo === 'positiveCheck' ? (
                'Parabéns, mais um dia vencido'
              ) : (
                'Parece que você vacilou hoje'
              )
            ) : (
              <span className="opacity-0">Carregando...</span>
            )}
          </DialogTitle>
          {challenge && challenge.hojeInfo === 'negativeCheck' && (
            <DialogDescription className="max-w-40 text-center">
              Não se preocupe. Amanhã é um novo dia.
            </DialogDescription>
          )}
        </div>
        <DialogFooter className="w-full">
          <Button
            onClick={() => setOpen(false)}
            className="w-fit px-4 self-end"
          >
            Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
