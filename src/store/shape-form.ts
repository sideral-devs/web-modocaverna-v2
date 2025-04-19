import { create } from 'zustand'

interface ShapeFormData {
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
}

interface ShapeFormStore {
  data: ShapeFormData
  setData: (data: Partial<ShapeFormData>) => void
  reset: () => void
}

const initialState: ShapeFormData = {
  membros_superiores: {
    ombro: 0,
    peito: 0,
    biceps_direito: 0,
    biceps_esquerdo: 0,
    triceps_esquerdo: 0,
    triceps_direito: 0,
  },
  membros_inferiores: {
    gluteos: 0,
    quadril: 0,
    quadriceps_direito: 0,
    quadriceps_esquerdo: 0,
    panturrilha_esquerda: 0,
    panturrilha_direita: 0,
  },
  satisfeito_fisico: 0,
  classificacao: '',
  imc: 0,
  altura: 0,
  peso: 0,
  texto_meta: '',
  nivel_satisfacao: '',
  objetivo: '',
  peso_meta: 0,
}

export const useShapeFormStore = create<ShapeFormStore>((set) => ({
  data: initialState,
  setData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  reset: () => set({ data: initialState }),
}))
