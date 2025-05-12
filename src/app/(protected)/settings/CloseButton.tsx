'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HTMLAttributes, useEffect } from 'react'

export function CloseButton({
  className,
  escapeTo,
}: HTMLAttributes<HTMLDivElement> & { escapeTo?: string }) {
  const router = useRouter()

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.push(escapeTo || '/')
      }
    }

    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Link href={escapeTo || '/'}>
        <Button
          variant="outline"
          className="w-10 h-10 rounded-full text-zinc-500"
        >
          <XIcon />
        </Button>
      </Link>
      <span className="text-xs">ESC</span>
    </div>
  )
}
