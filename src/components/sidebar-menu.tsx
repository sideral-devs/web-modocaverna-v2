'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useUser } from '@/hooks/queries/use-user'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import {
  Bookmark,
  ClipboardCheck,
  DollarSignIcon,
  FlameIcon,
  HistoryIcon,
  HourglassIcon,
  QuoteIcon,
  TargetIcon,
  TrophyIcon,
  Users2Icon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

dayjs.locale('pt-br')

export function SidebarMenuTrigger({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SidebarMenu />
    </Sheet>
  )
}

function SidebarMenu() {
  const { data: user } = useUser()
  const [imageError, setImageError] = useState(false)

  if (!user) {
    return null
  }

  return (
    <SheetContent
      side="left"
      className="flex flex-col px-4 py-12 gap-6 bg-zinc-800 overflow-y-auto scrollbar-minimal"
    >
      <SheetHeader className="flex flex-row items-center gap-3">
        {user.user_foto && !imageError ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_PROD_URL}/${user.user_foto}`}
            width={40}
            height={40}
            className="rounded-full"
            objectFit="cover"
            objectPosition="center"
            alt="Foto do usuário"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex w-10 h-10 items-center justify-center bg-primary px-3 rounded-full cursor-pointer">
            <span className="text-2xl uppercase">{user.name[0]}</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p>{user.name}</p>
          <span className="text-xs text-muted-foreground">
            Membro desde{' '}
            {dayjs(user.data_de_compra, 'YYYY-MM-DD HH:mm:ss').format(
              'DD MMM, YYYY',
            )}
          </span>
        </div>
      </SheetHeader>
      <div className="w-full h-[1px] bg-border" />
      <div className="flex flex-col gap-6">
        <span className="flex w-fit px-3 py-[5px] border border-white rounded-full text-[0.5rem] md:text-xs">
          Ferramentas
        </span>
        <div className="flex flex-col gap-8">
          <Link
            href="/desafio-caverna"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <FlameIcon size={16} />
            <span>Desafio Caverna</span>
          </Link>
          <Link
            href="/flow-produtividade"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <HourglassIcon size={16} />
            <span>Flow Produtividade</span>
          </Link>
          <Link
            href="/metas"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <ClipboardCheck size={16} />
            <span>Metas</span>
          </Link>
          <Link
            href="/sonhos-e-metas"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <TargetIcon size={16} />
            <span>Lei da Atração</span>
          </Link>
          <Link
            href="/financeiro"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <DollarSignIcon size={16} />
            <span>Financeiro</span>
          </Link>
          <Link
            href="/conhecimento"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <Bookmark size={16} />
            <span>Conhecimento</span>
          </Link>
          <Link
            href="/anotacoes"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <QuoteIcon size={16} />
            <span>Anotações</span>
          </Link>
        </div>
      </div>
      <div className="w-full h-[1px] bg-border" />
      <div className="flex flex-col gap-6">
        <span className="flex w-fit px-3 py-[5px] border border-white rounded-full text-[0.5rem] md:text-xs">
          Outros
        </span>
        <div className="flex flex-col gap-8">
          <Link
            href="/comunidade"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <Users2Icon size={16} />
            <span>Comunidade</span>
          </Link>
          <Link
            href="/indique-e-ganhe"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <TrophyIcon size={16} />
            <span>Indique e Ganhe</span>
          </Link>
          {/* <Link
            href="/settings/historico"
            className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-all duration-200"
          >
            <HistoryIcon size={16} />
            <span>Histórico Desafio Caverna</span>
          </Link> */}
        </div>
      </div>
    </SheetContent>
  )
}
