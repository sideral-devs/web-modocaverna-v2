"use client";

import { Meal } from "@/lib/api/meals";
import { BowlFood } from "@phosphor-icons/react";
import { useMotionValue } from "framer-motion";


interface MealCardProps {
  meal: Meal;
  dayIndex: number;
  onEdit: () => void;
}

export function MealCardHub({
  meal,
  dayIndex,
  onEdit,
}: MealCardProps) {
  const y = useMotionValue(0);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
            <BowlFood weight="fill" size={24} className="text-zinc-400" />
          </div>

          <div>
            <h4 className="text-zinc-300 font-medium">{meal.nome_refeicao}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-500">
            {meal.hora_refeicao}
          </p>
        </div>
      </div>
    </>
  );
}
