'use client'
import { cn } from '@/lib/utils'
import { ChevronLeft, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import { Button } from './ui/button'

export function Header({
  children,
  className,
  containerClassName,
  ...props
}: {
  children: ReactNode
  className?: string
  containerClassName?: string
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <header
      className={cn(
        'flex w-full items-center justify-center border-b px-4 py-6',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex w-full max-w-8xl items-center justify-between',
          containerClassName,
        )}
      >
        {children}
      </div>
    </header>
  )
}

export function HeaderTitle({
  title,
  className,
  spanClassName,
}: {
  title: string
  className?: string
  spanClassName?: string
}) {
  return (
    <div
      className={cn(
        'flex w-fit px-3 py-2 border border-primary text-primary rounded-full',
        className,
      )}
    >
      <span
        className={cn('uppercase text-[10px] font-semibold', spanClassName)}
      >
        {title}
      </span>
    </div>
  )
}

export function HeaderClose({
  to = '',
  pushTo = '',
}: {
  to?: string
  pushTo?: string
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && buttonRef.current) {
        event.preventDefault()
        buttonRef.current.click()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <Link href={pushTo ? `${pushTo}` : `/dashboard?to=${to}`}>
      <Button
        ref={buttonRef}
        variant="outline"
        className="w-12 h-12 rounded-xl border text-primary"
      >
        <XIcon />
      </Button>
    </Link>
  )
}

export function HeaderBack() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className="w-12 h-12 rounded-xl border text-primary"
      onClick={() => router.back()}
    >
      <ChevronLeft />
    </Button>
  )
}
