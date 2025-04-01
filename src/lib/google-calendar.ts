import { google } from 'googleapis'

interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
}

export function convertGoogleEvents(events: GoogleCalendarEvent[]) {
  return events.map((event) => ({
    compromisso_id: event.id,
    titulo: event.summary,
    comeca: event.start.dateTime,
    termina: event.end.dateTime,
    categoria: 'Compromisso',
  }))
}

export async function initGoogleCalendar(token: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  return google.calendar({ version: 'v3', auth })
}
