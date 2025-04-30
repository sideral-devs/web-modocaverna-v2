import { api } from '@/lib/api'

export interface Exercise {
  nome: string
  series: string
  repeticoes: string
  carga: string
  indice: number
}

export interface ExerciseDTO {
  nome: string
  series: string
  repeticoes: string
  carga: string
  indice: number
}

export interface Workout {
  ficha_id: number
  titulo: string
  indice: number
  horario: string
  exercicios: Exercise[]
}

export interface WorkoutDTO {
  treino_id: number
  chave: string // Day of the week (1-7)
  horario: string
  metadata: string[]
}

export interface CreateWorkoutRequest {
  titulo: string
  indice: number
  horario: string
  exercicios: Exercise[]
}

export interface UpdateWorkoutRequest extends CreateWorkoutRequest {
  ficha_id: number
}

export interface CreateExerciseRequest {
  titulo: string
  indice: number
  exercicios: Array<{
    nome: string
    series: string
    repeticoes: string
    carga: string
    indice: number
  }>
}

export interface UpdateExerciseRequest extends CreateExerciseRequest {
  id: number
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
    nome: dto.nome,
    series: dto.series.toString(),
    repeticoes: dto.repeticoes.toString(),
    carga: dto.carga.toString(),
    indice: 0,
  }
}

function mapWorkoutFromDTO(dto: WorkoutDTO): Workout {
  return {
    titulo: dayMap[dto.chave] || dto.chave,
    indice: Number(dto.chave),
    ficha_id: dto.treino_id,
    exercicios: [],
    horario: dto.horario,
  }
}

// Workouts (Treinos) endpoints
export const getWorkouts = async () => {
  const response = await api.get('/fichas-de-treinos/find')
  return response.data
}

export async function getWorkoutById(id: number) {
  const response = await api.get(`/fichas-de-treinos/show/${id}`)
  return mapWorkoutFromDTO(response.data) as Workout
}

export const createWorkout = async (data: CreateWorkoutRequest) => {
  const response = await api.post('/fichas-de-treinos/store', data)
  return response.data
}

export const updateWorkout = async (data: UpdateWorkoutRequest) => {
  const response = await api.put(
    `/fichas-de-treinos/update/${data.ficha_id}`,
    data,
  )
  return response.data
}

export const deleteWorkout = async (workoutId: number) => {
  const response = await api.delete(`/fichas-de-treinos/destroy/${workoutId}`)
  return response.data
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

export const createExercise = async (
  workoutIndex: number,
  dayIndex: number,
  title: string,
  exercise: Exercise,
) => {
  const response = await api.post('/fichas-de-treinos/store', {
    titulo: title,
    indice: dayIndex,
    exercicios: [
      {
        nome: exercise.nome,
        series: exercise.series,
        repeticoes: exercise.repeticoes,
        carga: exercise.carga,
        indice: exercise.indice,
      },
    ],
  })
  return response.data
}

export const updateExercise = async (
  fichaId: number,
  dayIndex: number,
  title: string,
  exercises: Exercise[],
) => {
  const response = await api.put(`/fichas-de-treinos/${fichaId}`, {
    ficha_id: fichaId,
    titulo: title,
    indice: dayIndex,
    exercicios: exercises,
  })
  return response.data
}

export const deleteExercise = async (
  workoutIndex: number,
  exerciseIndex: number,
) => {
  const response = await api.delete(
    `/fichas-de-treinos/${workoutIndex}/exercicios/${exerciseIndex}`,
  )
  return response.data
}

export const reorderExercises = async (
  workoutIndex: number,
  exerciseIndices: number[],
) => {
  const response = await api.put(`/fichas-de-treinos/${workoutIndex}/reorder`, {
    exerciseIndices,
  })
  return response.data
}
