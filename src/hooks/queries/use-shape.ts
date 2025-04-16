import { useQuery } from '@tanstack/react-query'
import { getShapeRegistrations } from '@/lib/api/shape'

export function useShape() {
  const {
    data: shapeRegistrations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shape-registrations'],
    queryFn: getShapeRegistrations,
  })

  const hasRegistration = Boolean(shapeRegistrations?.length)

  return {
    shapeRegistrations,
    isLoading,
    error,
    hasRegistration,
  }
}
