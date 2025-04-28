'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { env } from '@/lib/env'
import { ChevronDown, Ellipsis } from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useState, useRef } from 'react'
export function KnowledgeDocument({
  id,
  title,
  author,
  userAcess,
  onEdit,
  onRemove,
  editModal,
  type,
  status,
  src,
  acessEbookLink,
  options,
  onMoveTo,
}: {
  id: number
  title: string
  author: string
  userAcess: boolean
  type: 'livro' | 'curso' | 'video' | 'ebook'
  status: string
  onEdit: () => void
  onRemove: (id: number) => void
  editModal: ReactNode
  src?: string | null
  acessEbookLink?: string | null
  options: { value: string; label: string; color: string }[]
  onMoveTo: (id: number, value: string) => void
}) {
  const [imageError, setImageError] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const optionValue = options.find((o) => o.value === status)

  const handleEdit = () => {
    onEdit()
  }

  return (
    <div className="flex flex-col w-full h-[378px] items-center px-4 pt-7 pb-3 pr-3 gap-6 border rounded-lg relative">
      <div className="w-40 h-52 relative rounded-lg transition-all duration-300 group">
        {src && !imageError && type === 'ebook' ? (
          <a
            href={acessEbookLink || undefined}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={
                src.startsWith('https') ? src : env.NEXT_PUBLIC_PROD_URL + src
              }
              alt="Capa do livro"
              className="object-cover object-center hover:-translate-y-5 transition-all duration-300 cursor-pointer"
              fill
              onError={() => setImageError(true)}
            />
          </a>
        ) : src && !imageError ? (
          <Image
            src={src.startsWith('https') ? src : env.NEXT_PUBLIC_PROD_URL + src}
            alt="Capa do livro"
            className="object-cover object-center"
            fill
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={'/images/empty-book1.png'}
            alt="Livro sem capa"
            className="object-cover object-center"
            fill
          />
        )}
      </div>
      <div className="flex flex-col w-full flex-1 gap-1">
        <p className="truncate">{title}</p>
        <span className="text-xs text-zinc-400 truncate">{author} </span>
      </div>
      {!userAcess && type === 'ebook' ? (
        <a
          href={acessEbookLink || undefined}
          className="w-full"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            onClick={() => onMoveTo(id, 'pendente')}
            className="h-10 w-full ml-auto text-sm"
          >
            Acessar
          </Button>
        </a>
      ) : status === 'desejos' ? (
        <Button
          onClick={() => onMoveTo(id, 'pendente')}
          className="h-10 ml-auto text-xs"
          disabled={!userAcess}
        >
          {(() => {
            switch (type) {
              case 'livro':
                return 'Adicionar à biblioteca'
              case 'ebook':
                return 'Adicionar à biblioteca'
              case 'curso':
                return 'Adicionar aos Meus Cursos'
              case 'video':
                return 'Adicionar à Videoteca'
              default:
                return null
            }
          })()}
        </Button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className={`h-10 ml-auto text-xs ${optionValue?.color}`}
              disabled={!userAcess}
            >
              {optionValue?.label} <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1 bg-zinc-800 rounded-lg text-xs">
            {options.map((option) => (
              <button
                onClick={() => {
                  onMoveTo(id, option.value)
                  setOpen(false)
                }}
                key={option.value}
                className={`flex w-full justify-start px-4 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300`}
              >
                {option.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}

      <Popover>
        {userAcess && type !== 'ebook' && (
          <PopoverTrigger asChild>
            <button
              ref={triggerRef}
              className="absolute top-2 right-2 cursor-pointer"
            >
              <Ellipsis />
            </button>
          </PopoverTrigger>
        )}
        <PopoverContent
          align="start"
          className="w-52 p-1 bg-zinc-800 rounded-lg text-xs flex flex-col gap-1"
        >
          <button
            onClick={handleEdit}
            className="flex w-full gap-2 justify-start px-4 bg-zinc-700 py-2 rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
          >
            <Image
              src={'/icons/pencil.svg'}
              alt="Pencil"
              width={12}
              height={13.5}
            />
            Editar
          </button>
          {editModal}

          <button
            onClick={() => onRemove(id)}
            className="flex w-full gap-2 justify-start px-4 py-2 rounded bg-zinc-700 text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
          >
            <Image
              src={'/icons/trash.svg'}
              alt="Pencil"
              width={12}
              height={13.5}
            />
            Apagar
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
