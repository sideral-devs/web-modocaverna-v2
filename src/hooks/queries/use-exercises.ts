import {
  Exercise,
  Workout,
  createExercise,
  createWorkout,
  deleteExercise,
  deleteWorkout,
  getWorkouts,
  reorderExercises,
  updateExercise,
  updateWorkout,
} from '@/lib/api/exercises'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useWorkouts() {
  const queryClient = useQueryClient()

  const { data: workouts, isLoading } = useQuery<Workout[]>({
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
    mutationFn: updateWorkout,
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
    mutationFn: ({
      workoutIndex,
      dayIndex,
      title,
      exercise,
    }: {
      workoutIndex: number
      dayIndex: number
      title: string
      exercise: Exercise
    }) => createExercise(workoutIndex, dayIndex, title, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const updateExerciseMutation = useMutation({
    mutationFn: ({
      fichaId,
      dayIndex,
      title,
      exercises,
    }: {
      fichaId: number
      dayIndex: number
      title: string
      exercises: Exercise[]
    }) => updateExercise(fichaId, dayIndex, title, exercises),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const deleteExerciseMutation = useMutation({
    mutationFn: ({
      workoutIndex,
      exerciseIndex,
    }: {
      workoutIndex: number
      exerciseIndex: number
    }) => deleteExercise(workoutIndex, exerciseIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  const reorderExercisesMutation = useMutation({
    mutationFn: ({
      workoutIndex,
      exerciseIndices,
    }: {
      workoutIndex: number
      exerciseIndices: number[]
    }) => reorderExercises(workoutIndex, exerciseIndices),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  return {
    workouts,
    isLoading,
    createWorkout: createWorkoutMutation.mutate,
    updateWorkout: updateWorkoutMutation.mutateAsync,
    deleteWorkout: deleteWorkoutMutation.mutate,
    createExercise: createExerciseMutation.mutate,
    updateExercise: updateExerciseMutation.mutate,
    deleteExercise: deleteExerciseMutation.mutate,
    reorderExercises: reorderExercisesMutation.mutate,
  }
}
