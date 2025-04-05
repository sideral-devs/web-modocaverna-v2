'use client'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { EditEventDialogTrigger } from './edit-event'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

// Utilizar para cores customizadas por categoria
const eventColors = {
  google: {
    bg: '#713f12',
    text: '#facc15',
  },
  default: {
    bg: '#27272a',
    text: '#3b82f6',
  },
  Compromisso: {
    bg: '#27272a',
    text: '#3b82f6',
  },
  Refeição: {
    bg: '#27272a',
    text: '#facc15',
  },
  Treino: {
    bg: '#27272a',
    text: '#ef4444',
  },
  Pessoal: {
    bg: '#27272a',
    text: '#22C45E',
  },
} as { [key: string]: { bg: string; text: string } }

export function CalendarEvent({
  event,
  now,
  mode,
  allDay = false,
}: {
  event: Compromisso
  now: Date | undefined
  mode: 'weekly' | 'daily'
  allDay?: boolean
}) {
  const PIXELS_PER_MINUTE = 112 / 60
  const minHeight = 44

  const DAY_WIDTH = 160

  const eventStart = dayjs(event.comeca, 'YYYY-MM-DD HH:mm')
  const eventEnd = dayjs(event.termina, 'YYYY-MM-DD HH:mm')
  const dayIndex = eventStart.day()

  if (mode === 'weekly') {
    if (
      eventEnd.isBefore(dayjs(now).startOf('week')) ||
      eventStart.isAfter(dayjs(now).endOf('week'))
    ) {
      return null
    }
  } else {
    if (
      eventEnd.isBefore(dayjs(now).startOf('day')) ||
      eventStart.isAfter(dayjs(now).endOf('day'))
    ) {
      return null
    }
  }

  const startMinutes = eventStart.hour() * 60 + eventStart.minute()
  const endMinutes = eventEnd.hour() * 60 + eventEnd.minute()

  const top = startMinutes * PIXELS_PER_MINUTE
  const height = Math.max(
    (endMinutes - startMinutes) * PIXELS_PER_MINUTE,
    minHeight,
  )

  const diff = endMinutes - startMinutes
  const size = diff >= 60 ? 'lg' : diff >= 30 ? 'md' : 'sm'

  const color = eventColors[event.categoria]
  let isAllDay = false
  let dayCount = 0

  if (!eventStart.isSame(eventEnd, 'day')) {
    if (!allDay) {
      return null
    }
    isAllDay = true
    dayCount = eventEnd.diff(eventStart, 'days')
  }

  console.log(event)

  console.log({
    isAllDay,
    DAY_WIDTH,
    dayIndex,
    top: isAllDay ? 64 : `${top}px`,
    height: isAllDay ? 44 : `${height}px`,
    left: isAllDay ? 65 + 4 + DAY_WIDTH * dayIndex : 4,
    ...(() => (isAllDay ? {} : { right: 4 }))(),
  })

  return (
    <EditEventDialogTrigger event={event}>
      <div
        className={cn(
          'flex py-3 px-4 absolute text-white rounded-lg z-10 overflow-y-hidden cursor-pointer',
          size === 'md' ? 'flex-row items-center gap-1' : 'flex-col',
          isAllDay && '2xl:translate-x-4',
        )}
        style={{
          top: isAllDay ? 64 : `${top}px`,
          height: isAllDay ? 44 : `${height}px`,
          // left: isAllDay ? base 65 + 4 + DAY_WIDTH * dayIndex : 4,
          left: mode === 'weekly' ? 65 + 4 + DAY_WIDTH * dayIndex : 69,
          ...(() => (isAllDay ? {} : { right: 4 }))(),
          backgroundColor: color?.bg || eventColors.default.bg,
          ...(() =>
            isAllDay
              ? {
                  width: (() => {
                    const maxLength = (7 - dayIndex) * DAY_WIDTH - 8
                    const minLength = DAY_WIDTH - 8

                    return Math.min(
                      Math.max((dayCount + 1) * DAY_WIDTH - 8, minLength),
                      maxLength,
                    )
                  })(),
                }
              : {})(), // Para não ter essa propriedade para eventos do dia todo
          maxWidth: '100%',
        }}
      >
        {size === 'lg' && !isAllDay && (
          <span
            className={`flex w-fit py-1 px-2 rounded-full bg-white text-zinc-500 text-[0.5rem] uppercase mt-3`}
          >
            {event.categoria}
          </span>
        )}
        <p
          className={cn(
            'text-xs line-clamp-2',
            event.checked && 'line-through opacity-75',
          )}
          style={{
            marginTop: isAllDay
              ? 0
              : size === 'lg'
                ? 12
                : size === 'sm'
                  ? 4
                  : 0,
          }}
        >
          {event.titulo}
        </p>
        {!isAllDay && (
          <span
            style={{
              fontSize: size === 'lg' ? 12 : 10,
              marginLeft: size === 'md' ? 'auto' : 0,
              marginTop: size === 'lg' ? 8 : 0,
              color: color?.text || eventColors.default.text,
            }}
          >
            {`${eventStart.hour()}h${eventStart.minute().toString().padEnd(2, '0')}`}
            {' - '}
            {`${eventEnd.hour()}h${eventEnd.minute().toString().padEnd(2, '0')}`}
          </span>
        )}
        {event.categoria.toLowerCase() !== 'google' && (
          <div
            className="absolute left-1 top-2 bottom-2 w-[3px] rounded-full"
            style={{
              backgroundColor: color?.text || eventColors.default.text,
            }}
          />
        )}
      </div>
    </EditEventDialogTrigger>
  )
}
