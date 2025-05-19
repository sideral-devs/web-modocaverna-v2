import { api } from '../api'

export interface Food {
  alimento_id: number
  horario_id: number
  nomeAlimento: string
  quantidade: string
  created_at: string
  updated_at: string
}

export interface Supplement {
  suplemento_id: number
  horario_id: number
  nome: string
  comprado: string
}

export interface Meal {
  horario_id: number
  nome_refeicao: string
  hora_refeicao: string
  observacoes: string | null
  dia_semana: number
  alimentos: Food[]
  suplementos: Supplement[]
}

export async function getMeals() {
  const response = await api.get('/refeicoes/find')
  return response.data as Meal[]
}

export async function getMealById(id: number) {
  const response = await api.get(`/refeicoes/show/${id}`)
  return response.data as Meal
}

export async function createMeal(
  data: Omit<Meal, 'horario_id' | 'created_at' | 'updated_at'>,
) {
  const response = await api.post('/refeicoes/store', data)
  return response.data as Meal
}

export async function updateMeal(
  id: number,
  data: Omit<Meal, 'horario_id' | 'created_at' | 'updated_at'>,
) {
  const response = await api.put(`/refeicoes/update/${id}`, data)
  return response.data as Meal
}

export async function deleteMeal(id: number) {
  await api.delete(`/refeicoes/destroy/${id}`)
}
