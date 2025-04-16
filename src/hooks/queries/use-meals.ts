import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMeals, createMeal, updateMeal, deleteMeal } from '@/lib/api/meals'
import type { Meal } from '@/lib/api/meals'

export function useMeals() {
  const queryClient = useQueryClient()

  const {
    data: meals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meals'],
    queryFn: getMeals,
  })

  const { mutateAsync: createMealMutation } = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })

  const { mutateAsync: updateMealMutation } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Meal> }) =>
      updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })

  const { mutateAsync: deleteMealMutation } = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })

  return {
    meals,
    isLoading,
    error,
    createMeal: createMealMutation,
    updateMeal: updateMealMutation,
    deleteMeal: deleteMealMutation,
  }
}
