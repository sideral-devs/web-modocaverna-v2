import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { cn } from '@/lib/utils'
import { ReactNode, useState } from 'react'

export function EditRepetitionDialogTrigger({
  children,
}: {
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [repeatDays, setRepeatDays] = useState(1)
  const [selectedRange, setSelectedRange] = useState<string>('dia')
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])
  const [endRange, setEndRange] = useState<'never' | 'date' | 'occurrences'>(
    'never',
  )
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [occurrences, setOccurrences] = useState(30)

  function handleSelectWeekday(val: string) {
    if (selectedWeekdays.includes(val)) {
      setSelectedWeekdays(selectedWeekdays.filter((weekday) => weekday !== val))
    } else {
      setSelectedWeekdays([...selectedWeekdays, val])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-sm px-4 py-5 bg-zinc-800 border-cyan-700 gap-8"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle>Recorrência personalizada</DialogTitle>
        <div className="flex items-center justify-between gap-8">
          <span className="text-xs text-zinc-400">Repetir a cada</span>
          <div className="flex items-center gap-2">
            <Input
              value={repeatDays}
              onChange={(e) => setRepeatDays(Number(e.target.value))}
              type="number"
              className="w-14 bg-zinc-700"
            />
            <Select
              defaultValue={selectedRange}
              onValueChange={(val) => setSelectedRange(val)}
            >
              <SelectTrigger className="w-32 h-11 rounded-lg bg-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia" hideIcon>
                  <div className="flex flex-row items-center gap-2">dia</div>
                </SelectItem>
                <SelectItem value="semana" hideIcon>
                  <div className="flex flex-row items-center gap-2">semana</div>
                </SelectItem>
                <SelectItem value="mês" hideIcon>
                  <div className="flex flex-row items-center gap-2">mês</div>
                </SelectItem>
                <SelectItem value="ano" hideIcon>
                  <div className="flex flex-row items-center gap-2">ano</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedRange === 'semana' && (
          <div className="flex flex-col gap-6">
            <span className="text-xs text-zinc-400">Repetir</span>
            <div className="flex items-center gap-2.5">
              {weekdays.map((weekday, index) => (
                <div
                  key={weekday.value + index}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full bg-zinc-700 text-sm cursor-pointer',
                    selectedWeekdays.includes(weekday.value) &&
                      'bg-cyan-800 text-cyan-400',
                  )}
                  onClick={() => handleSelectWeekday(weekday.value)}
                >
                  {weekday.label}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-6">
          <span className="text-xs text-zinc-400">Termina em</span>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex w-5 h-5 items-center justify-center rounded-full border cursor-pointer text-sm',
                endRange === 'never' && 'border-cyan-500',
              )}
              onClick={() => setEndRange('never')}
            >
              <div
                className={cn(
                  'w-3 h-3 bg-cyan-500 rounded-full opacity-0',
                  endRange === 'never' && 'opacity-100',
                )}
              />
            </div>
            Nunca
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex w-5 h-5 items-center justify-center rounded-full border cursor-pointer text-sm',
                  endRange === 'date' && 'border-cyan-500',
                )}
                onClick={() => setEndRange('date')}
              >
                <div
                  className={cn(
                    'w-3 h-3 bg-cyan-500 rounded-full opacity-0',
                    endRange === 'date' && 'opacity-100',
                  )}
                />
              </div>
              Em
            </div>
            <DatePicker
              date={endDate}
              setDate={(arg: Date | undefined) => {
                setEndRange('date')
                return arg ? setEndDate(arg) : null
              }}
              placeholder="Insira uma data"
              customFormat="DD [de] MMM YYYY"
              className="text-sm text-white bg-zinc-700 w-40 h-11 rounded-lg"
              fromDate={new Date()}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex w-5 h-5 items-center justify-center rounded-full border cursor-pointer text-sm',
                  endRange === 'occurrences' && 'border-cyan-500',
                )}
                onClick={() => setEndRange('occurrences')}
              >
                <div
                  className={cn(
                    'w-3 h-3 bg-cyan-500 rounded-full opacity-0',
                    endRange === 'occurrences' && 'opacity-100',
                  )}
                />
              </div>
              Após
            </div>
            <div className="relative">
              <Input
                defaultValue={occurrences}
                onChange={(e) => setOccurrences(Number(e.target.value))}
                type="number"
                className="w-40 bg-zinc-700 px-6"
                maxLength={2}
              />
              <span className="absolute top-1/2 -translate-y-1/2 left-12 text-sm">
                ocorrências
              </span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex p-3">
          <Button size="sm" className="self-end">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const weekdays = [
  { value: 'domingo', label: 'D' },
  { value: 'segunda', label: 'S' },
  { value: 'terça', label: 'T' },
  { value: 'quarta', label: 'Q' },
  { value: 'quinta', label: 'Q' },
  { value: 'sexta', label: 'S' },
  { value: 'sábado', label: 'S' },
]
