import { Button } from '@/components/ui/button'
import { DotsThree, Plus } from '@phosphor-icons/react'
import Image from 'next/image'
import { WEEK_DAYS } from '@/lib/constants'
import { useState } from 'react'

export default function Page() {
  const [selectedDay, setSelectedDay] = useState('Qui')
  return (
    <div className="mt-16 w-full">
      <h2 className="text-2xl font-medium mb-8">Organize suas refeições</h2>

      <div className="flex gap-4 w-full justify-between mb-8">
        {WEEK_DAYS.map((day) => (
          <button
            key={day.short}
            onClick={() => setSelectedDay(day.short)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            selectedDay === day.short
              ? 'bg-red-500 text-white'
              : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
          }
        `}
          >
            {day.short}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl text-zinc-400">Refeição de almoço</h3>
            <span className="text-sm text-zinc-600">12h30 - 14h10</span>
          </div>

          <Button variant="ghost" className="text-red-500 gap-2">
            <Plus className="w-5 h-5" />
            Novo exercício
          </Button>
        </div>

        <div className="space-y-3">
          {/* Meals Card */}
          <div />

          {/* Exercise Card */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                  <Image
                    src="/exercise-supino.png"
                    alt="Supino invertido"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium">Supino invertido</h4>
                  <p className="text-zinc-400">12 × 3 repetições</p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Carga atual · 10 KG
                  </p>
                </div>
              </div>

              <button className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors">
                <DotsThree className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
