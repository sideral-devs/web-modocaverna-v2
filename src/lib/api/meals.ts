import { api } from '../api'

export interface Food {
  alimento_id: number
  horario_id: number
  nome_alimento: string
  quantidade: string
  created_at: string
  updated_at: string
}
export interface FormattedFood {
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

export interface MealResponse {
  horario_id: number
  nome_refeicao: string
  hora_refeicao: string
  observacoes: string | null
  dia_semana: number
  alimentos: Food[]
  suplementos: Supplement[]
}
export interface Meal {
  horario_id: number
  nome_refeicao: string
  hora_refeicao: string
  observacoes: string | null
  dia_semana: number
  alimentos: FormattedFood[]
  suplementos: Supplement[]
}

export async function getMeals() {
  const response = await api.get('/refeicoes/find')

  const formatedData = response.data.map((meal: MealResponse) => {
    const alimentosFormatados =
      meal.alimentos?.map((alimento) => {
        // eslint-disable-next-line camelcase
        const { nome_alimento, ...rest } = alimento
        return {
          ...rest,
          // eslint-disable-next-line camelcase
          nomeAlimento: nome_alimento,
        }
      }) || []

    return {
      ...meal,
      alimentos: alimentosFormatados,
    }
  })

  return formatedData as Meal[]
}

export async function getMealById(id: number) {
  const response = await api.get(`/refeicoes/show/${id}`)
  return response.data as Meal
}

export async function createMeal(
  data: Omit<Meal, 'horario_id' | 'created_at' | 'updated_at'>,
) {
  const alimentosConvertidos = data.alimentos?.map((alimento) => {
    const { nomeAlimento, ...resto } = alimento
    return {
      ...resto,
      nome_alimento: nomeAlimento,
    }
  })

  const payload = {
    ...data,
    alimentos: alimentosConvertidos,
  }

  const response = await api.post('/refeicoes/store', payload)
  return response.data as Meal
}

export async function updateMeal(
  id: number,
  data: Omit<Meal, 'horario_id' | 'created_at' | 'updated_at'>,
) {
  const alimentosConvertidos = data.alimentos?.map((alimento) => {
    const { nomeAlimento, ...resto } = alimento
    return {
      ...resto,
      nome_alimento: nomeAlimento,
    }
  })

  const payload = {
    ...data,
    alimentos: alimentosConvertidos,
  }
  const response = await api.put(`/refeicoes/update/${id}`, payload)
  return response.data as Meal
}

export async function deleteMeal(id: number) {
  await api.delete(`/refeicoes/destroy/${id}`)
}
