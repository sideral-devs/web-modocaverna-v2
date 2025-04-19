import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getShapeRegistrations,
  createShapeRegistration,
  updateShapeRegistration,
  deleteShapeRegistration,
} from '@/lib/api/shape'
import { ShapeRegistration } from '@/app/(protected)/exercicios/page'

export function useShape() {
  const queryClient = useQueryClient()

  const {
    data: shapeRegistrations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shape-registrations'],
    queryFn: getShapeRegistrations,
  })

  const createShapeRegistrationMutation = useMutation({
    mutationFn: createShapeRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shape-registrations'] })
    },
  })

  const updateShapeRegistrationMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<ShapeRegistration>
    }) => updateShapeRegistration(id.toString(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shape-registrations'] })
    },
  })

  const deleteShapeRegistrationMutation = useMutation({
    mutationFn: deleteShapeRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shape-registrations'] })
    },
  })

  return {
    shapeRegistrations,
    isLoading,
    error,
    hasRegistration: shapeRegistrations && shapeRegistrations.length > 0,
    createShapeRegistration: createShapeRegistrationMutation.mutate,
    updateShapeRegistration: updateShapeRegistrationMutation.mutate,
    deleteShapeRegistration: deleteShapeRegistrationMutation.mutate,
  }
}
