import { api } from '../api'

interface MembrosSuperiores {
  ombro: number
  peito: number
  biceps_direito: number
  biceps_esquerdo: number
  triceps_esquerdo: number
  triceps_direito: number
}

interface MembrosInferiores {
  gluteos: number
  quadril: number
  quadriceps_direito: number
  quadriceps_esquerdo: number
  panturrilha_esquerda: number
  panturrilha_direita: number
}

interface ShapeRegistration {
  membros_superiores: MembrosSuperiores
  membros_inferiores: MembrosInferiores
  satisfeito_fisico: number // 0 or 1
  classificacao: string
  imc: number
  altura: number
  peso: number
  texto_meta: string
}

export async function getShapeRegistrations() {
  const response = await api.get('/registro-de-shape/find')
  return response.data
}

export async function getShapeRegistrationById(id: string) {
  const response = await api.get(`/registro-de-shape/show/${id}`)
  return response.data
}

export async function createShapeRegistration(data: ShapeRegistration) {
  const response = await api.post('/registro-de-shape/store', data)
  return response.data
}

export async function updateShapeRegistration(
  id: string,
  data: Partial<ShapeRegistration>,
) {
  const response = await api.put(`/registro-de-shape/update/${id}`, data)
  return response.data
}

export async function deleteShapeRegistration(id: string) {
  await api.delete(`/registro-de-shape/destroy/${id}`)
}
