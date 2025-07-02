'use client'
import { ExpenseChart } from '@/components/charts/expense'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import dayjs from 'dayjs'
import { useState } from 'react'

export default function ExpenseCard() {
  const [year, setYear] = useState<null | string>(String(dayjs().year()))

  return (
    <Card className="flex flex-col w-full h-96 p-5 gap-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex py-2 px-3 border rounded-full text-xs">
            Despesas e receitas
          </span>
          {year && (
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-fit text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(dayjs().year())}>
                  {dayjs().year()}
                </SelectItem>
                <SelectItem value={String(dayjs().year() - 1)}>
                  {dayjs().year() - 1}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-[0.1rem]" />
            <span className="text-xs sm:text-sm">Despesas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-[0.1rem]" />
            <span className="text-xs sm:text-sm">Receita</span>
          </div>
        </div>
      </div>
      <ExpenseChart
        year={Number(year)}
        className="flex-1 max-w-full max-h-full overflow-hidden"
      />
    </Card>
  )
}
