'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { X } from 'lucide-react'
import Link from 'next/link'

export default function DialogCaveStore({
  isOpen,
  setOpen,
  poup,
}: {
  isOpen: boolean
  setOpen: (open: boolean) => void
  poup: Poup
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className=" border-none h-[590px] !w-[797px] px-20 pt-10 max-w-none bg-gradient-to-b from-[#1C1C1C] to-[#111111] overflow-x-hidden overflow-y-auto scrollbar-minimal">
        <div
          className="absolute top-2 right-2 cursor-pointer z-50 bg-zinc-800 p-3 rounded-sm"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4 cursor-pointer text-red-700 opacity-100" />
          <span className="sr-only">Close</span>
        </div>
        <DialogTitle className="text-2xl ">{poup.title}</DialogTitle>
        <div className="justify-center flex flex-col items-center gap-10">
          <div className="w-full h-[354px]  rounded-xl overflow-hidden">
            <Image
              src={'/images/dialogs/banner-loja.png'}
              alt="Banner"
              className=" object-cover w-full rounded-lg"
              width={630}
              height={354}
            />
          </div>
        </div>
        <AlertDialogFooter className=" sm:justify-center flex flex-row sm:flex-row py-5 justify-center gap-20">
          <h3 className="w-[260px]">
            Utilize o cupom &quot;<span className='text-[#FFC803]'>APLICATIVO</span>&quot; para garantir um super
            desconto.
          </h3>
          <Link className='h-[46px]' href={`https://redirect.lifs.app/sejacaverna`} target="_blank">
            <Button className="w-[214px] h-[46px] text-lg">ACESSAR LOJA</Button>
          </Link>
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  )
}
