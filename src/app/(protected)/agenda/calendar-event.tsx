'use client'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { parse } from 'date-fns'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { EditRitualDialog } from '../dashboard/cards/ritual-modal/edit-ritual-dialog'
import { EditEventDialogTrigger } from './edit-event'
import { GoogleEditEventDialogTrigger } from './google-edit-event'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

// Utilizar para cores customizadas por categoria
const eventColors = {
  google: {
    text: '#facc15',
  },
  default: {
    text: '#3b82f6',
  },
  Compromisso: {
    text: '#3b82f6',
  },
  Refeição: {
    text: '#facc15',
  },
  Treino: {
    text: '#ef4444',
  },
  Pessoal: {
    text: '#22c55e',
  },
  Ritual: {
    text: '#facc15',
  },
} as { [key: string]: { text: string } }

function BaseEvent({
  start,
  end,
  title,
  category,
  checked,
  mode = 'weekly',
}: {
  start: string
  end: string
  title: string
  category: string
  allDay?: boolean
  checked: boolean
  mode?: 'weekly' | 'daily'
}) {
  const PIXELS_PER_MINUTE = 112 / 60
  const DAY_WIDTH = 160

  const minHeight = 44

  const eventStart = dayjs(start, 'YYYY-MM-DD HH:mm')
  const eventEnd = dayjs(end, 'YYYY-MM-DD HH:mm')
  const dayIndex = eventStart.day()

  const startMinutes = eventStart.hour() * 60 + eventStart.minute()
  const endMinutes = eventEnd.hour() * 60 + eventEnd.minute()

  const top = startMinutes * PIXELS_PER_MINUTE
  const height = Math.max(
    (endMinutes - startMinutes) * PIXELS_PER_MINUTE,
    minHeight,
  )

  let isAllDay = false
  let dayCount = 0

  if (!eventStart.isSame(eventEnd, 'day')) {
    isAllDay = true
    dayCount = eventEnd.diff(eventStart, 'days')

    if (category === 'google') {
      dayCount -= 1 // Os dias são calculados de forma diferente pelo Google (1 a mais)
    }
  }

  if (isAllDay) {
    return (
      <div
        className={cn(
          'flex p-4 absolute  text-white rounded-lg z-10 overflow-y-hidden cursor-pointer',
          'shadow-md overflow-hidden pointer-events-auto',
          category === 'google' || category === 'Ritual'
            ? 'bg-yellow-900'
            : 'bg-zinc-800',
        )}
        style={{
          top: 4,
          width: (() => {
            if (mode === 'daily') return '100%'

            const maxLength = (7 - dayIndex) * DAY_WIDTH - 8
            const minLength = DAY_WIDTH - 8

            return Math.min(
              Math.max((dayCount + 1) * DAY_WIDTH - 8, minLength),
              maxLength,
            )
          })(),
        }}
      >
        <p className={cn('line-clamp-2 text-xs')}>{title}</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-start py-3 px-4 gap-2 absolute text-white rounded-lg z-10 overflow-y-hidden cursor-pointer',
        'border-l-4 shadow-md overflow-hidden pointer-events-auto',
        category === 'google' || category === 'Ritual'
          ? checked
            ? 'bg-yellow-950'
            : 'bg-yellow-900'
          : 'bg-zinc-800',
      )}
      style={{
        borderColor: eventColors[category].text,
        top: `${top}px`,
        height: `${height}px`,
        left: 4,
        right: 4,
        maxWidth: '100%',
      }}
    >
      <span
        className={`${height < 80 ? 'text-[10px]' : 'text-xs'} font-medium`}
        style={{
          color: eventColors[category].text,
        }}
      >
        {`${eventStart.format('HH:mm')} - ${eventEnd.format('HH:mm')}`}
      </span>
      <p
        className={cn(
          'line-clamp-2',
          checked && 'line-through opacity-75',
          height < 80 ? 'text-[10px]' : 'text-xs',
        )}
      >
        {title}
      </p>
    </div>
  )
}

export function CalendarEvent({
  event,
  mode,
  allDay = false,
}: {
  event: Compromisso
  now: Date | undefined
  mode: 'weekly' | 'daily'
  allDay?: boolean
}) {
  return (
    <EditEventDialogTrigger event={event}>
      <button className="block">
        <BaseEvent
          start={event.comeca}
          end={event.termina}
          title={event.titulo}
          category={event.categoria}
          checked={event.checked}
          allDay={allDay}
          mode={mode}
        />
      </button>
    </EditEventDialogTrigger>
  )
}

export function GoogleEvent({
  event,
  mode,
  allDay = false,
}: {
  event: GoogleEvent & { compromisso_id: string; categoria: string }
  now: Date | undefined
  mode: 'weekly' | 'daily'
  allDay?: boolean
}) {
  return (
    <GoogleEditEventDialogTrigger event={event}>
      <button className="block">
        <BaseEvent
          start={event.comeca}
          end={event.termina}
          title={event.titulo}
          category={event.categoria}
          checked={event.checked}
          allDay={allDay}
          mode={mode}
        />
      </button>
    </GoogleEditEventDialogTrigger>
  )
}

export function RitualEvent({
  title,
  timeStart,
  timeEnd,
  mode,
  type = 'matinal',
}: {
  title: string
  timeStart: string
  timeEnd: string
  now: Date | undefined
  mode: 'weekly' | 'daily'
  type?: 'matinal' | 'noturno'
}) {
  const start = dayjs(parse(timeStart, 'HH:mm', new Date())).format(
    'YYYY-MM-DD HH:mm',
  )
  const end = dayjs(parse(timeEnd, 'HH:mm', new Date())).format(
    'YYYY-MM-DD HH:mm',
  )

  return (
    <Dialog>
      <DialogTrigger>
        <BaseEvent
          start={start}
          end={end}
          title={title}
          category="Ritual"
          checked={false}
          allDay={false}
          mode={mode}
        />
      </DialogTrigger>
      <EditRitualDialog defaultTab={type} />
    </Dialog>
  )
}
