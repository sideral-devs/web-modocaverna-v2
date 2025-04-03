'use client'

import { Card, CardHeader } from '@/components/ui/card'

import Image from 'next/image'

export default function RitualsCard() {
  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] relative p-4 gap-5 overflow-hidden">
      <CardHeader className="justify-between">
        <div className="flex px-3 py-2 pt-[9px] border border-white rounded-full">
          <span className="text-[10px] font-semibold">RITUAIS</span>
        </div>
      </CardHeader>
      <div className="flex flex-col flex-1 items-center justify-around relative bottom-8">
        <Image
          src="/images/empty-states/empty_rituals.png"
          alt="Nenhum objetivo encontrado"
          width={140}
          height={110}
          className="opacity-50"
        ></Image>
        <div className="w-60">
          <p className="text-[13px] text-zinc-400 text-center">
            Em breve você poderá criar e acompanhar seus rituais por aqui.
          </p>
        </div>
      </div>
    </Card>
  )
}
