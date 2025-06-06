'use client'

import { MealCardHub } from '@/components/refeicoes/refeicoes-card-hub'
import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import { useWorkouts } from '@/hooks/queries/use-exercises'
import { useMeals } from '@/hooks/queries/use-meals'
import { useShape } from '@/hooks/queries/use-shape'
import { WEEK_DAYS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  BowlFood,
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyXEyes,
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { BicepsFlexed, ChevronDown, ScanFace } from 'lucide-react'
import Link from 'next/link'

export function TempleForge({ value }: { value: string }) {
  const { workouts } = useWorkouts()
  const { shapeRegistrations } = useShape()

  const firstShapeRegistration = shapeRegistrations?.[0]
  const lastShapeRegistration =
    shapeRegistrations && shapeRegistrations.length > 1
      ? shapeRegistrations[shapeRegistrations.length - 1]
      : shapeRegistrations?.[0]

  const today = new Date()
  const dayName = format(today, 'EEEE', { locale: ptBR })

  // // Filter workouts for today
  const todayIndex = WEEK_DAYS[new Date().getDay()].workoutIndex

  const todaysWorkouts = workouts?.filter((workout) => {
    return String(workout.indice) === String(todayIndex)
  })

  // Meals
  const { meals } = useMeals()

  const todaysMeals = meals?.filter((meal) => {
    return String(meal.dia_semana) === String(todayIndex)
  })

  return (
    <TabsContent value={value} className="flex-1">
      <div className="grid relative grid-cols-1 md:grid-cols-2 rounded-2xl w-full min-h-[676px] gap-2">
        {/* Treinos */}
        <div className="relative w-full gap-4 flex-1 overflow-hidden rounded-2xl border-t-2 border-t-zinc-700 bg-zinc-800">
          <div className="w-full p-6 pb-4">
            <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
              <span className="uppercase text-[10px] text-yellow-500 font-semibold">
                Treinos
              </span>
            </div>
          </div>

          <div className="absolute right-4 top-4">
            <span className="text-xs text-zinc-400">
              {lastShapeRegistration?.updated_at
                ? `* Medidas atualizadas em ${format(
                    new Date(lastShapeRegistration.updated_at),
                    'dd MMM yyyy',
                    { locale: ptBR },
                  )}`
                : ''}
            </span>
          </div>

          <div className="flex border-b items-center justify-between gap-4 p-6">
            {/* Card de Medidas */}
            <div className="flex flex-col w-full pl-4 border-l-4 border-l-yellow-500 border-y-0 border-r-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-400">Peso atual</span>
                  <span className="text-lg font-medium">
                    {lastShapeRegistration?.peso
                      ? `${lastShapeRegistration.peso}KG`
                      : 'Não cadastrado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card de Peso */}
            <div className="flex flex-col w-full pl-4 border-l-4 border-l-yellow-500 border-y-0 border-r-0">
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-base text-zinc-400">Objetivo</span>
                  <span className="text-base font-medium">
                    {lastShapeRegistration?.peso_meta
                      ? `${lastShapeRegistration.peso_meta}KG`
                      : 'Não cadastrado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card de Shape */}
            <div
              className={cn(
                'flex flex-col w-full pl-4 border-l-4 border-l-red-500 border-y-0 border-r-0',
                lastShapeRegistration?.nivel_satisfacao === 'Satisfeito'
                  ? 'border-l-green-500'
                  : lastShapeRegistration?.nivel_satisfacao ===
                      'Pouco satisfeito'
                    ? 'border-l-yellow-500'
                    : lastShapeRegistration?.nivel_satisfacao ===
                        'Não satisfeito'
                      ? 'border-l-orange-500'
                      : 'border-l-red-500',
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  <span className="text-lg text-zinc-400">Shape</span>
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      lastShapeRegistration?.nivel_satisfacao === 'Satisfeito'
                        ? 'text-green-500'
                        : lastShapeRegistration?.nivel_satisfacao ===
                            'Pouco satisfeito'
                          ? 'text-yellow-500'
                          : lastShapeRegistration?.nivel_satisfacao ===
                              'Não satisfeito'
                            ? 'text-orange-500'
                            : 'text-red-500',
                    )}
                  >
                    <span
                      className={`flex items-center gap-2 text-base ${
                        lastShapeRegistration?.nivel_satisfacao === 'Satisfeito'
                          ? 'text-green-500'
                          : lastShapeRegistration?.nivel_satisfacao ===
                              'Pouco satisfeito'
                            ? 'text-yellow-500'
                            : lastShapeRegistration?.nivel_satisfacao ===
                                'Não satisfeito'
                              ? 'text-orange-500'
                              : 'text-red-500'
                      }`}
                    >
                      {lastShapeRegistration?.nivel_satisfacao ===
                      'Satisfeito' ? (
                        <div className="flex items-center gap-2">
                          <Smiley className="w-6 h-6 text-green-500" />
                          <span className="text-green-500">Satisfeito</span>
                        </div>
                      ) : lastShapeRegistration?.nivel_satisfacao ===
                        'Pouco satisfeito' ? (
                        <div className="flex items-center gap-2">
                          <SmileyMeh className="w-6 h-6 text-yellow-500" />
                          <span className="text-yellow-500">
                            Pouco satisfeito
                          </span>
                        </div>
                      ) : lastShapeRegistration?.nivel_satisfacao ===
                        'Nada satisfeito' ? (
                        <div className="flex items-center gap-2">
                          <SmileyXEyes className="w-6 h-6 text-red-500" />
                          <span className="text-red-500">Nada satisfeito</span>
                        </div>
                      ) : lastShapeRegistration?.nivel_satisfacao ===
                        'Insatisfeito' ? (
                        <div className="flex items-center gap-2">
                          <SmileySad className="w-6 h-6 text-orange-500" />
                          <span className="text-orange-500">Insatisfeito</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <SmileyMeh className="w-6 h-6 text-red-500" />
                          <span className="text-red-500">Indefinido</span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treino do Dia */}
          <div className="md:col-span-3 flex flex-col w-full p-6  border-0">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">
                Hoje é <span className="font-medium">{dayName}</span>.
              </span>

              <div className="flex mb-2 gap-2 items-center justify-between">
                <div className="flex gap-1 items-center">
                  <h2 className="text-xl font-medium">Treino de hoje </h2>
                </div>
                <span className="text-sm font-medium text-zinc-300">
                  {todaysWorkouts?.length === 0
                    ? 'Nenhum treino cadastrado'
                    : `${todaysWorkouts?.length || 0} ${todaysWorkouts?.length === 1 ? 'treino' : 'treinos separados'}`}
                </span>
              </div>
              {/* <div className="flex mb-4 gap-2 flex-wrap">
                {todaysWorkouts ? (
                  todaysWorkouts.length > 0 &&
                  todaysWorkouts?.slice(0, 2).map((workout, index) => (
                    <Badge
                      className="flex items-center px-1 gap-1"
                      key={index}
                      variant="outline"
                    >
                      <Clock size={14} className="text-zinc-500" />
                      {workout.titulo}{' '}
                      <span className="text-xs text-zinc-500">
                        {todaysWorkouts[0].horario || 'Sem horário'}
                      </span>
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="outline">Nenhum treino cadastrado</Badge>
                  </>
                )}
              </div> */}

              <div className="h-[300px] scrollbar-minimal overflow-y-auto pb-12">
                {todaysWorkouts && todaysWorkouts.length > 0 ? (
                  todaysWorkouts
                    .sort((a, b) => {
                      const timeA = a.horario?.split(':').map(Number) || [0, 0]
                      const timeB = b.horario?.split(':').map(Number) || [0, 0]
                      return (
                        timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
                      )
                    })
                    .map((workout) => (
                      <div
                        key={workout.ficha_id}
                        className="flex w-full flex-col p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                      >
                        <details className="w-full">
                          <summary className="flex items-center justify-between w-full cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                                <BicepsFlexed
                                  size={24}
                                  className="text-zinc-400"
                                />
                              </div>

                              <div>
                                <h4 className="text-zinc-300 font-medium">
                                  {workout.titulo}{' '}
                                  <p className="text-sm text-zinc-500">
                                    {workout.horario}
                                  </p>
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <ChevronDown
                                size={16}
                                className="text-zinc-400 transition-transform group-open:rotate-180"
                              />
                            </div>
                          </summary>

                          <div className="flex flex-col gap-4 mt-4">
                            {workout.exercicios?.map((exercicio, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-zinc-800 rounded-lg p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-md bg-zinc-700 flex items-center justify-center">
                                    <BicepsFlexed
                                      size={16}
                                      className="text-zinc-400"
                                    />
                                  </div>
                                  <span className="text-sm text-zinc-300">
                                    {exercicio.nome}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-zinc-500">
                                    {exercicio.series}x{exercicio.repeticoes}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {workout.exercicios?.length === 0 && (
                              <div className="text-zinc-500 text-sm">
                                Nenhum exercício cadastrado
                              </div>
                            )}
                          </div>
                        </details>
                      </div>
                    ))
                ) : !firstShapeRegistration ? (
                  <div className="flex flex-col gap-8 items-center justify-center py-16 text-zinc-500">
                    <ScanFace size={56} />
                    <p>Comece a registrar suas medidas para ver os treinos</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8 items-center justify-center py-16 text-zinc-500">
                    <BicepsFlexed size={56} />
                    <p>Nenhum treino cadastrado para este dia</p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-800 via-zinc-800 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
          <Link className="absolute right-4 bottom-4" href="/exercicios">
            <Button size="sm">
              {!firstShapeRegistration ? 'Começar a registrar' : 'Acessar'}
            </Button>
          </Link>
        </div>

        {/* Refeições */}
        <div className="relative w-full gap-4 flex-1 overflow-hidden rounded-2xl border-t-2 border-t-zinc-700 bg-zinc-800">
          <div className="w-full p-6 pb-4">
            <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
              <span className="uppercase text-[10px] text-yellow-500 font-semibold">
                Refeições
              </span>
            </div>
          </div>

          {/* Refeições do Dia */}
          <div className="md:col-span-3 flex flex-col w-full pt-2 border-0">
            <div className="flex flex-col gap-1">
              <div className="flex mt-2 px-6 flex-col gap-2 border-b border-zinc-700 pb-4">
                <span className="text-sm text-zinc-400">
                  Hoje é <span className="font-medium">{dayName}</span>.
                </span>
                <div className="flex border-zinc-700 pb-4 gap-2 justify-between">
                  <div className="flex gap-1">
                    <h2 className="text-2xl font-medium">
                      Confira suas{' '}
                      <span className="text-zinc-400 mr-1">próximas</span>
                      refeições
                    </h2>
                  </div>
                </div>
              </div>

              <div className="h-[400px] p-6 pb-12 overflow-y-auto scrollbar-minimal">
                {todaysMeals && todaysMeals.length > 0 ? (
                  todaysMeals
                    .sort((a, b) =>
                      a.hora_refeicao.localeCompare(b.hora_refeicao),
                    )
                    .map((meal) => (
                      <MealCardHub
                        key={meal.horario_id}
                        meal={meal}
                        dayIndex={todayIndex}
                        onEdit={() => {}}
                      />
                    ))
                ) : (
                  <div className="flex flex-col h-full gap-8 items-center justify-center py-16 text-zinc-500">
                    <BowlFood size={56} />
                    <p className="text-zinc-500">
                      Nenhuma refeição cadastrada para este dia
                    </p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-800 via-zinc-800 to-transparent pointer-events-none" />
              </div>
            </div>
            <Link className="absolute right-4 bottom-4" href="/refeicoes">
              <Button size="sm">Acessar</Button>
            </Link>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
