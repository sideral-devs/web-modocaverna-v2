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
      <DialogContent className=" gap-0 border-none h-[590px] !w-[797px] pt-10 max-w-none bg-zinc-200 text-black overflow-x-hidden overflow-y-auto scrollbar-minimal">
        <div
          className="absolute top-2 right-2 cursor-pointer z-50 bg-black p-3 rounded-sm"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4 cursor-pointer text-white opacity-100" />
          <span className="sr-only">Close</span>
        </div>
        <DialogTitle className="text-2xl h-[30px] px-20 ">
          {poup.title}
        </DialogTitle>

        <div className="w-full h-[389px] flex justify-center  rounded-xl overflow-hidden">
          <Image
            src={'/images/dialogs/banner-loja.png'}
            alt="Banner"
            className=" w-[693px] h-[389px] max-w-none max-h-none rounded-lg"
            width={693}
            height={389}
          />
        </div>

        <AlertDialogFooter className="px-20  sm:justify-center flex flex-row sm:flex-row pb-5 justify-center gap-20">
          <h3 className="w-[260px]">
            Utilize o cupom &quot;
            <span className="text-primary">APLICATIVO</span>&quot; para garantir
            um super desconto.
          </h3>
          <Link
            className="h-[46px]"
            href={`https://redirect.lifs.app/sejacaverna`}
            target="_blank"
          >
            <Button className="w-[214px] h-[46px] text-lg">ACESSAR LOJA</Button>
          </Link>
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  )
}
