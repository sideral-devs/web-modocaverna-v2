'use client'

import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { Check, ToggleLeft } from 'lucide-react'
import { useState } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Lightning } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Star } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const { data: user } = useUser()

  function getPlanUrl() {
    const indicationCode = user?.codigo_indicacao
      ? `&pid=${user.codigo_indicacao} `
      : ''

    switch (selectedPlan) {
      case 'yearly':
        return `${env.NEXT_PUBLIC_YEARLY_PLAN}${indicationCode}`
      case 'monthly':
        return `${env.NEXT_PUBLIC_MONTHLY_PLAN}${indicationCode}`
      default:
        return `${env.NEXT_PUBLIC_YEARLY_PLAN}${indicationCode}`
    }
  }

  return (
    <div className="flex flex-col justify-start items-start col-span-3 gap-10">
      <div className="flex flex-col w-full items-start gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings/account">
                Configurações
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Planos e Upgrades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* TODO: Verificar se o usuário tem um plano ativo */}
      {/* {user?.status_plan === 'EXPIRADO' ? (
        <div className="flex flex-col w-full items-center gap-4">
          <h1 className="text-2xl font-semibold">
            Assine um plano para continuar utilizando o Modo Caverna
          </h1>
        </div>
      ) : (
        <div className="flex flex-col w-full items-center gap-4">
          <h1 className="text-2xl font-semibold">Escolha um Plano</h1>
        </div>
      )} */}
      <div className="flex items-start w-full gap-4">
        {/* FIRST PLAN */}
        <div className="flex flex-col w-full">
          <div className="flex mb-4 flex-col h-auto bg-zinc-900 rounded-2xl border">
            <div className="flex flex-col gap-2 p-6 pb-0 mb-4">
              <ToggleLeft size={20} className="text-zinc-400" />
              <h3 className="text-[#F9CB15]">Sua assinatura atual</h3>
              <h2 className="text-2xl font-semibold mb-2">Plano Caverna</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-800/50 w-fit px-3 py-1 rounded-md border">
                  <span className="text-xs font-medium truncate text-zinc-400">
                    Assinante desde 21 Julho, 2024
                  </span>
                </div>
                <span className="text-[#F9CB15]">Acesso semestral</span>
              </div>
            </div>

            <div className="flex flex-col bg-zinc-800 rounded-2xl p-6">
              <h3 className="text-zinc-400 mb-4">Ferramentas contempladas:</h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3">
                  <Check size={20} className="text-[#F9CB15]" />
                  <span className="text-zinc-300">Curso Modo Caverna</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={20} className="text-[#F9CB15]" />
                  <span className="text-zinc-300">Desafio Caverna</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={20} className="text-[#F9CB15]" />
                  <span className="text-zinc-300">Indique e ganhe</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={20} className="text-[#F9CB15]" />
                  <span className="text-zinc-300">Suporte via chat</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col rounded-xl w-full bg-red-900/20 border border-red-500">
            <div className="flex flex-col gap-2">
              <div className="flex p-6 pb-2 flex-col gap-2">
                <Avatar className="w-8 h-8 mb-2 rounded-none">
                  <AvatarImage
                    src={'/images/logo-icon.svg'}
                    className="object-contain"
                  />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex gap-2 pr-4 justify-between items-center">
                    <div>
                      <h2 className="text-2xl max-w-[200px] font-semibold mb-2">
                        Avaliação gratuita acaba em
                      </h2>
                    </div>
                    <h3 className="text-red-500 font-bold text-4xl">5 dias</h3>
                  </div>
                </div>
              </div>
              <div className="w-full border-t border-red-500 p-6">
                <h4 className="text-white mb-2 font-bold text-sm">
                  Está curtindo a experiência?
                </h4>
                <h4 className="text-white/50 font-medium text-sm">
                  Ative a sua assinatura Cavernosa para continuar aproveitando
                  todas as funcionalidades.
                </h4>
              </div>
            </div>
          </div>
        </div>
        {/* SECOND PLAN */}
        <div className="flex flex-col  w-full h-auto bg-zinc-900 border-red-500 rounded-3xl border">
          <div className="flex flex-col relative gap-2 mb-4">
            <div className="flex absolute top-4 right-4 items-center bg-zinc-800 rounded-full p-1 w-fit">
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all',
                  selectedPlan === 'yearly'
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200',
                )}
              >
                Anual
              </button>
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all',
                  selectedPlan === 'monthly'
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200',
                )}
              >
                Mensal
              </button>
            </div>
            <div className="w-full gap-2 flex p-6 pb-0 flex-col">
              <Avatar className="w-8 h-8 mb-2 rounded-none">
                <AvatarImage
                  src={'/images/logo-icon.svg'}
                  className="object-contain"
                />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold">Plano Caverna</h2>
              <p className="text-zinc-400 font-medium mb-4">
                Explore todas ferramentas da plataforma
              </p>
            </div>
            <div className="flex px-3 items-center flex-col gap-2">
              <Button className="w-full text-base h-[70px]">
                Fazer upgrade{' '}
                <Lightning className="!w-4 !h-4" weight="fill" />{' '}
              </Button>
              <span className="text-zinc-400 font-medium text-sm">
                *cobrado anualmente
              </span>
            </div>
          </div>

          <div className="flex flex-col border-t border-red-500 border-x bg-zinc-800 rounded-3xl">
            <div className="border-b p-6 flex justify-between items-start">
              <div className="flex items-start flex-col gap-2">
                <Badge className="text-emerald-400 mb-2 bg-emerald-900">
                  Economize 50%
                </Badge>
                <h2 className="text-white flex items-end gap-2 mb-2 font-semibold text-3xl">
                  12x <span className="text-xl">de R$30</span>
                </h2>
                <span className="text-zinc-400 font-medium text-sm">
                  ou R$299 à vista
                </span>
              </div>
              <div className="flex items-center gap-2 flex-col">
                <span className="text-yellow-50 font-medium text-xs">
                  +50 mil usuários
                </span>
                <div className="flex items-center gap-2">
                  <Star fill="#F9CB15" size={16} weight="fill" />
                  <Star fill="#F9CB15" size={16} weight="fill" />
                  <Star fill="#F9CB15" size={16} weight="fill" />
                  <Star fill="#F9CB15" size={16} weight="fill" />
                  <Star fill="#F9CB15" size={16} weight="fill" />
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-4 p-6">
              <li className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300">Curso Modo Caverna</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300">Desafio Caverna</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300">Indique e ganhe</span>
              </li>
              <li className="flex items-center gap-3">
                <Check size={20} className="text-zinc-400" />
                <span className="text-zinc-300">Suporte via chat</span>
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="flex flex-col w-80 bg-gradient-to-b from-[#2a2a2a] from-[12%] to-zinc-900 rounded-2xl">
          <div className="flex flex-col px-6 py-8 gap-6">
            <div className="flex items-center justify-between">
              <h3> Escolha o tipo de assinatura: </h3>
              <Select
                onValueChange={(value) => {
                  setSelectedPlan(value)
                }}
                defaultValue={selectedPlan}
              >
                <SelectTrigger
                  className="w-24 h-8 text-x</Link>s bg-zinc-800"
                  chevronClassName="text-primary w-2 h-2"
                >
                  <SelectValue
                    placeholder="Selecione"
                    className="text-[10px]"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">Anual</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#F9CB15]">+ 10 mil alunos</span>
              <div className="flex items-center gap-1">
                <Star fill="#F9CB15" size={16} strokeWidth={0} />
                <Star fill="#F9CB15" size={16} strokeWidth={0} />
                <Star fill="#F9CB15" size={16} strokeWidth={0} />
                <Star fill="#F9CB15" size={16} strokeWidth={0} />
                <Star fill="#F9CB15" size={16} strokeWidth={0} />
              </div>
            </div>
            <div className="flex items-end text-emerald-400 gap-2">
              <h3 className="text-5xl">
                R$
                {selectedPlan === 'yearly' ? 299 : 49}
              </h3>
              <span>/ {selectedPlan === 'yearly' ? 'ano' : 'mês'}</span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-zinc-700" />
          <div className="flex flex-col py-5 px-6 gap-6">
            <h3>Incluso no plano Premium:</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Desafio Modo caverna
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Flow Produtividade
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Gestão de Metas Anuais
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Agenda Integrada ao Google
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Gestão Financeira Pessoal
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Assistente Pessoal com IA
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Organização de Biblioteca
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Acesso a Cursos e Vídeos
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Conteúdos Exclusivos
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check size={16} className="text-emerald-400" />
                <span className="text-xs text-zinc-400">
                  Suporte Humanizado via Chat
                </span>
              </li>
            </ul>
            <Link
              href={getPlanUrl()}
              target="_blank"
              className="align-center justify-center flex"
            >
              <Button className="mt-6">Desbloquear Funcionalidades</Button>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  )
}
