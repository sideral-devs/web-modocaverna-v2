'use client'
import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronUp, Dot, PlusIcon } from 'lucide-react'

import { GoogleAuth } from '@/components/google-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CreateEventDialogTrigger } from './create-event-dialog'

export default function CalendarHeader() {
  return (
    <Header containerClassName="max-w-8xl">
      <HeaderTitle
        title="AGENDA"
        className="border-cyan-400"
        spanClassName="text-cyan-400"
      />
      <div className="flex items-center gap-3">
        <SelectViewDropdown />
        <CreateEventDialogTrigger>
          <Button className="h-10">
            Novo compromisso <PlusIcon />
          </Button>
        </CreateEventDialogTrigger>
        <GoogleAuth />
      </div>
      <HeaderClose />
    </Header>
  )
}

function SelectViewDropdown() {
  const pathName = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-10 items-center p-4 gap-3 bg-zinc-900 border border-zinc-600 focus:outline-0 rounded-lg text-sm">
        {pathName.includes('today') ? 'Hoje' : 'Semanal'}{' '}
        <ChevronUp size={16} className="text-zinc-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 ml-6 mt-1 max-w-[130px] sm:w-[130px] border border-cyan-700">
        <SelectViewItem
          title="Visão diária"
          href="/agenda/today"
          active={pathName.includes('today')}
        />
        <SelectViewItem
          title="Visão semanal"
          href="/agenda"
          active={!pathName.includes('today')}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function SelectViewItem({
  title,
  active,
  href,
}: {
  title: string
  active: boolean
  href: string
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center p-[6px] ${active ? 'bg-zinc-700' : ''} rounded`}
    >
      <Dot
        size={20}
        fill="#22d3ee"
        strokeWidth={0}
        className={active ? '' : 'opacity-0'}
      />
      <span className="text-xs text-zinc-400">{title}</span>
    </Link>
  )
}
