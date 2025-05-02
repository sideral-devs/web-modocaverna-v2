import {
  ShapeRegistration,
  createShapeRegistration,
  deleteShapeRegistration,
  getShapeRegistrationById,
  getShapeRegistrations,
  updateShapeRegistration,
  skipShapeRegistration,
} from '@/lib/api/shape'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useShape() {
  const queryClient = useQueryClient()

  const {
    data: shapeRegistrations,
    isLoading,
    error,
  } = useQuery<ShapeRegistration[]>({
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
    }) => updateShapeRegistration(id, data),
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

  const skipShapeRegistrationMutation = useMutation({
    mutationFn: ({ id, isSkipped }: { id: number; isSkipped: boolean }) =>
      skipShapeRegistration(id, isSkipped),
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
    skipShapeRegistration: skipShapeRegistrationMutation.mutate,
  }
}
