'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useAffiliateStore } from '@/store/affiliate-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { CodeDialogTrigger } from '../code-affiliate'

const schema = z.object({
  code: z.string().min(2, { message: 'Obrigatório' }),
})

export function AffiliateCodeDialogTrigger({
  children,
  code,
}: {
  children: ReactNode
  code: string
}) {
  const [open, setOpen] = useState(false)
  const { setCode } = useAffiliateStore()
  const form = useForm<{ code: string }>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = form

  async function handleSaveCode({ code }: { code: string }) {
    try {
      await api.get('/indique/show/' + code)
      setCode(code)
      toast.success('Código salvo')
      setOpen(false)
    } catch {
      toast.error('Não foi possível salvar esse código')
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900">
        <FormProvider {...form}>
          <DialogHeader>
            <DialogTitle>Insira o seu código de afiliado</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col w-full gap-3 px-6 py-4">
            <label htmlFor="code" className="text-sm font-medium">
              Código de afiliação
            </label>
            <div className="flex flex-col w-full gap-2">
              <Input
                placeholder="Insira o código"
                maxLength={64}
                defaultValue={code}
                {...register('code')}
              />
              {errors.code && (
                <span className="text-red-400 text-xs">
                  {errors.code.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="border-t p-4">
            <CodeDialogTrigger>
              <Button variant="outline">Como encontrar o meu código?</Button>
            </CodeDialogTrigger>
            <Button
              onClick={handleSubmit(handleSaveCode)}
              loading={isSubmitting}
            >
              Salvar
            </Button>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
