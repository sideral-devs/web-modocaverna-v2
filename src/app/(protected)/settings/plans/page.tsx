'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
    <div className="flex flex-col justify-items-center col-span-3 gap-10">
      <header className="flex flex-col w-full items-center gap-4">
        <h1 className="text-2xl font-semibold">
          {user?.status_plan === 'EXPIRADO'
            ? 'Assine um plano para continuar utilizando o Modo Caverna'
            : 'Escolha um Plano'}
        </h1>
      </header>
      <div className="flex justify-around">
        <div className="flex flex-col w-80 bg-gradient-to-b from-[#2a2a2a] from-[12%] to-zinc-900 rounded-2xl">
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
        </div>
      </div>
    </div>
  )
}
