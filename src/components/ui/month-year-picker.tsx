'use client'

import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface MonthYearPickerProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export function MonthYearPicker({
  value = new Date(),
  onChange,
  className,
}: MonthYearPickerProps) {
  const [date, setDate] = React.useState(value)
  const [open, setOpen] = React.useState(false)

  // Generate years (current year - 100 to current year + 10)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 111 }, (_, i) => currentYear - 100 + i)

  // Month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(date)
    newDate.setMonth(monthIndex)
    setDate(newDate)
    onChange?.(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(date)
    newDate.setFullYear(Number.parseInt(year))
    setDate(newDate)
    onChange?.(newDate)
  }

  const handlePreviousYear = () => {
    const newDate = new Date(date)
    newDate.setFullYear(date.getFullYear() - 1)
    setDate(newDate)
    onChange?.(newDate)
  }

  const handleNextYear = () => {
    const newDate = new Date(date)
    newDate.setFullYear(date.getFullYear() + 1)
    setDate(newDate)
    onChange?.(newDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          {date ? format(date, 'MMMM yyyy') : 'Select month and year'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handlePreviousYear}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">{date.getFullYear()}</div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleNextYear}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                value={date.getMonth().toString()}
                onValueChange={(value) =>
                  handleMonthChange(Number.parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={date.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={date.getMonth() === index ? 'default' : 'outline'}
                className="h-9"
                onClick={() => {
                  handleMonthChange(index)
                  setOpen(false)
                }}
              >
                {month.substring(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
