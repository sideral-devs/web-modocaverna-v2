'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Profile = {
  title: string
  subtitle: string
  description: string
}

export default function Page() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const savedProfile = localStorage.getItem('cave_profile')
  const currentYear = dayjs().format('YYYY')

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })

  useEffect(() => {
    try {
      const actualProfile = savedProfile
        ? (JSON.parse(savedProfile) as Profile)
        : null
      setProfile(actualProfile)
    } catch {
      setProfile(null)
    }
  }, [savedProfile])

  useEffect(() => {
    if (goals) {
      setCurrentGoal(goals.find((goal) => goal.ano === currentYear) || null)
    }
  }, [goals, currentYear])

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-dvh items-center gap-8 bg-zinc-950 overflow-hidden relative">
        <div className="w-full flex flex-1 flex-col items-center z-10">
          <div className="flex flex-col w-full max-w-6xl p-8 lg:py-16 gap-12">
            <header className="flex w-full items-center justify-center">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-2xl lg:text-3xl text-center">
                  Sua jornada no{' '}
                  <span className="text-primary">Modo Caverna</span> começou
                </h1>
                <p className="lg:text-lg opacity-80 text-center">
                  Descubra os segredos da sua mente e desbloqueie seu potencial
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative">
              <Card className="flex flex-col items-center p-6 gap-6 text-sm bg-white/5 border-2 border-red-900 card-shadow rounded-2xl">
                <CardHeader className="justify-between uppercase">
                  <CardTitle className="font-bold text-lg lg:text-xl mx-auto">
                    🚀 Próximos passos
                  </CardTitle>
                  {/* <span className="flex px-3 py-1.5 bg-primary font-bold rounded-full">
                    Prioridade
                  </span> */}
                </CardHeader>
                <p className="lg:text-lg">O que você precisa fazer agora:</p>
                {/* <div className="flex flex-col w-full items-center p-6 gap-3 bg-white/10 border rounded-2xl">
                  <p className="opacity-80">Progresso dos Próximos Passos</p>
                  <div className="w-full bg-white/15 h-1.5 rounded card-shadow-sm" />
                  <p className="text-yellow-400">0 de 2 passos concluídos</p>
                </div> */}
                <div className="flex flex-col gap-4 my-auto">
                  <div className="flex w-full items-center p-6 gap-4 bg-white/10 border rounded-2xl">
                    <div className="w-8 h-8 flex flex-col items-center justify-center bg-primary rounded-full">
                      <p className="text-lg font-semibold">1</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="text-lg font-bold">Módulos 1 e 2</p>
                      <span className="opacity-80 text-sm">
                        Assistir às aulas fundamentais na área &quot;Cursos &
                        Conteúdos&quot;
                      </span>
                    </div>
                    <Link href={'/members-area'}>
                      <Button size="sm">INICIAR</Button>
                    </Link>
                  </div>
                  <div className="flex w-full items-center p-6 gap-4 bg-white/10 border rounded-2xl">
                    <div className="w-8 h-8 flex flex-col items-center justify-center bg-primary rounded-full">
                      <p className="text-lg font-semibold">2</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="text-lg font-bold">Desafio Caverna</p>
                      <span className="opacity-80 text-sm">
                        Criar seu primeiro desafio pessoal de 40 dias
                      </span>
                    </div>
                    <Link href={'/desafio-caverna'}>
                      <Button size="sm">CRIAR</Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="flex flex-col items-center p-6 gap-6 text-sm bg-white/5 border rounded-2xl">
                <CardHeader className="justify-between uppercase">
                  <CardTitle className="font-bold text-lg lg:text-xl mx-auto">
                    🎯 Seu Perfil Caverna
                  </CardTitle>
                </CardHeader>
                <div className="flex w-full items-center p-6 gap-6 bg-red-700/10 rounded-2xl border border-red-900">
                  <div className="flex flex-col gap-2">
                    <p className="text-lg text-primary font-bold">
                      {profile?.title || 'O Estrategista'}
                    </p>
                    {profile && (
                      <p className="opacity-80">{profile.description}</p>
                    )}
                  </div>
                </div>
                <CardHeader className="justify-between uppercase">
                  <CardTitle className="font-bold text-lg lg:text-xl mx-auto">
                    🎯 Seu Principal Objetivo
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-col w-full items-center p-6 gap-3 bg-white/10 border-l-2 border-primary  rounded-2xl">
                  <p className="font-bold italic truncate w-full">
                    {currentGoal?.objetivos.principal}
                  </p>
                </div>
              </Card>

              {/* <Card className="flex flex-col md:col-span-2 items-center p-6 gap-6 text-sm bg-white/5 border rounded-2xl">
                <CardHeader className="justify-between uppercase">
                  <CardTitle className="font-bold text-lg lg:text-xl">
                    📊 Jornada Iniciada
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-col items-center gap-2">
                  <p className="font-bold text-4xl text-primary">0</p>
                  <span className="opacity-80">Dias no Modo Caverna</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="font-bold text-4xl text-primary">2</p>
                  <span className="opacity-80">Módulos Disponíveis</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="font-bold text-4xl text-primary">40</p>
                  <span className="opacity-80">Dias de Desafio</span>
                </div>
              </Card> */}
            </div>

            <div className="flex w-fit mx-auto items-center p-6 gap-6 bg-yellow-700/10 rounded-2xl border border-yellow-900">
              <span className="text-2xl">💪 </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm opacity-80">
                  Lembre-se: Cada ação que você toma hoje te aproxima deste
                  objetivo.
                </span>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-8">
              {/* <p className="text-lg opacity-80">
                <strong>Capitão Caverna diz:</strong> &quot;A caverna está
                preparada. Agora é hora de entrar e começar sua
                transformação!&quot;
              </p> */}
              <Link href={'/dashboard'}>
                <Button className="h-16 px-8 text-xl font-bold uppercase rounded-xl button-shadow transition-all duration-300 hover:-translate-y-1">
                  🚀 Ativar Modo Caverna
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-[800px] -left-[800px] size-[1600px] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
          <div className="absolute -top-[800px] -right-[800px] size-[1600px] rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
        </div>
      </div>
    </ProtectedRoute>
  )
}
