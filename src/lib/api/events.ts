import { api } from '../api'

export async function fetchEvents() {
  const response = await api.get('/compromissos/find')
  return response.data
}
