import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { EventsDTO } from '@/types/type'
import { useQuery } from '@tanstack/react-query'

export function useEvents() {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/compromissos/find', {
        headers: { Authorization: 'Bearer ' + token },
      })
      return response.data as EventsDTO
    },
    retry: 1,
    enabled: !!token,
  })
}
