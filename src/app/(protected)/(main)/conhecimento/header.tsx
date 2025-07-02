'use client'
import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BookIcon, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const titles = {
  videos: 'Vídeos',
  livros: 'Livros',
  cursos: 'Cursos',
}

export function KnowledgeHeader() {
  const pathName = usePathname()

  const currentTitle =
    titles[pathName.split('conhecimento/')[1] as 'videos' | 'livros' | 'cursos']

  return (
    <Header>
      <HeaderTitle
        title="Conhecimento"
        spanClassName="text-white"
        className="border-zinc-500"
      />
      <Popover>
        <PopoverTrigger className="flex items-center px-4 py-[10px] gap-[10px] bg-zinc-700 rounded-full text-xs">
          <BookIcon fill="var(--primary)" className="text-zinc-700" size={16} />
          {currentTitle}
          <ChevronDown size={16} />
        </PopoverTrigger>
        <PopoverContent className="p-1 bg-zinc-800 rounded-lg text-xs">
          {pagePaths
            .filter((page) => page.title !== currentTitle)
            .map((item, i) => (
              <Link
                href={item.path}
                key={`conhecimento-${i}`}
                className="w-full"
              >
                <div className="w-full px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300">
                  {item.title}
                </div>
              </Link>
            ))}
        </PopoverContent>
      </Popover>
      <HeaderClose to="ordem-no-caos" />
    </Header>
  )
}

const pagePaths = [
  {
    path: '/conhecimento/videos',
    title: 'Vídeos',
  },
  {
    path: '/conhecimento/livros',
    title: 'Livros',
  },
  {
    path: '/conhecimento/cursos',
    title: 'Cursos',
  },
]
