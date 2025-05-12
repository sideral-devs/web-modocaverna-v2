import { api } from '@/lib/api'

export interface ShapeRegistration {
  id: number
  shape_id: number
  imc: number
  altura: number
  peso: number
  is_skipped: boolean | number
  texto_meta: string | null
  classificacao: string
  satisfeito_fisico: number
  membros_superiores: {
    ombro: number | null
    peito: number | null
    biceps_direito: number | null
    biceps_esquerdo: number | null
    triceps_direito: number | null
    triceps_esquerdo: number | null
  }
  membros_inferiores: {
    gluteos: number | null
    quadril: number | null
    quadriceps_direito: number | null
    quadriceps_esquerdo: number | null
    panturrilha_direita: number | null
    panturrilha_esquerda: number | null
  }
  fotos: string[] | null
  created_at: string
  updated_at: string
  nivel_satisfacao: string
  objetivo: string
  peso_meta: number
}

export type CreateShapeRegistrationRequest = Omit<
  ShapeRegistration,
  'id' | 'shape_id' | 'created_at' | 'updated_at'
>

// Shape Registration endpoints
export const getShapeRegistrations = async (): Promise<ShapeRegistration[]> => {
  const response = await api.get('/registro-de-shape/find')
  return response.data
}

export const getShapeRegistrationById = async (id: number) => {
  const response = await api.get(`/registro-de-shape/show/${id}`)
  return response.data
}

export const createShapeRegistration = async (
  data: CreateShapeRegistrationRequest,
) => {
  const response = await api.post('/registro-de-shape/store', data)
  return response.data
}

export const updateShapeRegistration = async (
  id: number,
  data: Partial<ShapeRegistration>,
) => {
  const response = await api.put(`/registro-de-shape/update/${id}`, data)
  return response.data
}

export const deleteShapeRegistration = async (id: number) => {
  const response = await api.delete(`/registro-de-shape/destroy/${id}`)
  return response.data
}

export const skipShapeRegistration = async (id: number, isSkipped: boolean) => {
  const response = await api.post(`/registro-de-shape/skip/${id}`, {
    is_skipped: isSkipped,
  })
  return response.data
}
