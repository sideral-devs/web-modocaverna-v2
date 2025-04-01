import { StickyNote } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6">
      <StickyNote className="text-primary" size={32} />
      <h1 className="max-w-lg text-lg md:text-2xl text-center font-semibold">
        Para visualizar, selecione uma anotação ao lado
      </h1>
    </div>
  )
}
