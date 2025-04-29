'use client'

import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { HeaderClose, Header } from '@/components/header'
import { MealCard } from '@/components/refeicoes/refeicoes-card'
import { MealFormModal } from '@/components/refeicoes/refeicoes-form-modal'
import { useMeals } from '@/hooks/queries/use-meals'
import { WEEK_DAYS } from '@/lib/constants'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Meal } from '@/lib/api/meals'
import Image from 'next/image'
import { DeleteMealDialog } from '@/components/refeicoes/delete-meal-dialog'
import { toast } from 'sonner'

export default function Page() {
  const [selectedDay, setSelectedDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
  )
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined>()
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null)

  const { scrollY } = useScroll()
  const currentDate = new Date()
  const formattedDate = format(currentDate, "dd 'de' MMMM, yyyy", {
    locale: ptBR,
  })
  const { meals, isLoading, createMeal, updateMeal, deleteMeal } = useMeals()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 0)
  })

  // Filter meals for the selected day and sort by time
  const mealsForDay = meals
    ?.filter((meal) => meal.dia_semana === selectedDay)
    ?.sort((a, b) => {
      const timeA = a.hora_refeicao.split(':').map(Number)
      const timeB = b.hora_refeicao.split(':').map(Number)
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
    })

  function handleOpenModal(meal?: Meal) {
    setSelectedMeal(meal)
    setIsModalOpen(true)
  }

  async function handleSubmit(data: Partial<Meal>) {
    if (selectedMeal) {
      console.log(selectedMeal.horario_id, data)
      await updateMeal({ id: selectedMeal.horario_id, data })
    } else {
      await createMeal({
        ...data,
        dia_semana: selectedDay,
      } as Meal)
    }
  }

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-6 h-6 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        animate={{
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <Header className="fixed bg-black/50 backdrop-blur-sm z-30 py-4">
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
            <span className="uppercase text-[10px] text-yellow-500 font-semibold">
              Refeições
            </span>
          </div>
          <HeaderClose />
        </Header>
      </motion.div>

      <div className="p-8 min-h-screen pb-[400px] pt-16 max-w-4xl mx-auto">
        <div className="mt-16 w-full">
          <div className="mb-8">
            <p className="text-zinc-500 text-sm">
              Última atualização · {formattedDate}
            </p>
            <h1 className="text-2xl font-semibold mt-2">
              Controle <span className="text-red-500">semanal</span> de
              refeições
            </h1>
          </div>

          <div className="flex gap-4 w-full justify-between mb-8">
            {WEEK_DAYS.map((day, index) => (
              <button
                key={day.short}
                onClick={() => setSelectedDay(index)}
                className={`px-6 py-4 w-full rounded-lg text-base font-medium transition-colors
                  ${
                    selectedDay === index
                      ? 'bg-red-500 text-white'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                  }
                `}
              >
                {day.short}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {mealsForDay?.length}{' '}
              {mealsForDay?.length === 1 ? 'refeição' : 'refeições'} cadastradas
            </h2>
            <Button
              variant="secondary"
              className="text-zinc-500 pl-4 py-0 pr-0 gap-2"
              onClick={() => handleOpenModal()}
            >
              Nova refeição
              <div className="h-full border-l flex items-center justify-center px-4 border-zinc-300">
                <Plus className="w-5 h-5 text-red-500" weight="bold" />
              </div>
            </Button>
          </div>

          <div className="space-y-4">
            {mealsForDay && mealsForDay.length > 0 ? (
              mealsForDay.map((meal) => (
                <MealCard
                  key={meal.horario_id}
                  meal={meal}
                  onEdit={() => handleOpenModal(meal)}
                  onDelete={() => setMealToDelete(meal)}
                />
              ))
            ) : (
              <div className="flex min-h-[300px] border border-zinc-700 rounded-xl flex-col items-center justify-center py-16 text-zinc-500">
                <div className="w-24 h-24 mb-8 relative">
                  <Image
                    src="/images/meals/bowl.svg"
                    alt="Empty state"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-xl mb-2 text-white font-semibold">
                  Nenhuma refeição cadastrada
                </h2>
                <p className="text-zinc-400 mb-10 max-w-xs text-center text-sm">
                  Adicione uma refeição para começar a controlar sua dieta
                </p>
                <Button
                  variant="secondary"
                  className="text-red-500 group bg-transparent hover:text-red-500/80 hover:bg-transparent pl-4 py-0 pr-0 gap-2"
                  onClick={() => handleOpenModal()}
                >
                  Nova refeição
                  <div className="h-full  flex items-center justify-center px-4 ">
                    <Plus
                      className="w-5 h-5 text-red-500 group-hover:text-red-500/80"
                      weight="bold"
                    />
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MealFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        initialData={selectedMeal}
      />

      <DeleteMealDialog
        open={!!mealToDelete}
        onOpenChange={(open) => !open && setMealToDelete(null)}
        meal={mealToDelete}
        onConfirm={() => {
          if (mealToDelete) {
            deleteMeal(mealToDelete.horario_id)
            toast.success('Refeição deletada com sucesso')
            setMealToDelete(null)
          }
        }}
      />
    </>
  )
}
