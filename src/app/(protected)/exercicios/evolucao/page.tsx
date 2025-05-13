'use client'

import { useShape } from '@/hooks/queries/use-shape'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, BicepsFlexed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header, HeaderClose } from '@/components/header'

export default function ShapeEvolutionPage() {
  const { shapeRegistrations } = useShape()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [currentRegistrationIndex, setCurrentRegistrationIndex] = useState(
    (shapeRegistrations?.length || 1) - 1,
  )

  // Sort registrations by date in ascending order
  const sortedRegistrations = [...(shapeRegistrations || [])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  console.log(sortedRegistrations)
  const currentRegistration = sortedRegistrations[currentRegistrationIndex]
  const currentPhotos = currentRegistration?.fotos || []

  const handleNextPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === currentPhotos.length - 1 ? 0 : prev + 1,
      )
    }
  }

  const handlePrevPhoto = () => {
    if (currentPhotos.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? currentPhotos.length - 1 : prev - 1,
      )
    }
  }

  const handleNextRegistration = () => {
    setCurrentRegistrationIndex((prev) =>
      prev === sortedRegistrations.length - 1 ? 0 : prev + 1,
    )
    setCurrentPhotoIndex(0)
  }

  const handlePrevRegistration = () => {
    setCurrentRegistrationIndex((prev) =>
      prev === 0 ? sortedRegistrations.length - 1 : prev - 1,
    )
    setCurrentPhotoIndex(0)
  }

  if (!shapeRegistrations || shapeRegistrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-medium mb-4">Evolução do Shape</h1>
        <p className="text-zinc-400">
          Nenhum registro de shape encontrado. Registre seu primeiro shape para
          começar a acompanhar sua evolução.
        </p>
      </div>
    )
  }

  return (
    <>
      <Header className="fixed bg-black/50 backdrop-blur-sm z-50 py-4">
        <div className="flex w-fit items-center px-3 py-2 gap-1 border border-yellow-500 rounded-full">
          <span className="uppercase text-[10px] text-yellow-500 font-semibold">
            Evolução do Shape
          </span>
        </div>
        <HeaderClose to="/exercicios" pushTo="/exercicios" />
      </Header>

      <div className="min-h-screen pt-32 pb-[400px] bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-zinc-500 text-sm">
                {currentRegistration?.updated_at
                  ? `Registrado em · ${format(
                      new Date(currentRegistration.updated_at),
                      "dd 'de' MMMM',' yyyy 'às' HH:mm",
                      { locale: ptBR },
                    )}.`
                  : 'Não atualizadas'}
              </p>
              <h1 className="text-2xl font-semibold mt-2">Evolução do Shape</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevRegistration}
                className="text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <span className="text-sm text-zinc-400">
                {currentRegistrationIndex + 1} de {sortedRegistrations.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextRegistration}
                className="text-zinc-400 hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between mb-16 gap-4">
            <div className="relative w-1/2 border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
              {currentPhotos[currentPhotoIndex] ? (
                <>
                  <div className="absolute top-0 left-0 right-0 flex justify-between gap-1 p-3 z-50">
                    {currentPhotos.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 bg-white ${
                          index === currentPhotoIndex
                            ? 'opacity-100'
                            : 'opacity-40'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="relative w-full h-[456px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPhotoIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_PROD_URL}/${currentPhotos[currentPhotoIndex]}`}
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
                    Nenhuma foto cadastrada
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevPhoto}
                  className="text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPhoto}
                  className="text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="bg-zinc-800 w-1/2 rounded-lg p-6">
              <div className="space-y-8 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-yellow-500 font-medium mb-4">
                    Circunferência superior
                  </h2>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (D)</p>
                      <p className="text-sm">
                        {currentRegistration?.membros_superiores
                          .biceps_direito ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Bíceps (E)</p>
                      <p className="text-sm">
                        {currentRegistration?.membros_superiores
                          .biceps_esquerdo ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peitoral</p>
                      <p className="text-sm">
                        {currentRegistration?.membros_superiores.peito ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Ombro</p>
                      <p className="text-sm">
                        {currentRegistration?.membros_superiores.ombro ?? '-'}{' '}
                        cm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-yellow-500 w-full">
                      Circunferência inferior
                    </h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex mb-6 items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Glúteos</p>
                        <p className="text-sm">
                          {currentRegistration?.membros_inferiores.gluteos ??
                            '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (D)</p>
                        <p className="text-sm">
                          {currentRegistration?.membros_inferiores
                            .quadriceps_direito ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadríceps (E)</p>
                        <p className="text-sm">
                          {currentRegistration?.membros_inferiores
                            .quadriceps_esquerdo ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Quadril</p>
                        <p className="text-sm">
                          {currentRegistration?.membros_inferiores.quadril ??
                            '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (D)</p>
                        <p className="text-sm">
                          {currentRegistration?.membros_inferiores
                            .panturrilha_direita ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-zinc-400 text-sm">Panturrilha (E)</p>
                        <p className="text-sm">
                          {currentRegistration?.membros_inferiores
                            .panturrilha_esquerda ?? '-'}{' '}
                          cm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex mb-4 items-center justify-between">
                    <h3 className="text-yellow-500 w-full">Dados</h3>
                    <div className="w-full h-px bg-gradient-to-tl from-zinc-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="flex items-center px-4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">IMC</p>
                      <p
                        className={`text-sm ${
                          typeof currentRegistration?.imc === 'number' &&
                          currentRegistration.imc > 0
                            ? currentRegistration.imc >= 25
                              ? 'text-red-500'
                              : currentRegistration.imc < 18.5
                                ? 'text-red-500'
                                : 'text-green-500'
                            : 'text-zinc-400'
                        }`}
                      >
                        {typeof currentRegistration?.imc === 'number' &&
                        currentRegistration.imc > 0
                          ? currentRegistration.imc < 18.5
                            ? 'Abaixo do peso'
                            : currentRegistration.imc < 25
                              ? 'Peso normal'
                              : 'Sobrepeso'
                          : '-'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Altura</p>
                      <p className="text-sm">
                        {currentRegistration?.altura
                          ? currentRegistration.altura
                          : '-'}{' '}
                        cm
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-zinc-400 text-sm">Peso</p>
                      <p className="text-sm">
                        {currentRegistration?.peso ?? '-'} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
