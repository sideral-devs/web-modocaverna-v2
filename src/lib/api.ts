import axios from 'axios'

// const prodUrl = process.env.NEXT_PUBLIC_PROD_URL

// export async function getCsrfToken() {
//   try {
//     await axios
//       .get(`${prodUrl}sanctum/csrf-cookie`, {})
//       .then(() => {
//         console.log('Autenticação Sanctum realizada com sucesso!')
//       })
//       .catch(() => {
//         console.error('Erro ao Solicitar Autenticação')
//       })
//   } catch (error) {
//     console.error('Erro ao obter CSRF token:', error)
//     return null
//   }
// }

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

export { api }
