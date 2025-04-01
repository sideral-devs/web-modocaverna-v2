import { create } from 'zustand'

interface CreateFolderData {
  creatingFolder: boolean
  setCreatingFolder: (arg: boolean) => void
}

export const useCreateFolder = create<CreateFolderData>((set) => {
  return {
    creatingFolder: false,

    setCreatingFolder: (arg) => {
      if (!arg) return
      set({ creatingFolder: arg })
    },
  }
})
