import type { Meal } from '@/lib/api/meals'
import { createMeal, deleteMeal, getMeals, updateMeal } from '@/lib/api/meals'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useMeals() {
  const queryClient = useQueryClient()

  console.log('useMeals')

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
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Omit<Meal, 'created_at' | 'updated_at' | 'horario_id'>
    }) => updateMeal(id, data),
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
