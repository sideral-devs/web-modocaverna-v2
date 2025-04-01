import { create } from 'zustand'

interface FinishChallengeData {
  relato_conquistas: string | null
  situacao_final: string | null
  fotos_situacao_final: string[] | null
  fotos_oque_motivou_final: string[] | null

  setRelatoConquistas: (relatoConquistas: string) => void
  setSituacaoFinal: (situacaoFinal: string) => void
  setFotosSituacaoFinal: (fotosSituacaoFinal: string[]) => void
  setFotosOqueMotivouFinal: (fotosOqueMotivouFinal: string[]) => void
}

export const useFinishChallengeStore = create<FinishChallengeData>((set) => {
  return {
    relato_conquistas: null,
    situacao_final: null,
    fotos_situacao_final: null,
    fotos_oque_motivou_final: null,

    setRelatoConquistas: (relatoConquistas) => {
      set({ relato_conquistas: relatoConquistas })
    },

    setSituacaoFinal: (situacaoFinal) => {
      set({ situacao_final: situacaoFinal })
    },

    setFotosSituacaoFinal: (fotosSituacaoFinal) => {
      set({ fotos_situacao_final: fotosSituacaoFinal })
    },

    setFotosOqueMotivouFinal: (fotosOqueMotivouFinal) => {
      set({ fotos_oque_motivou_final: fotosOqueMotivouFinal })
    },
  }
})
