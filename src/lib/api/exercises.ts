import { api } from '../api'

export interface Exercise {
  id: string
  name: string
  series: number
  repetitions: number
  currentWeight: number
  imageUrl: string
  workoutId: string
  created_at?: string
  updated_at?: string
}

export interface ExerciseDTO {
  id: string
  nome: string
  series: number
  repeticoes: number
  carga_atual: number
  imagem_url: string
  treino_id: string
  created_at?: string
  updated_at?: string
}

export interface Workout {
  id: number
  day: string
  startTime: string
  endTime: string
  type: string
  exercises: Exercise[]
  created_at?: string
  updated_at?: string
}

export interface WorkoutDTO {
  treino_id: number
  chave: string // Day of the week (1-7)
  inicio: string
  fim: string
  metadata: string[]
  created_at?: string
  updated_at?: string
}

const dayMap: Record<string, string> = {
  '1': 'Dom',
  '2': 'Seg',
  '3': 'Ter',
  '4': 'Qua',
  '5': 'Qui',
  '6': 'Sex',
  '7': 'Sab',
}

function mapExerciseFromDTO(dto: ExerciseDTO): Exercise {
  return {
    id: dto.id,
    name: dto.nome,
    series: dto.series,
    repetitions: dto.repeticoes,
    currentWeight: dto.carga_atual,
    imageUrl: dto.imagem_url,
    workoutId: dto.treino_id,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  }
}

function mapWorkoutFromDTO(dto: WorkoutDTO): Workout {
  return {
    id: dto.treino_id,
    day: dayMap[dto.chave] || dto.chave,
    startTime: dto.inicio,
    endTime: dto.fim,
    type: dto.metadata[0] || '',
    exercises: [], // We'll need to fetch exercises separately
    created_at: dto.created_at,
    updated_at: dto.updated_at,
  }
}

function mapExerciseToDTO(exercise: Partial<Exercise>): Partial<ExerciseDTO> {
  return {
    ...(exercise.name && { nome: exercise.name }),
    ...(exercise.series && { series: exercise.series }),
    ...(exercise.repetitions && { repeticoes: exercise.repetitions }),
    ...(exercise.currentWeight && { carga_atual: exercise.currentWeight }),
    ...(exercise.imageUrl && { imagem_url: exercise.imageUrl }),
    ...(exercise.workoutId && { treino_id: exercise.workoutId }),
  }
}

function mapWorkoutToDTO(workout: Partial<Workout>): Partial<WorkoutDTO> {
  const dayKey = Object.entries(dayMap).find(
    ([, value]) => value === workout.day,
  )?.[0]

  return {
    ...(workout.day && { chave: dayKey || workout.day }),
    ...(workout.startTime && { inicio: workout.startTime }),
    ...(workout.endTime && { fim: workout.endTime }),
    ...(workout.type && { metadata: [workout.type] }),
  }
}

// Workouts (Treinos) endpoints
export async function getWorkouts() {
  const response = await api.get('/treinos/find')
  return response.data.map(mapWorkoutFromDTO) as Workout[]
}

export async function getWorkoutById(id: number) {
  const response = await api.get(`/treinos/show/${id}`)
  return mapWorkoutFromDTO(response.data) as Workout
}

export async function createWorkout(
  data: Omit<Workout, 'id' | 'exercises' | 'created_at' | 'updated_at'>,
) {
  const dto = mapWorkoutToDTO(data)
  const response = await api.post('/treinos/store', dto)
  return mapWorkoutFromDTO(response.data) as Workout
}

export async function updateWorkout(id: number, data: Partial<Workout>) {
  const dto = mapWorkoutToDTO(data)
  const response = await api.put(`/treinos/update/${id}`, dto)
  return mapWorkoutFromDTO(response.data) as Workout
}

export async function deleteWorkout(id: number) {
  await api.delete(`/treinos/destroy/${id}`)
}

// Exercises (Fichas de Treinos) endpoints
export async function getExercises() {
  const response = await api.get('/fichas-de-treinos/find')
  return response.data.map(mapExerciseFromDTO) as Exercise[]
}

export async function getExerciseById(id: string) {
  const response = await api.get(`/fichas-de-treinos/show/${id}`)
  return mapExerciseFromDTO(response.data) as Exercise
}

export async function createExercise(
  data: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>,
) {
  const dto = mapExerciseToDTO(data)
  const response = await api.post('/fichas-de-treinos/store', dto)
  return mapExerciseFromDTO(response.data) as Exercise
}

export async function updateExercise(id: string, data: Partial<Exercise>) {
  const dto = mapExerciseToDTO(data)
  const response = await api.put(`/fichas-de-treinos/update/${id}`, dto)
  return mapExerciseFromDTO(response.data) as Exercise
}

export async function deleteExercise(id: string) {
  await api.delete(`/fichas-de-treinos/destroy/${id}`)
}

export async function reorderExercises(
  workoutId: string,
  exerciseIds: string[],
) {
  const response = await api.put(`/fichas-de-treinos/reorder/${workoutId}`, {
    exerciseIds,
  })
  return response.data as Workout
}
