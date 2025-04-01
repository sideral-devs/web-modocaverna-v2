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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { formatMoney } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EditAccountDialog } from '../edit-account-dialog'
import { NewAccountDialog } from '../new-account-dialog'

export default function WalletsCard() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentBank, setCurrentBank] = useState<Wallet | null>(null)

  const { data, error, refetch } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await api.get('/datatables/financeiro-carteiras')
      return response.data as Wallet[]
    },
  })

  function handleEditModalOpen(bank: Wallet) {
    setEditModalOpen(true)
    setCurrentBank(bank)
  }

  async function handleDeleteBank(id: number) {
    try {
      await api.delete('/carteiras/destroy/' + id)
      toast.success('Conta excluída com sucesso')
    } catch {
      toast.error('Não foi possível excluir a conta')
    } finally {
      queryClient.refetchQueries({ queryKey: ['wallets'] })
      setDeleteModalOpen(false)
    }
  }

  if (error) {
    return (
      <Card className="flex flex-col w-full h-96 items-center justify-center gap-1">
        <p className="text-zinc-500 italic">
          Não foi possível carregar essas informações
        </p>
      </Card>
    )
  }

  if (!data) {
    return <Skeleton className="w-full h-96" />
  }

  return (
    <Card className="flex flex-col w-full h-96 gap-1">
      <div className="flex w-full items-center justify-between p-5">
        <span className="flex py-2 px-3 border rounded-full text-xs">
          CARTEIRA
        </span>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!data}>
              Novo Banco
            </Button>
          </DialogTrigger>
          <NewAccountDialog refetch={refetch} setIsOpen={setIsOpen} />
        </Dialog>
      </div>
      <div className="flex flex-1 overflow-y-auto scrollbar-minimal">
        <Table className="h-fit table-fixed">
          <TableHeader>
            <TableRow className="text-zinc-400 text-sm bg-zinc-900">
              <TableHead className="w-[10%] py-4 px-4"></TableHead>
              <TableHead className="py-4 text-sm">Banco</TableHead>
              <TableHead className="py-4 text-sm">Tipo</TableHead>
              <TableHead className="py-4 text-sm">Saldo</TableHead>
              <TableHead className="w-[10%] py-4 px-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="flex-1 p-6">
            {data.map((bank, index) => (
              <TableRow
                key={`bank-${index}`}
                className="w-full max-w-full min-w-0 border-0 group"
              >
                <TableCell className="pl-5 pr-4 py-4 text-sm group-first:pt-6 group-last:pb-6">
                  {index + 1}
                </TableCell>
                <TableCell className="py-4 text-sm group-first:pt-6 group-last:pb-6">
                  {bank.banco}
                </TableCell>
                <TableCell className="py-4 text-sm group-first:pt-6 group-last:pb-6">
                  {bank.tipo}
                </TableCell>
                <TableCell className="py-4 text-sm group-first:pt-6 group-last:pb-6">
                  {formatMoney(Number(bank.saldo))}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <EllipsisVertical size={16} className="text-zinc-400" />
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
                      <button
                        onClick={() => handleEditModalOpen(bank)}
                        className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                      >
                        Editar
                      </button>
                      <Dialog
                        open={deleteModalOpen}
                        onOpenChange={setDeleteModalOpen}
                      >
                        <DialogTrigger asChild>
                          <button className="flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300">
                            Excluir
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="flex flex-col w-[80%] p-7 gap-6">
                            <div className="flex flex-col gap-3">
                              <DialogTitle className="text-lg">
                                Tem certeza que deseja excluir essa conta?
                              </DialogTitle>
                              <p className="text-sm text-zinc-400">
                                Essa ação pode ser irreversível...
                              </p>
                            </div>
                          </div>
                          <DialogFooter className="p-4 border-t">
                            <DialogClose asChild>
                              <Button variant="ghost">Cancelar</Button>
                            </DialogClose>
                            <Button
                              onClick={() => handleDeleteBank(bank.carteira_id)}
                            >
                              Excluir
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full items-center justify-between p-5 pt-4 border-t">
        <span className="text-sm text-zinc-400">Total</span>
        <span className="text-lg font-semibold text-emerald-400">
          {data ? (
            formatMoney(
              data.reduce((total, account) => total + Number(account.saldo), 0),
            )
          ) : (
            <Skeleton className="w-28 h-6 bg-emerald-400/40" />
          )}
        </span>
      </div>
      <EditAccountDialog
        open={editModalOpen}
        setIsOpen={setEditModalOpen}
        wallet={currentBank}
        refetch={refetch}
      />
    </Card>
  )
}
