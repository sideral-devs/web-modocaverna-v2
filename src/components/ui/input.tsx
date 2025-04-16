import * as React from 'react'

import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { containerClassName?: string }
>(({ className, type, containerClassName, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const eyeProps = {
    onClick: () => setShowPassword((prev) => !prev),
    size: 16,
    className:
      'absolute right-4 top-1/2 bottom-1/2 -translate-y-1/2 text-muted-foreground peer-autofill:text-secondary',
  }

  return (
    <div className={cn('relative', containerClassName)}>
      <input
        type={showPassword ? 'text' : type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
      {type === 'password' ? (
        <>
          {showPassword ? (
            <EyeIcon {...eyeProps} />
          ) : (
            <EyeOffIcon {...eyeProps} />
          )}
        </>
      ) : (
        ''
      )}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
