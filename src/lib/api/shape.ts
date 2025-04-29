import { api } from '@/lib/api'

export interface ShapeRegistration {
  membros_superiores: {
    ombro: number
    peito: number
    biceps_direito: number
    biceps_esquerdo: number
    triceps_esquerdo: number
    triceps_direito: number
  }
  membros_inferiores: {
    gluteos: number
    quadril: number
    quadriceps_direito: number
    quadriceps_esquerdo: number
    panturrilha_esquerda: number
    panturrilha_direita: number
  }
  satisfeito_fisico: number
  classificacao: string
  imc: number
  altura: number
  peso: number
  texto_meta: string
  nivel_satisfacao: string
  objetivo: string
  peso_meta: number
  fotos: string[]
}

export interface CreateShapeRegistrationRequest extends ShapeRegistration {}

// Shape Registration endpoints
export const getShapeRegistrations = async () => {
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
