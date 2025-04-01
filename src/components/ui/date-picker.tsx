'use client'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export function DatePicker({
  date,
  setDate,
  placeholder,
  className,
  disabled = false,
  customFormat,
  ...props
}: {
  date: Date | undefined
  setDate: (arg: Date | undefined) => void
  customFormat?: string
  placeholder: string
  className?: string
  disabled?: boolean
  fromDate?: Date
}) {
  function handleChangeDate(date: Date | undefined) {
    if (!date) return

    setDate(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            'w-fit h-6 px-1 text-[10px] text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          {date ? (
            dayjs(date).format(customFormat || 'DD/MM/YYYY')
          ) : (
            <span>{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[99]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChangeDate}
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
