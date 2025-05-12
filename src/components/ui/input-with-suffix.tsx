import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChangeEvent, InputHTMLAttributes } from 'react'

interface InputWithSuffixProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: string
  containerClassName?: string
  suffixClassName?: string
}

export function InputWithSuffix({
  suffix,
  className,
  containerClassName,
  suffixClassName,
  ...props
}: InputWithSuffixProps) {
  return (
    <div className={cn('relative max-w-24', containerClassName)}>
      <Input
        type="number"
        className={cn(
          'pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          className,
        )}
        minLength={1}
        maxLength={3}
        onChange={(e) => {
          const value = e.target.value.slice(0, 3)
          if (props.onChange) {
            const newEvent = { ...e, target: { ...e.target, value } }
            props.onChange(newEvent as ChangeEvent<HTMLInputElement>)
          }
        }}
        {...props}
      />
      {suffix && (
        <div
          className={cn(
            'absolute select-none inset-y-0 right-3 flex items-center text-sm text-white',
            suffixClassName,
          )}
        >
          {suffix}
        </div>
      )}
    </div>
  )
}
