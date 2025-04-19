"use client";

import { Exercise } from "@/lib/api/exercises";
import { useMotionValue } from "framer-motion";
import { BicepsFlexed } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  workoutIndex: number;
  onEdit: () => void;
}

export function ExerciseCardHub({
  exercise,
  workoutIndex,
  onEdit,
}: ExerciseCardProps) {
  const y = useMotionValue(0);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
            <BicepsFlexed size={24} className="text-zinc-400" />
          </div>

          <div>
            <h4 className="text-zinc-300 font-medium">{exercise.nome}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-500">
            {exercise.series} séries x {exercise.repeticoes} repetições
          </p>
        </div>
      </div>
    </>
  );
}
