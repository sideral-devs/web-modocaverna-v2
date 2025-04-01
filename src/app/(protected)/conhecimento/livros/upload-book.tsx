import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { SiAmazon } from '@icons-pack/react-simple-icons'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

export function UploadBookModalTrigger({ children }: { children: ReactNode }) {
  const { data, isFetching } = useQuery({
    queryKey: ['books-amazon'],
    queryFn: async () => {
      // TODO: Subsitituir pela função real da API
      return await fetchBooks()
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-3/4 bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Selecione os livros</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-4 gap-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <label className="text-xs">Busca Amazon</label>
                <SiAmazon />
              </div>
              <div className="relative w-full">
                <Input placeholder="Insira o título" className="pl-12 w-full" />
                <SearchIcon
                  className="absolute top-1/2 bottom-1/2 -translate-y-1/2 left-3"
                  size={16}
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 ">
                <SelectItem
                  value="wishlist"
                  className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                >
                  Lista de desejos
                </SelectItem>
                <SelectItem
                  value="library"
                  className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                >
                  Minha biblioteca
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col h-full gap-6 overflow-y-auto scrollbar-minimal">
            {isFetching || !data ? (
              <>
                <Skeleton className="w-32 h-3 bg-zinc-700 rounded-sm" />
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex w-full items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-md bg-zinc-800" />
                      <Skeleton className="w-24 h-4 rounded-sm bg-zinc-400" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-zinc-400">
                  {data.length} resultados encontrados
                </p>
                <div className="flex flex-col h-full gap-4">
                  {data.map((item) => (
                    <div
                      key={item.id}
                      className="flex w-full items-center gap-4"
                    >
                      <Checkbox className="w-3 h-3 border-primary" />
                      {item.src ? (
                        <Image
                          width={48}
                          height={48}
                          className="rounded-md"
                          src={`${process.env.NEXT_PUBLIC_PROD_URL}/${item.src}`}
                          alt="Capa do livro"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-zinc-800" />
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter className="bg-background border-t p-4">
          <Button>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function fetchBooks() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    { id: 1, name: 'O Senhor dos Anéis', src: null },
    { id: 2, name: '1984', src: null },
    { id: 3, name: 'Dom Casmurro', src: null },
    { id: 4, name: 'Cem Anos de Solidão', src: null },
    { id: 5, name: 'O Pequeno Príncipe', src: null },
    { id: 6, name: 'A Revolução dos Bichos', src: null },
    { id: 7, name: 'Crime e Castigo', src: null },
    { id: 8, name: 'Orgulho e Preconceito', src: null },
    { id: 9, name: 'O Apanhador no Campo de Centeio', src: null },
    { id: 10, name: 'A Metamorfose', src: null },
    { id: 11, name: 'O Nome do Vento', src: null },
    { id: 12, name: 'As Crônicas de Nárnia', src: null },
    { id: 13, name: 'Moby Dick', src: null },
    { id: 14, name: 'O Hobbit', src: null },
    { id: 15, name: 'O Código Da Vinci', src: null },
    { id: 16, name: 'O Morro dos Ventos Uivantes', src: null },
    { id: 17, name: 'A Guerra dos Tronos', src: null },
    { id: 18, name: 'O Médico e o Monstro', src: null },
    { id: 19, name: 'O Retrato de Dorian Gray', src: null },
    { id: 20, name: 'A Ilha do Tesouro', src: null },
    { id: 21, name: 'Harry Potter e a Pedra Filosofal', src: null },
    { id: 22, name: 'Percy Jackson e o Ladrão de Raios', src: null },
    { id: 23, name: 'O Conde de Monte Cristo', src: null },
    { id: 24, name: 'Os Miseráveis', src: null },
  ]
}
