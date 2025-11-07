import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'

export function useUser() {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/auth/user', {
        headers: { Authorization: 'Bearer ' + token },
      })
      return response.data
    },
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    retry: 1,
    enabled: !!token,
  })
}
