'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VideoPlayer } from '@/components/video-player'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import { Bookmark, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CommandmentDialog({
  id,
  initialData,
  open,
  setOpen,
}: {
  id: number
  initialData: DesafioCommandment['commandment']
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  const { data } = useQuery({
    queryKey: ['commandment', id],
    queryFn: async () => {
      const res = await api.get(`/mandamentos/show/${initialData.number}`)
      return res.data as Commandment
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {data && (
        <DialogContent
          hideIcon
          className="grid grid-cols-1 md:grid-cols-2 h-[90%] md:h-[481px] max-h-[90%] w-[95%] md:max-w-[1180px] bg-gradient-to-b from-[#1C1C1C] to-[#111111] overflow-x-hidden overflow-y-auto scrollbar-minimal"
        >
          <div className="flex flex-col pt-14 px-6 gap-6">
            <div className="absolute -top-4 right-6 z-50 md:right-12">
              <Bookmark className="text-red-700 fill-red-700" size={90} />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                {String(data.number).padStart(2, '0')}
              </span>
            </div>
            <div
              className="absolute top-2 right-2 cursor-pointer z-50 border border-zinc-700 p-3 rounded-sm"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 cursor-pointer text-red-700" />
              <span className="sr-only">Close</span>
            </div>
            <div className="flex flex-col gap-6">
              <DialogTitle className="text-4xl font-bold uppercase text-gradient">
                {data.title}
              </DialogTitle>
              <p className="text-sm">{data.description}</p>
            </div>
            <div className="w-full flex flex-col px-4 py-6 gap-4 bg-gradient-to-r from-[#191919] to-[#212121] border-b-4 border-primary">
              <p className="text-sm">
                <strong>Como fazer: </strong>
                {data.how_to_do}
              </p>
            </div>
          </div>
          <div className="flex flex-col h-fit md:h-full min-h-80 md:min-h-0 justify-center  relative">
            {data.medias.length === 1 &&
              (data.medias[0].type === 'video' ? (
                <div className="aspect-video rounded-xl overflow-hidden pr-[60px] pt-8">
                  <VideoPlayer id={data.medias[0].url} />
                </div>
              ) : (
                <div className="flex w-full h-full flex-1 relative">
                  <Image
                    src={env.NEXT_PUBLIC_PROD_URL + data.medias[0].url}
                    alt="Imagem com descrição do mandamento"
                    className="object-cover"
                    fill
                  />
                </div>
              ))}

            {data.medias.length === 2 && (
              <div className="h-80 grid grid-cols-2 md:grid-cols-3 w-full flex-1 gap-4 pt-8 md:pt-0 md:pr-[60px]">
                {data.medias.map((media, index) =>
                  media.type === 'image' ? (
                    <div
                      key={media.type + index}
                      className="relative md:col-span-2"
                    >
                      <Image
                        src={env.NEXT_PUBLIC_PROD_URL + media.url}
                        alt="Imagem com descrição do mandamento"
                        className="object-contain"
                        fill
                      />
                    </div>
                  ) : (
                    media.type === 'pdf' && (
                      <div className="flex flex-col justify-center gap-8">
                        <Image
                          src={'/images/pdf.png'}
                          width={137}
                          height={168}
                          alt="Pdf"
                        />
                        <Link
                          href={env.NEXT_PUBLIC_PROD_URL + media.url}
                          target="_blank"
                        >
                          <Button size="sm">Clique e Acesse</Button>
                        </Link>
                      </div>
                    )
                  ),
                )}
              </div>
            )}
            {data.medias.length === 3 && (
              <div className="h-80 grid grid-cols-2 w-full flex-1 gap-4 pt-8 pl-[60px] md:pl-0 md:pt-0 md:pr-[60px">
                <div className="flex flex-col justify-center gap-4">
                  {data.medias
                    .filter((m) => m.type === 'pdf')
                    .map((media, index) => (
                      <div
                        key={media.type + index}
                        className="flex items-center gap-8 z-10"
                      >
                        <Image
                          src={'/images/pdf.png'}
                          width={61}
                          height={75}
                          alt="Pdf"
                          className="object-contain"
                        />
                        <Link
                          href={env.NEXT_PUBLIC_PROD_URL + media.url}
                          target="_blank"
                        >
                          <Button>Clique e Acesse</Button>
                        </Link>
                      </div>
                    ))}
                </div>
                {data.medias
                  .filter((m) => m.type === 'image')
                  .map((media, index) => (
                    <div
                      key={media.type + index}
                      className="absolute w-[377px] h-[357px] top-1/2 -translate-y-1/2 -right-6 z-[5]"
                    >
                      <Image
                        src={env.NEXT_PUBLIC_PROD_URL + media.url}
                        alt="Imagem com descrição do mandamento"
                        className="object-contain"
                        fill
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
