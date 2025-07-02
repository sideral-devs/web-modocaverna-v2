'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CircleDollarSign, EllipsisVertical, PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { EditExpenseDialog } from '../edit-expense-dialog'
import { EditRevenueDialog } from '../edit-revenue-dialog'
import { NewExpenseDialog } from '../new-expense-dialog'
import { NewRevenueDialog } from '../new-revenue-dialog'
import { ReplicateDialogTrigger } from '../replicate-dialog'

dayjs.extend(customParseFormat)

export default function TableDetailsCard({
  transactions,
  month,
  nextMonthString,
  refetch,
  mode,
}: {
  transactions: Transaction[]
  month: string
  monthString: string
  nextMonthString: string
  refetch: () => void
  mode: 'revenue' | 'expense'
}) {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [editRevenueOpen, setEditRevenueOpen] = useState(false)
  const [editExpenseOpen, setEditExpenseOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleDeleteTransaction(id: number) {
    try {
      await api.delete('/transacoes/destroy/' + id)
      toast.success('Transação excluída com sucesso')
      refetch()
    } catch {
      toast.error('Não foi possível fazer isso!')
    }
  }

  async function handlePostTransaction(transaction: Transaction) {
    try {
      await api.put(`/transacoes/update/${transaction.transacao_id}`, {
        checked: !transaction.checked,
      })
      refetch()
    } catch {
      toast.error('Erro ao alterar o status da transação')
    }
  }

  return (
    <Card className="flex flex-col w-full h-[48rem]">
      <div className="flex w-full items-center justify-between p-5 border-b">
        {mode === 'revenue' ? (
          <div className="flex items-center gap-3">
            <CircleDollarSign className="text-emerald-400 stroke-2 md:hidden lg:block" />
            <span className="flex py-2 px-3 border rounded-full text-[10px] lg:text-xs uppercase">
              Detalhamento de receita
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CircleDollarSign className="text-red-500 stroke-2 md:hidden lg:block" />
            <span className="flex py-2 px-3 border rounded-full text-[10px] lg:text-xs uppercase">
              Detalhamento de custo
            </span>
          </div>
        )}
        {transactions.length > 0 ? (
          <ReplicateDialogTrigger
            transactions={transactions}
            monthString={nextMonthString}
            month={month}
            type={mode}
            refetch={refetch}
          >
            <Button
              size="sm"
              className={mode === 'revenue' ? 'bg-emerald-700' : ''}
            >
              Replicar em {nextMonthString}
            </Button>
          </ReplicateDialogTrigger>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <PlusIcon className="text-red-500 cursor-pointer" />
            </DialogTrigger>
            {mode === 'revenue' ? (
              <NewRevenueDialog refetch={refetch} setIsOpen={setIsOpen} />
            ) : (
              <NewExpenseDialog refetch={refetch} setIsOpen={setIsOpen} />
            )}
          </Dialog>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col flex-1 relative">
          <Image
            src={'/images/transactions-blur.png'}
            fill
            alt="bg"
            draggable={false}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-semibold text-center max-w-80">
              Faça seu registro de {mode === 'revenue' ? 'receita' : 'custos'}
            </p>
            <span className="text-sm text-zinc-400 text-center max-w-80">
              Cadastre um valor para detalhar suas finanças
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-full items-center justify-between px-5 py-3">
            <span className="flex py-2 px-3 bg-zinc-500 rounded-full text-xs font-semibold uppercase">
              {mode === 'revenue' ? 'A receber' : 'A pagar'}
            </span>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <PlusIcon
                  className={cn(
                    'cursor-pointer',
                    mode === 'revenue' ? 'text-emerald-400' : 'text-red-500',
                  )}
                />
              </DialogTrigger>
              {mode === 'revenue' ? (
                <NewRevenueDialog refetch={refetch} setIsOpen={setIsOpen} />
              ) : (
                <NewExpenseDialog refetch={refetch} setIsOpen={setIsOpen} />
              )}
            </Dialog>
          </div>
          <div className="flex flex-1 overflow-y-auto scrollbar-minimal">
            <Table className="table-fixed h-fit">
              <TableHeader>
                <TableRow className="text-zinc-400 text-sm bg-zinc-900">
                  <TableHead className="w-[10%] py-4 px-4"></TableHead>
                  <TableHead className="py-4 px-0 pl-1">Título</TableHead>
                  <TableHead className="py-4">Categoria</TableHead>
                  <TableHead className="py-4">Recebimento</TableHead>
                  <TableHead className="py-4">Valor</TableHead>
                  <TableHead className="w-[10%] py-4 px-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="p-6">
                {transactions
                  .filter((item) => !item.checked)
                  .map((transaction, index) => (
                    <TableRow
                      key={`transaction-${index}`}
                      className="w-full max-w-full min-w-0 border-0 group"
                    >
                      <TableCell className="pl-5 pr-4 py-4 text-sm text-zinc-400 group-first:pt-6 group-last:pb-6">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {transaction.titulo}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6 capitalize">
                        {transaction.tipo?.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {dayjs(transaction.data, 'DD/MM/YYYY').format(`DD/MM`)}
                        {/* {dayjs(transaction.data, 'DD/MM/YYYY').format(
                      `DD [de] [${monthString}]`,
                    )} */}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {transaction.valor}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        <EditDeletePopover
                          transaction={transaction}
                          id={transaction.transacao_id}
                          onDelete={handleDeleteTransaction}
                          onPost={handlePostTransaction}
                          handleOpenDialog={() => {
                            setTransaction(transaction)
                            if (mode === 'revenue') {
                              setEditRevenueOpen(true)
                            } else {
                              setEditExpenseOpen(true)
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex w-full items-center px-5 py-3 border-t">
            <span className="flex py-2 px-3 bg-zinc-500 rounded-full text-xs font-semibold uppercase">
              Efetivados
            </span>
          </div>
          <div className="flex flex-1 overflow-y-auto scrollbar-minimal">
            <Table className="table-fixed h-fit">
              <TableHeader>
                <TableRow className="text-zinc-400 text-sm bg-zinc-900">
                  <TableHead className="w-[10%] py-4 px-4"></TableHead>
                  <TableHead className="py-4 px-0 pl-1">Título</TableHead>
                  <TableHead className="py-4">Categoria</TableHead>
                  <TableHead className="py-4">Recebimento</TableHead>
                  <TableHead className="py-4">Valor</TableHead>
                  <TableHead className="w-[10%] py-4 px-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="flex-1 p-6">
                {transactions
                  .filter((item) => item.checked === true)
                  .map((transaction, index) => (
                    <TableRow
                      key={`transaction-${index}`}
                      className="border-0 group"
                    >
                      <TableCell className="pl-5 pr-4 py-4 text-sm text-zinc-400 group-first:pt-6 group-last:pb-6">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {transaction.titulo}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {transaction.tipo?.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {dayjs(transaction.data, 'DD/MM/YYYY').format(`DD/MM`)}
                        {/* {dayjs(transaction.data, 'DD/MM/YYYY').format(
                      `DD [de] [${monthString}]`,
                    )} */}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        {transaction.valor}
                      </TableCell>
                      <TableCell className="py-4 text-sm truncate group-first:pt-6 group-last:pb-6">
                        <EditDeletePopover
                          transaction={transaction}
                          id={transaction.transacao_id}
                          onDelete={handleDeleteTransaction}
                          onPost={handlePostTransaction}
                          handleOpenDialog={() => {
                            setTransaction(transaction)
                            if (mode === 'revenue') {
                              setEditRevenueOpen(true)
                            } else {
                              setEditExpenseOpen(true)
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {transaction && editExpenseOpen && (
            <EditExpenseDialog
              transaction={transaction}
              refetch={refetch}
              open={editExpenseOpen}
              setOpen={setEditExpenseOpen}
            />
          )}

          {transaction && editRevenueOpen && (
            <EditRevenueDialog
              transaction={transaction}
              refetch={refetch}
              open={editRevenueOpen}
              setOpen={setEditRevenueOpen}
            />
          )}
        </>
      )}
    </Card>
  )
}

function EditDeletePopover({
  transaction,
  id,
  onDelete,
  onPost,
  handleOpenDialog,
}: {
  transaction: Transaction
  id: number
  onDelete: (arg: number) => Promise<void>
  onPost: (transaction: Transaction) => Promise<void>
  handleOpenDialog: () => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVertical size={16} className="text-zinc-400 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
        <button
          onClick={() => onPost(transaction)}
          className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
        >
          {transaction.checked ? 'Desmarcar' : 'Efetivar'}
        </button>
        <button
          className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
          onClick={handleOpenDialog}
        >
          Editar
        </button>

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300">
              Excluir
            </button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col w-[80%] p-7 gap-6">
              <div className="flex flex-col gap-3">
                <DialogTitle className="text-lg">
                  Tem certeza que deseja excluir essa transação?
                </DialogTitle>
                <p className="text-sm text-zinc-400">
                  Essa ação pode ser irreversível.
                </p>
              </div>
            </div>
            <DialogFooter className="p-4 border-t">
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={() => onDelete(id)}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  )
}
