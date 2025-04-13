'use client'
import { CountdownTimer } from '@/components/countdown'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AlarmClock, AlertTriangle, CheckCheckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function ChallengeCard() {
  const { data: challenge, isFetching } = useQuery({
    queryKey: ['challenge'],
    queryFn: async () => {
      const response = await api.get('/desafios/user')
      return response.data as Challenge
    },
    retry: false,
  })

  if (!challenge && isFetching) {
    return <Skeleton className="flex flex-col w-full h-full p-4 gap-4" />
  }

  return (
    <Card className="flex flex-col w-full h-full min-h-[300px] p-4 gap-4">
      <CardHeader>
        <div className="flex w-fit px-3 py-2 pt-[9px] border border-primary rounded-full">
          <span className="text-[10px] text-primary font-semibold">
            DESAFIO CAVERNA
          </span>
        </div>
      </CardHeader>
      <ChallengeComponent challenge={challenge} />
    </Card>
  )
}
function ChallengeComponent({ challenge }: { challenge?: Challenge | null }) {
  const [challengeMessage, setChallengeMessage] = useState('')

  const targetDate = useMemo(
    () => dayjs().set('hour', 19).set('minute', 0).set('second', 0).toDate(),
    [],
  )
  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }
  const messagesDesafioCaverna = [
    'Você ainda não iniciou um Desafio. Vamos começar agora?',
    'Nenhum desafio registrado. Comece sua jornada de transformação.',
    'Sua jornada no Desafio Caverna ainda não começou. Vamos iniciar?',
    'Está pronto para o desafio? Comece agora e transforme sua rotina.',
    'Ainda não há um desafio iniciado. Comece a sua jornada agora.',
  ]

  // const formattedMessages = messagesDesafioCaverna.map((msg) =>
  //   msg.replace(/\./g, '.\n'),
  // )

  useEffect(() => {
    setChallengeMessage(getMessageForTime(messagesDesafioCaverna))
    setInterval(() => {
      setChallengeMessage(getMessageForTime(messagesDesafioCaverna))
    }, 1200000)
  }, [])
  if (
    !challenge ||
    challenge.status_desafio === 'finalizado' ||
    challenge.status_desafio === 'abandonado'
  ) {
    return (
      <div className="relative flex flex-row items-center flex-1 justify-center md:justify-normal md:pt-6 gap-2">
        <div className="flex flex-row relative bottom-10">
          <Image
            src={'/images/empty-states/empty-desafio.png'}
            alt="Empty"
            width={110}
            height={110}
          />
          <p className="text-center text-[13px] relative top-8  text-zinc-500">
            {challengeMessage}
          </p>
        </div>

        <Link
          href="/historico-desafio"
          className="mt-auto absolute bottom-0 left-0"
        >
          <Button size="sm" className="bg-zinc-700">
            Ver Histórico
          </Button>
        </Link>
        <Link href={'/desafio-caverna'}>
          <Button size="sm" className="absolute bottom-0 right-0">
            Começar Agora!
          </Button>
        </Link>
      </div>
    )
  }

  if (challenge.status_desafio === 'pausado') {
    if (dayjs(challenge.data_de_inicio).isAfter(dayjs().endOf('day'))) {
      return (
        <div className="flex flex-col flex-1 items-center justify-center md:justify-normal md:pt-6">
          <div className="flex flex-col max-w-80 items-center">
            <AlarmClock className="text-zinc-700" fill="#EE4444" />
            <p className="text-xl text-center mt-4">
              A sua jornada na caverna começará amanhã
            </p>
            <span className="text-[13px] text-zinc-400 text-center mt-3">
              Aproveite o dia de hoje para organizar a sua rotina e seus
              rituais.
            </span>
          </div>
          <div className="flex w-full justify-between relative top-14">
            <Link href="/historico-desafio" className="mt-auto">
              <Button size="sm" className="bg-zinc-700">
                Ver Histórico
              </Button>
            </Link>
            <Link href="/desafio-caverna" className="mt-auto">
              <Button size="sm">Ver Desafio</Button>
            </Link>
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-center flex-1 justify-center md:justify-normal md:pt-6 gap-6">
          <div className="flex flex-col items-center gap-4">
            <AlarmClock className="text-zinc-700" fill="#EE4444" />
            <p className="text-center text-zinc-500">
              Você ainda não iniciou o Desafio
            </p>
          </div>
          <Link href={'/desafio-caverna/dashboard'} className="mt-2">
            <Button size="sm">Iniciar Desafio!</Button>
          </Link>
        </div>
      )
    }
  }

  if (dayjs().hour() < 19) {
    return (
      <>
        <div className="flex flex-col flex-1 items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <AlarmClock className="text-zinc-700" fill="#EE4444" />
            <p className="text-center">
              A avaliação de hoje estará disponível em
            </p>
          </div>
          <CountdownTimer targetDate={targetDate} />
        </div>
        <div className="flex w-full justify-between">
          <Link href="/historico-desafio" className="mt-auto">
            <Button size="sm" className="bg-zinc-500">
              Ver Histórico
            </Button>
          </Link>
          <Link href="/desafio-caverna" className="mt-auto">
            <Button size="sm">Ver Desafio</Button>
          </Link>
        </div>
      </>
    )
  }

  if (!challenge.hojeInfo || challenge.hojeInfo === 'null') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 md:pt-6 gap-7">
        <div className="flex flex-col items-center gap-3">
          <Image
            src={'/images/logo-icon.svg'}
            alt="Logo"
            width={26}
            height={22}
          />
          <p className="text-center text-[13px] text-zinc-400">
            De acordo com as marcações, como você avalia a sua conduta hoje?
          </p>
        </div>
        <div className="flex w-full items-center justify-center gap-3">
          <Link href={'/desafio-caverna/dashboard?register_open=true'}>
            <Button className="flex-1 max-w-24 text-red-300 bg-red-800">
              Negativa
            </Button>
          </Link>
          <Link href={'/desafio-caverna/dashboard?register_open=true'}>
            <Button className="flex-1 max-w-24 text-emerald-400 bg-emerald-800">
              Positiva
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      {challenge.hojeInfo === 'positiveCheck' ? (
        <CheckCheckIcon size={32} className="text-emerald-400" />
      ) : (
        <AlertTriangle size={32} className="text-red-500" />
      )}
      <h2 className=" font-semibold text-center max-w-64">
        {challenge.hojeInfo === 'positiveCheck'
          ? 'Parabéns, mais um dia vencido'
          : 'Parece que você vacilou hoje'}
      </h2>
      {challenge.hojeInfo === 'negativeCheck' && (
        <div className="max-w-40 text-center text-sm text-zinc-400">
          Não se preocupe. Amanhã é um novo dia.
        </div>
      )}
      <Link href={'/desafio-caverna/dashboard'} className="mt-2">
        <Button size="sm">Acessar Desafio</Button>
      </Link>
    </div>
  )
}
