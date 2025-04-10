'use client'
import { ChallengePoints } from '@/components/challenge-points'
import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import {
  AlertOctagonIcon,
  CheckCircle2,
  CheckIcon,
  Loader2,
  XIcon,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

dayjs.locale('pt-br')

interface ReducedChallenge {
  desafio_id: number
  modalidade: string
  status_desafio: string
  data_de_inicio: string
}

export default function Home() {
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(
    null,
  )

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['past-challenges'],
    queryFn: async () => {
      const response = await api.get('/desafios/find')
      const data = response.data as ReducedChallenge[]
      return data.reverse()
    },
  })

  const { data: challenge } = useQuery({
    queryKey: ['challenge', selectedChallengeId],
    queryFn: async () => {
      const response = await api.get('/desafios/show/' + selectedChallengeId)
      return response.data as Challenge
    },
  })

  function handleSelectChallenge(id: number) {
    setSelectedChallengeId(id)
  }

  useEffect(() => {
    if (challenges && challenges.length > 0) {
      setSelectedChallengeId(challenges[0].desafio_id)
    }
  }, [challenges])

  if (challengesLoading || !challenges) {
    return (
      <div className="flex h-screen bg-[#18181b] text-white items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#34d298]" />
        <span className="ml-2">Carregando desafio...</span>
      </div>
    )
  }

  return (
    <UpgradeModalTrigger>
      <div className="flex flex-col w-full h-screen items-center overflow-y-hidden">
        <Header className="h-24">
          <HeaderTitle
            title="Histórico desafio caverna"
            className="border-white text-white"
          />
          <HeaderClose />
        </Header>
        <section className="flex flex-col lg:flex-row w-full flex-1 lg:h-[calc(100vh-96px)] max-w-8xl lg:max-h-full justify-center bg-black overflow-hidden">
          <div className="flex flex-col w-full lg:w-80 xl:w-96 p-4 lg:p-8 gap-5 border-r border-[#27272a] overflow-y-auto scrollbar-minimal">
            <span className="text-xs text-zinc-400">
              <span className="text-white">
                {challenges.length}{' '}
                {challenges.length === 1 ? 'Desafio' : 'Desafios'} Caverna{' '}
              </span>
              registrados
            </span>
            <div className="flex w-full lg:block gap-4 lg:space-y-4 overflow-x-auto lg:overflow-x-visible scrollbar-minimal">
              {challenges.map((desafio) => {
                const active = desafio.desafio_id === challenge?.desafio_id
                return (
                  <div
                    key={desafio.desafio_id}
                    className={cn(
                      'flex flex-col min-w-60 p-4 pb-7 gap-5 rounded-2xl overflow-hidden border cursor-pointer',
                      active ? 'bg-red-800/40 border-primary' : '',
                    )}
                    onClick={() => handleSelectChallenge(desafio.desafio_id)}
                  >
                    <div className="flex w-full items-center justify-between">
                      {active ? (
                        <Image
                          src={'/images/logo-icon.svg'}
                          alt="Logo"
                          width={16}
                          height={14}
                        />
                      ) : (
                        <Image
                          src={'/images/logo-icon-grey.svg'}
                          alt="Logo"
                          width={16}
                          height={14}
                        />
                      )}
                      <span
                        className={cn(
                          'flex px-2 py-1 text-[8px] border rounded-full uppercase',
                          active
                            ? 'text-yellow-400  border-yellow-400'
                            : 'bg-zinc-900 text-zinc-400',
                        )}
                      >
                        {desafio.status_desafio}
                      </span>
                    </div>
                    <div className={cn('flex flex-col gap-2.5')}>
                      <h4 className="font-semibold">Desafio Caverna</h4>
                      <p className="text-xs text-zinc-400">
                        Iniciado em{' '}
                        {dayjs(desafio.data_de_inicio).format(
                          'DD [de] MMMM[,] YYYY[.]',
                        )}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full p-6 pb-20 gap-4 overflow-y-auto scrollbar-minimal">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                  Desafio <span className="text-[#ff3333]">Caverna</span>
                </h1>
                <p className="text-sm text-zinc-400">40 dias em Modo Caverna</p>
              </div>
              {challenge ? (
                <ChallengePoints challenge={challenge} />
              ) : (
                <Skeleton className="w-64 h-4" />
              )}
            </div>

            {challenge ? (
              <div
                className={cn(
                  'flex items-center justify-center gap-2 border rounded-lg p-4',
                  challenge.status_desafio === 'concluido'
                    ? 'bg-emerald-900 border-emerald-400 text-emerald-400'
                    : challenge.status_desafio === 'abandonado'
                      ? 'border-red-500 text-white bg-red-900/40'
                      : 'border-yellow-400 text-yellow-400 bg-yellow-700/40',
                )}
              >
                {challenge.status_desafio === 'abandonado' ? (
                  <AlertOctagonIcon className="text-red-500" />
                ) : (
                  <CheckCircle2 />
                )}
                <span>Desafio {challenge.status_desafio}</span>
              </div>
            ) : (
              <Skeleton className="w-full h-16" />
            )}
            {challenge ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-4 border rounded-xl">
                <div className="flex flex-col h-full justify-center gap-2.5">
                  <h2 className="text-xl font-semibold">Status do desafio</h2>
                  <div className="w-fit bg-cyan-800 text-cyan-400 text-xs font-semibold rounded-full py-1 px-4 inline-block">
                    <span>
                      Iniciado em{' '}
                      {dayjs(challenge.data_de_inicio).format(
                        'DD [de] MMMM[,] YYYY',
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex flex-col w-fit items-center p-1 pt-2 gap-2 bg-zinc-700 rounded-xl">
                    <span className="font-semibold text-[10px]">
                      Dias neutros
                    </span>
                    <div className="w-full text-2xl font-semibold px-12 py-7 bg-zinc-900 rounded-xl">
                      {challenge.neutral_days_count.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="hidden lg:block w-[1px] h-1.5 bg-zinc-400 rounded-full" />
                  <div className="flex flex-col w-fit items-center p-1 pt-2 gap-2 bg-zinc-700 rounded-xl">
                    <span className="font-semibold text-[10px]">
                      Dias negativos
                    </span>
                    <div className="w-full text-2xl font-semibold px-12 py-7 bg-zinc-900 rounded-xl">
                      {challenge.negative_days_count
                        .toString()
                        .padStart(2, '0')}
                    </div>
                  </div>
                  <div className="hidden lg:block w-[1px] h-1.5 bg-zinc-400 rounded-full" />
                  <div className="flex flex-col w-fit items-center p-1 pt-2 gap-2 bg-emerald-900 text-emerald-400 rounded-xl">
                    <span className="font-semibold text-[10px]">
                      Dias positivos
                    </span>
                    <div className="w-full text-2xl font-semibold px-12 py-7 rounded-xl border border-emerald-400">
                      {challenge.positive_days_count
                        .toString()
                        .padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Skeleton className="w-full h-32" />
            )}

            <div className="grid grid-cols-2 gap-4">
              {challenge ? (
                <div className="flex flex-col h-80 p-4 gap-8 border rounded-xl">
                  <span className="flex w-fit sticky py-1 px-2 bg-card text-emerald-400 border border-emerald-400 rounded-full text-xs uppercase">
                    NOVOS HÁBITOS
                  </span>
                  <ul className="flex flex-col gap-2.5 overflow-y-auto scrollbar-minimal">
                    {challenge.array_falhar.map((habito, index) => (
                      <ListItem key={index} value={habito} positive />
                    ))}
                  </ul>
                </div>
              ) : (
                <Skeleton className="h-80" />
              )}
              {challenge ? (
                <div className="flex flex-col h-80 p-4 gap-8 border rounded-xl">
                  <span className="flex w-fit sticky py-1 px-2 bg-card text-red-500 border border-red-500 rounded-full text-xs uppercase">
                    RENÚNCIAS
                  </span>
                  <ul className="flex flex-col gap-2.5 overflow-y-auto scrollbar-minimal">
                    {challenge.array_comprometimento.map((habito, index) => (
                      <ListItem key={index} value={habito} positive={false} />
                    ))}
                  </ul>
                </div>
              ) : (
                <Skeleton className="h-80" />
              )}
            </div>

            {challenge && (
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 mt-10">
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="flex w-fit text-[10px] px-3 py-1.5 border rounded-full uppercase">
                      O que desejava alcançar
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 2 }, (_, index) => {
                        const photos = challenge.fotos_situacao_inicial
                        const foto = photos ? photos[index] : undefined

                        return (
                          <div
                            key={'photo-' + index}
                            className="w-full h-[200px] border rounded-lg overflow-hidden relative"
                          >
                            <Image
                              src={
                                foto
                                  ? env.NEXT_PUBLIC_PROD_URL + foto
                                  : '/images/image-empty.png'
                              }
                              className="object-cover"
                              alt="Foto situação inicial"
                              draggable={false}
                              fill
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <Image
                        height={14}
                        width={20}
                        alt="Quote"
                        src={'/icons/quote-2.svg'}
                      />
                      <p>
                        O que você deseja alcançar / como você deseja estar ao
                        final dos 40 dias do desafio?
                      </p>
                    </div>
                    <p className="text-zinc-400">
                      {challenge.textarea_oque_deseja}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="flex w-fit text-[10px] px-3 py-1.5 border rounded-full uppercase text-primary border-primary">
                      O que alcançou
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 2 }, (_, index) => {
                        const photos = challenge.fotos_situacao_final
                        const foto = photos ? photos[index] : undefined

                        return (
                          <div
                            key={'photo-' + index}
                            className="w-full h-[200px] border rounded-lg overflow-hidden relative"
                          >
                            <Image
                              src={
                                foto
                                  ? env.NEXT_PUBLIC_PROD_URL + foto
                                  : '/images/image-empty.png'
                              }
                              className="object-cover"
                              alt="Foto situação inicial"
                              draggable={false}
                              fill
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <Image
                        height={14}
                        width={20}
                        alt="Quote"
                        src={'/icons/quote-2.svg'}
                      />
                      <p>Descreva sua situação atual e desafios enfrentados?</p>
                    </div>
                    <p className="text-zinc-400">{challenge.situacao_final}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex w-full min-h-[1px] my-8 bg-border"></div>
            {challenge && (
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="flex w-fit text-[10px] px-3 py-1.5 border rounded-full uppercase">
                      COMO SE SENTIA
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 2 }, (_, index) => {
                        const photos = challenge.fotos_oque_motivou_inicial
                        const foto = photos ? photos[index] : undefined

                        return (
                          <div
                            key={'photo-' + index}
                            className="w-full h-[200px] border rounded-lg overflow-hidden relative"
                          >
                            <Image
                              src={
                                foto
                                  ? env.NEXT_PUBLIC_PROD_URL + foto
                                  : '/images/image-empty.png'
                              }
                              className="object-cover"
                              alt="Foto situação inicial"
                              draggable={false}
                              fill
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <Image
                        height={14}
                        width={20}
                        alt="Quote"
                        src={'/icons/quote-2.svg'}
                      />
                      <p>
                        O que você deseja alcançar / como você deseja estar ao
                        final dos 40 dias do desafio?
                      </p>
                    </div>
                    <p className="text-zinc-400">
                      {challenge.textarea_oque_motivou}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-4">
                    <span className="flex w-fit text-[10px] px-3 py-1.5 border rounded-full uppercase text-primary border-primary">
                      O que alcançou
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 2 }, (_, index) => {
                        const photos = challenge.fotos_oque_motivou_final
                        const foto = photos ? photos[index] : undefined

                        return (
                          <div
                            key={'photo-' + index}
                            className="w-full h-[200px] border rounded-lg overflow-hidden relative"
                          >
                            <Image
                              src={
                                foto
                                  ? env.NEXT_PUBLIC_PROD_URL + foto
                                  : '/images/image-empty.png'
                              }
                              className="object-cover"
                              alt="Foto situação inicial"
                              draggable={false}
                              fill
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <Image
                        height={14}
                        width={20}
                        alt="Quote"
                        src={'/icons/quote-2.svg'}
                      />
                      <p>
                        Como você se sente hoje em comparação ao que sentia ao
                        entrar na Caverna?
                      </p>
                    </div>
                    <p className="text-zinc-400">
                      {challenge.relato_conquistas}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </UpgradeModalTrigger>
  )
}

function ListItem({ value, positive }: { value: string; positive: boolean }) {
  return (
    <li
      className={cn(
        'flex relative w-fit max-w-full items-center px-4 py-[10px] gap-2 bg-card text-zinc-400 rounded-full cursor-pointer group',
      )}
      // onClick={() => onSelect(value)}
    >
      {positive ? (
        <CheckIcon className="text-emerald-400 stroke-2" />
      ) : (
        <XIcon className="text-red-500 stroke-2" size={16} />
      )}
      <span className="truncate">{value.slice(1).trim()}</span>
    </li>
  )
}
