import { cn } from '@/lib/utils'

export function CategoryText({
  category,
  className = '',
}: {
  category: Post['category']
  className?: string
}) {
  const categoryConfig = {
    Oportunidades: {
      text: 'Oportunidades',
      color: 'text-emerald-400 border-emerald-400',
    },
    Indicações: {
      text: 'Indicação',
      color: 'text-blue-500 border-blue-500',
    },
    Experiência: {
      text: 'Experiência',
      color: 'text-red-500 border-red-500',
    },
  }

  return (
    <span
      className={cn(
        'flex px-3 py-[6px] text-[10px] border bg-black rounded-full uppercase',
        categoryConfig[category]?.color,
        className,
      )}
    >
      {categoryConfig[category]?.text}
    </span>
  )
}
