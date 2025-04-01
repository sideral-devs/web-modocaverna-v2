'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function GoogleAuth() {
  const session = useSession()
  const queryClient = useQueryClient()

  // Query para obter as configurações do usuário
  const { data: userConfigs } = useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const response = await api.get('/configuracoes/show')
      return response.data
    },
    enabled: session.status === 'authenticated', // Só busca se estiver autenticado
  })
  // Mutation para atualizar o token
  const { mutateAsync: updateToken } = useMutation({
    mutationFn: async (token: string) => {
      return api.put('/configuracoes/update', {
        google_oauth: token,
        refresh_token: token,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar token:', error)
    },
  })

  // Efeito para sincronizar o token quando necessário
  useEffect(() => {
    if (session.status !== 'authenticated' || !userConfigs) return
    // @ts-expect-error: session.data pode estar indefinido
    const sessionToken = session.data?.refreshToken
    const storedToken = userConfigs.refresh_token

    if (sessionToken && storedToken !== sessionToken) {
      updateToken(sessionToken)
    }
  }, [session.status, session.data, userConfigs, updateToken])

  const handleSignIn = async () => {
    await signIn('google')
  }

  const handleSignOut = async () => {
    try {
      // @ts-expect-error: session.data pode estar indefinido
      if (session.data?.refreshToken) {
        await api.put('/configuracoes/update', {
          google_oauth: '',
          refresh_token: '',
        })
      }
      await signOut()
    } catch (error) {
      console.error('Erro ao desconectar:', error)
      toast.error('Erro ao desconectar do Google.')
    }
  }

  if (session.status === 'loading') return null

  return (
    <Button
      className={`h-10 ${userConfigs?.google_oauth ? ' border-l-green-200' : 'border-l-cyan-400'} ${userConfigs?.google_oauth && 'bg-green-700'} `}
      variant={`${userConfigs?.google_oauth ? 'success' : 'outline'}`}
      onClick={userConfigs?.google_oauth ? handleSignOut : handleSignIn}
    >
      <Image src={'/icons/google.svg'} alt="Google" width={16} height={16} />
      {userConfigs?.google_oauth ? (
        <p className="text-white">Google Calendar Conectado</p>
      ) : (
        <p> Integrar ao Google Calendar</p>
      )}
      <ChevronRight className="text-cyan-400" size={16} />
    </Button>
  )
}
