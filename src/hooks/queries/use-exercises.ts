import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Exercise, Workout } from '@/types/type'
import {
  createExercise,
  createWorkout,
  deleteExercise,
  deleteWorkout,
  getWorkouts,
  reorderExercises,
  updateExercise,
  updateWorkout,
} from '@/lib/api/exercises'

export function useWorkouts() {
  const queryClient = useQueryClient()

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: getWorkouts,
  })

  const createWorkoutMutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const updateWorkoutMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workout> }) => {
      const workoutData = {
        ...data,
        exercises: data.exercises?.map((exercise) => ({
          ...exercise,
          workoutId: id,
        })),
      }
      return updateWorkout(id, workoutData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const deleteWorkoutMutation = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const createExerciseMutation = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const updateExerciseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Exercise> }) =>
      updateExercise(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const deleteExerciseMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const reorderExercisesMutation = useMutation({
    mutationFn: ({
      workoutId,
      exerciseIds,
    }: {
      workoutId: string
      exerciseIds: string[]
    }) => reorderExercises(workoutId, exerciseIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  return {
    workouts,
    isLoading,
    createWorkout: createWorkoutMutation.mutate,
    updateWorkout: updateWorkoutMutation.mutate,
    deleteWorkout: deleteWorkoutMutation.mutate,
    createExercise: createExerciseMutation.mutate,
    updateExercise: updateExerciseMutation.mutate,
    deleteExercise: deleteExerciseMutation.mutate,
    reorderExercises: reorderExercisesMutation.mutate,
  }
}
