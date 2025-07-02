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
      <DialogContent className="gap-0 border-none max-h-[590px] w-[90%] max-w-[797px] bg-zinc-200 text-black overflow-x-hidden overflow-y-auto rounded-sm scrollbar-minimal">
        <div
          className="absolute top-2 right-2 cursor-pointer z-50 bg-black p-3 rounded-sm"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4 cursor-pointer text-white opacity-100" />
          <span className="sr-only">Close</span>
        </div>
        <DialogTitle className="md:text-2xl sm:text-xl xs:text-sm text-xs  h-[30px] sm:px-20  px-5 my-5">
          {poup.title}
        </DialogTitle>

        <div className="flex justify-center  rounded-xl overflow-hidden">
          <Image
            src={'/images/dialogs/banner-loja.png'}
            alt="Banner"
            className=" lg:w-[693px] lg:h-[389px] sm:w-[415.8px] sm:h-[233.4px] w-[250px] h-[140px]  max-w-none max-h-none rounded-lg"
            width={693}
            height={389}
          />
        </div>

        <AlertDialogFooter className="sm:px-20 xs:px-10 px-5 mt-10  sm:justify-center flex xs:flex-row flex-col  pb-5 justify-center sm:gap-20 xs:gap-8 gap-3">
          <h3 className="md:w-[260px] md:text-base text-xs">
            Utilize o cupom &quot;
            <span className="text-primary md:text-base text-xs">
              APLICATIVO
            </span>
            &quot; para garantir um super desconto.
          </h3>
          <Link
            className="h-[46px]"
            href={`https://redirect.lifs.app/sejacaverna`}
            target="_blank"
          >
            <Button className="md:w-[214px] md:h-[46px] md:text-lg w-full text-xs ">
              ACESSAR LOJA
            </Button>
          </Link>
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  )
}
