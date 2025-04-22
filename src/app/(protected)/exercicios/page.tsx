"use client";

import { ExerciseCard } from "@/components/exercicios/exercicios-card";
import { WeightProgressIndicator } from "@/components/exercicios/exercicios-weight-progress-indicator";
import { ExerciciosCreateUpdate } from "@/components/exercicios/modals/exercicios-create-update";
import { Header, HeaderClose } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useWorkouts } from "@/hooks/queries/use-exercises";
import { useShape } from "@/hooks/queries/use-shape";
import type { Exercise, Workout } from "@/lib/api/exercises";
import { WEEK_DAYS } from "@/lib/constants";
import { Pencil, Plus, Smiley, SmileySad, Trash } from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, Reorder, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { BicepsFlexed } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface ShapeRegistration {
  shape_id: number;
  imc: number;
  altura: number;
  peso: number;
  texto_meta: string | null;
  classificacao: string;
  satisfeito_fisico: number;
  membros_superiores: {
    ombro: number | null;
    peito: number | null;
    bicepsD: number | null;
    bicepsE: number | null;
  };
  membros_inferiores: {
    gluteos: number | null;
    quadril: number | null;
    quadricepsD: number | null;
    quadricepsE: number | null;
    panturrilhaD: number | null;
    panturrilhaE: number | null;
  };
  fotos: string[] | null;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(
    WEEK_DAYS[new Date().getDay()].workoutIndex
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCreateUpdateModal, setisCreateUpdateModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { scrollY } = useScroll();

  const {
    workouts,
    isLoading: isLoadingWorkouts,
    reorderExercises,
    deleteWorkout,
  } = useWorkouts();


  const {
    shapeRegistrations,
    // hasRegistration,
    isLoading: isLoadingShape,
  } = useShape();

  const firstShapeRegistration = shapeRegistrations?.[0];
  const lastShapeRegistration =
    shapeRegistrations?.[shapeRegistrations.length - 1];
  console.log(
    "a",
    lastShapeRegistration
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  useEffect(() => {
    if (firstShapeRegistration?.fotos === null) {
      router.push("/exercicios/steps?step=1");
    }
  }, [firstShapeRegistration, isLoadingShape, router]);

  useEffect(() => {
    if (
      lastShapeRegistration?.fotos &&
      lastShapeRegistration.fotos.length > 0
    ) {
      const timer = setInterval(() => {
        setCurrentPhotoIndex(
          (prevIndex) => (prevIndex + 1) % lastShapeRegistration.fotos.length
        );
      }, 6000);

      return () => clearInterval(timer);
    }
  }, [lastShapeRegistration?.fotos]);

  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd 'de' MMMM, yyyy", {
    locale: ptBR,
  });

  // Get workouts for the selected day
  const currentWorkouts =
    workouts?.filter((workout: Workout) => workout.indice === selectedDay) ||
    [];

  const handleDeleteWorkout = async (workout: Workout) => {
    setWorkoutToDelete(workout);
  };

  const confirmDeleteWorkout = async () => {
    if (!workoutToDelete) return;

    try {
      await deleteWorkout(workoutToDelete.ficha_id);
      setWorkoutToDelete(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  if (isLoadingWorkouts || isLoadingShape) {
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
    );
  }

  return (
    <>
      <motion.div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        animate={{
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <Header className="fixed bg-black/50 backdrop-blur-sm z-50 py-4">
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
            <span className="uppercase text-[10px] text-yellow-500 font-semibold">
              Exercícios
            </span>
          </div>
          <HeaderClose />
        </Header>
      </motion.div>

      <div className="min-h-screen pt-32 pb-[400px] bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="mb-8">
              <p className="text-zinc-500 text-sm">
                Última atualização · {formattedDate}
              </p>
              <h1 className="text-2xl font-semibold mt-2">Registro de Shape</h1>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push("/exercicios/atualizar-medidas")}
            >
              <Pencil weight="fill" size={20} />
              Atualizar medidas
            </Button>
          </div>

          <div className="flex justify-between mb-16 gap-4">
            <div className="relative w-1/2 border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
              
              {lastShapeRegistration?.fotos?.[0] ? (
                <>
                  <div className="absolute top-0 left-0 right-0 flex justify-between gap-1 p-3 z-50">
                    {lastShapeRegistration.fotos.map(
                      (_: string, index: number) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 bg-white ${
                            index <= currentPhotoIndex
                              ? "opacity-100"
                              : "opacity-40"
                          }`}
                          aria-label={`Photo ${index + 1} of ${lastShapeRegistration.fotos.length}`}
                        />
                      )
                    )}
                  </div>

                  <div className="relative w-full h-[456px]">
                    <AnimatePresence
                      initial={false}
                      mode="wait"
                      custom={currentPhotoIndex}
                    >
                      <motion.div
                        key={currentPhotoIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_PROD_URL}/${lastShapeRegistration.fotos[currentPhotoIndex]}`}
                          alt="Foto do corpo"
                          width={600}
                          height={600}
                          className="w-full h-[456px] object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />
                </>
              ) : (
                <div className="flex items-center flex-col gap-4 justify-center h-[456px]">
                  <BicepsFlexed size={100} className="text-zinc-500" />
                  <p className="text-zinc-500 text-sm">
                    {" "}
                    Nenhuma foto cadastrada{" "}
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <span
                  className={`flex items-center gap-2 text-base ${lastShapeRegistration?.nivel_satisfacao === "Satisfeito" ? "text-green-500" : "text-red-500"}`}
                >
                  {lastShapeRegistration?.nivel_satisfacao === "Satisfeito" ? (
                    <Smiley weight="bold" size={24} />
                  ) : (
                    <SmileySad weight="bold" size={24} />
                  )}
                  {lastShapeRegistration?.nivel_satisfacao}
                </span>
              </div>

              <Button
                size="sm"
                className="absolute bottom-2 left-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                onClick={() =>
                  router.push("/exercicios/atualizar-medidas?photos=true")
                }
              >
                Atualizar fotos
              </Button>
            </div>

            <div className="bg-zinc-800 w-1/2 rounded-lg p-6">
              <div className="space-y-8 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-red-500 font-medium mb-4">
                    Circunferência superior
                  </h2>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (D)</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores
                          .biceps_direito ?? "-"}{" "}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (E)</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores
                          .biceps_esquerdo ?? "-"}{" "}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peitoral</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores.peito ?? "-"}{" "}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Ombro</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.membros_superiores.ombro ?? "-"}{" "}
                        cm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-red-500 w-full">
                      Circunferência inferior
                    </h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex mb-6 items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Glúteos</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores.gluteos ??
                            "-"}{" "}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (D)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .quadriceps_direito ?? "-"}{" "}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (E)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .quadriceps_esquerdo ?? "-"}{" "}
                          cm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadril</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores.quadril ??
                            "-"}{" "}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (D)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .panturrilha_direita ?? "-"}{" "}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (E)</p>
                        <p className="text-sm">
                          {lastShapeRegistration?.membros_inferiores
                            .panturrilha_esquerda ?? "-"}{" "}
                          cm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-red-500 w-full">Dados</h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">IMC</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.imc
                          ? lastShapeRegistration.imc.toFixed(1)
                          : "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Altura</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.altura
                          ? lastShapeRegistration.altura
                          : "-"}{" "}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peso</p>
                      <p className="text-sm">
                        {lastShapeRegistration?.peso ?? "-"} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <WeightProgressIndicator
            currentWeight={lastShapeRegistration?.peso || 0}
            targetWeight={Number(lastShapeRegistration?.peso_meta) || 0}
          />

          {/* Workouts section */}
          <div className="mt-16 w-full">
            <div className="flex items-center mb-8 justify-between">
              <h2 className="text-2xl font-medium">Organize seus treinos</h2>
              <Button
                variant="secondary"
                className="text-zinc-500 pl-4 py-0 pr-0 gap-2"
                onClick={() => {
                  setEditingWorkout(null);
                  setisCreateUpdateModal(true);
                }}
              >
                Novo treino
                <div className="h-full border-l flex items-center justify-center px-4 border-zinc-300">
                  <Plus className="w-5 h-5 text-red-500" weight="bold" />
                </div>
              </Button>
            </div>

            <div className="flex gap-4 w-full justify-between mb-8">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day.short}
                  onClick={() => setSelectedDay(day.workoutIndex)}
                  className={`px-6 py-4 w-full rounded-lg text-base font-medium transition-colors
                  ${
                    selectedDay === day.workoutIndex
                      ? "bg-red-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }
                `}
                >
                  {day.short}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {currentWorkouts.length > 0 ? (
                currentWorkouts.map((workout) => (
                  <div key={workout.ficha_id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base text-zinc-300">
                          {workout.titulo}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setisCreateUpdateModal(true);
                            setEditingWorkout(workout);
                          }}
                          className="bg-zinc-700 hover:bg-red-800 px-2 py-1 gap-2"
                        >
                          Editar treino
                          <Pencil weight="fill" size={20} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteWorkout(workout)}
                          variant="destructive"
                          className="bg-transparent aspect-square hover:bg-red-900 p-2"
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    </div>

                    {workout.exercicios.length > 0 && (
                      <Reorder.Group
                        axis="y"
                        values={workout.exercicios}
                        onReorder={(newExercises: Exercise[]) =>
                          reorderExercises({
                            workoutIndex: workout.indice,
                            exerciseIndices: newExercises.map((e) => e.indice),
                          })
                        }
                        className="space-y-6"
                      >
                        {workout.exercicios.map((exercise: Exercise) => (
                          <ExerciseCard
                            key={exercise.indice}
                            exercise={exercise}
                            workoutIndex={workout.indice}
                            onEdit={() => {
                              setEditingExercise(exercise);
                              setisCreateUpdateModal(true);
                            }}
                          />
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <p>Nenhum treino cadastrado para este dia</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCreateUpdateModal && (
        <ExerciciosCreateUpdate
          isOpen={isCreateUpdateModal || !!editingExercise}
          onClose={() => {
            setisCreateUpdateModal(false);
            setEditingExercise(null);
          }}
          workout={editingWorkout || undefined}
        />
      )}

      <Dialog
        open={!!workoutToDelete}
        onOpenChange={() => setWorkoutToDelete(null)}
      >
        <DialogContent className="overflow-hidden">
          {/* <DialogHeader className="text-left flex">
            <h2 className="text-red-500 text-left">Excluir treino</h2>
           
          </DialogHeader> */}
          <DialogHeader className="p-4 relative w-full z-10">
            <DialogTitle className="flex pt-2 justify-between items-center w-full">
              Excluir treino
            </DialogTitle>
            <DialogDescription className="pt-4">
              Tem certeza que deseja excluir o treino{" "}
              <span className="text-red-500 font-bold">
                &ldquo;{workoutToDelete?.titulo}&rdquo;
              </span>{" "}
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end p-4 pt-0">
            <Button
              variant="outline"
              onClick={() => setWorkoutToDelete(null)}
              className="bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteWorkout}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
