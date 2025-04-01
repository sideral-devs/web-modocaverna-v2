import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { CircleDollarSign } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { CircleCheckbox } from '@/components/ui/circle-checkbox'
import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { toast } from 'sonner'

dayjs.extend(customParseFormat)

export function ReplicateDialogTrigger({
  children,
  transactions,
  type,
  month,
  monthString,
  refetch,
}: {
  children: ReactNode
  transactions: Transaction[]
  type: 'revenue' | 'expense'
  month: string
  monthString: string
  refetch: () => void
}) {
  const queryClient = useQueryClient()
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const dateStart = dayjs(month, 'YYYY-MM').startOf('month')
      const dateEnd = dayjs(month, 'YYYY-MM').endOf('month')
      const res = await api.post(
        '/transacoes/clone',
        {},
        {
          params: {
            date_field: 'data',
            date_start: dateStart.format('YYYY-MM-DD'),
            date_end: dateEnd.format('YYYY-MM-DD'),
            sortby_keyword: 'data',
            transacoes_tipo: type === 'revenue' ? 'receitas' : 'custos',
          },
        },
      )

      return res.data
    },
  })

  function handleSelect(transactionId: number) {
    if (selectedTransactions.includes(transactionId)) {
      setSelectedTransactions(
        selectedTransactions.filter((id) => id !== transactionId),
      )
    } else {
      setSelectedTransactions([...selectedTransactions, transactionId])
    }
  }

  function handleSelectAll() {
    setSelectedTransactions(
      transactions.map((transaction) => transaction.transacao_id),
    )
  }

  async function handleClone() {
    try {
      await mutateAsync()
      setSelectedTransactions([])
      toast.success('Transações replicadas com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      refetch()
      setDialogOpen(false)
    } catch {
      toast.error('Não foi possível replicar as transações!')
      setDialogOpen(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[628px] bg-zinc-900">
        <DialogHeader className="flex flex-row items-center gap-3">
          {type === 'revenue' ? (
            <>
              <CircleDollarSign className="text-emerald-400 stroke-2" />
              <DialogTitle className="flex py-2 px-3 border rounded-full text-xs uppercase">
                Detalhamento de receita
              </DialogTitle>
            </>
          ) : (
            <>
              <CircleDollarSign className="text-red-500 stroke-2" />
              <DialogTitle className="flex py-2 px-3 border rounded-full text-xs uppercase">
                Detalhamento de custo
              </DialogTitle>
            </>
          )}
        </DialogHeader>
        <div className="flex flex-col max-h-[26rem] px-4 gap-8 overflow-y-auto">
          <p className="font-semibold">
            Selecione para replicar {type === 'revenue' ? 'receita' : 'custo'}{' '}
            para <span className="text-primary">{monthString}</span>
          </p>
          <div className="flex flex-1 overflow-y-auto scrollbar-minimal">
            <Table className="h-full">
              <TableBody className="flex-1 p-6">
                {transactions.map((transaction, index) => (
                  <TableRow
                    key={`transaction-${index}`}
                    className="border-0 group"
                  >
                    <TableCell className="py-4 text-xs group-first:pt-6 group-last:pb-6">
                      <div className="flex items-center gap-4">
                        <CircleCheckbox
                          checked={selectedTransactions.includes(
                            transaction.transacao_id,
                          )}
                          onCheckedChange={() => {
                            handleSelect(transaction.transacao_id)
                          }}
                        />
                        {transaction.titulo}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-xs group-first:pt-6 group-last:pb-6">
                      {transaction.categoria}
                    </TableCell>
                    <TableCell className="py-4 text-xs group-first:pt-6 group-last:pb-6">
                      {transaction.data}
                      {/* {dayjs(transaction.data, 'DD/MM/YYYY').format(
                        `DD [de] [${monthString}]`,
                      )} */}
                    </TableCell>
                    <TableCell className="py-4 text-xs group-first:pt-6 group-last:pb-6">
                      {transaction.valor}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter className="justify-between sm:justify-between border-t p-4">
          <Button onClick={handleSelectAll} variant="link" size="sm">
            Selecionar todas
          </Button>
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-zinc-400">
              Replicar em {monthString}?
            </span>
            <Button size="sm" onClick={handleClone}>
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
