import { create } from 'zustand'

interface CreateUserData {
  name: string | null
  lastName: string | null
  email: string | null
  cellphone: string | null
  password: string | null
  passwordConfirmation: string | null

  setNameStep: ({ name, lastName }: { name: string; lastName: string }) => void
  setEmailStep: ({
    email,
    cellphone,
  }: {
    email: string
    cellphone: string
  }) => void
  setPasswordStep: ({
    password,
    passwordConfirmation,
  }: {
    password: string
    passwordConfirmation: string
  }) => void
}

export const useCreateUserStore = create<CreateUserData>((set) => {
  return {
    name: null,
    lastName: null,
    email: null,
    cellphone: null,
    password: null,
    passwordConfirmation: null,

    setNameStep: ({ name, lastName }) => {
      set({ name, lastName })
    },

    setEmailStep: ({ email, cellphone }) => {
      set({ email, cellphone })
    },

    setPasswordStep: ({ password, passwordConfirmation }) => {
      set({ password, passwordConfirmation })
    },
  }
})
