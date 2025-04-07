'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function GoogleAuth() {
  const session = useSession()
  const queryClient = useQueryClient()
  const { data: userConfigs, isFetched } = useQuery<Configuracoes>({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const response = await api.get('/configuracoes/find')
      if (response.status !== 200) {
        throw new Error('Erro ao buscar configurações')
      }
      return response.data.data
    },
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

  useEffect(() => {
    if (
      (session.status !== 'authenticated' && session.data !== null) ||
      !userConfigs
    )
      return
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
      try {
        await api.put('/configuracoes/update', {
          google_oauth: null,
          refresh_token: null,
        })
      } catch (updateError) {
        console.error('Erro ao atualizar configurações:', updateError)
      }

      await signOut()
    } catch (error) {
      console.error('Erro no processo de logout:', error)
      toast.error('Ocorreu um erro durante a desconexão.')
    }
    queryClient.invalidateQueries({ queryKey: ['configuracoes'] })
  }
  if (!isFetched) return null

  return (
    <>
      {userConfigs?.google_oauth ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="h-10 border-l-green-200 bg-green-700"
              variant="success"
            >
              <Image
                src={'/icons/google.svg'}
                alt="Google"
                width={16}
                height={16}
              />
              <p className="text-white">Google Calendar Conectado</p>
              <ChevronRight className="text-cyan-400" size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Integração Google Calendar</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover a integração com o Google
                Calendar? Isso irá desconectar sua conta e remover as permissões
                de acesso.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          className="h-10 border-l-cyan-400"
          variant="outline"
          onClick={handleSignIn}
        >
          <Image
            src={'/icons/google.svg'}
            alt="Google"
            width={16}
            height={16}
          />
          <p>Integrar ao Google Calendar</p>
          <ChevronRight className="text-cyan-400" size={16} />
        </Button>
      )}
    </>
  )
}
