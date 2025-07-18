import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChallengerStore } from '@/store/challenge'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { AlertOctagonIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  wish: z.string().min(2, { message: 'Obrigatório' }),
})

type FormData = z.infer<typeof schema>

export function SecondStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [images, setImages] = useState<{ name: string; src: string }[]>([])
  const { setWish, setInitialSituationPhotos } = useChallengerStore()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form

  function saveData(data: FormData) {
    setWish(data.wish)
    setInitialSituationPhotos(images.map((image) => image.src))
  }

  function handleBackStep(data: FormData) {
    saveData(data)
    onBack()
  }

  function handleSaveData(data: FormData) {
    saveData(data)
    onNext()
  }

  useEffect(() => {
    const saved = localStorage.getItem('challenge-storage')
    if (saved) {
      const parsed = JSON.parse(saved).state
      if (parsed.textarea_oque_deseja) {
        form.setValue('wish', parsed.textarea_oque_deseja)
      }
      if (parsed.initialSituationPhotos) {
        setImages(parsed.initialSituationPhotos)
      }
    }
  }, [])

  return (
    <FormProvider {...form}>
      <div className="flex flex-col w-full relative flex-1 items-center">
        <div className="flex flex-1 items-start pl-10 3xl:pb-8 pb-4 gap-16">
          <Image
            src={'/images/lobo/apontando.png'}
            alt="Capitão Caverna"
            width={228}
            height={374}
          />
          <div className="flex flex-col h-full items-center 3xl:gap-8 gap-4">
            <div className="flex flex-col relative w-[611px] 3xl:px-12 3xl:py-8 px-8 py-6 gap-6 border border-zinc-700 rounded-lg">
              <h1 className="3xl:text-xl text-lg">
                O que você deseja alcançar / como você deseja estar ao final dos
                40 dias do desafio?
              </h1>
              <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
                Por exemplo: “Vou dedicar todo meu tempo e energia à construção
                do projeto X. Em 40 dias, quero finalizar esse projeto, ter 10
                mil reais na minha conta e me tornar uma pessoa mais
                responsável, além de reduzir minha gordura corporal para 15%.”
              </p>
              <div className="w-full flex items-center 3xl:px-5 3xl:py-6  px-4 py-4 gap-6 bg-[#44430D80]/50 rounded-lg">
                <AlertOctagonIcon
                  className={clsx(
                    'text-yellow-400',
                    'w-10 h-10',
                    '3xl:w-16 3xl:h-16',
                  )}
                />
                <p className="text-yellow-400 3xl:text-base text-[0.85rem]">
                  Seja realista! Lembre-se: são 40 dias, não 4 anos. Evite criar
                  expectativas para algo impossível de realizar dentro dessa
                  janela de tempo. Foque no que é desafiador, mas alcançável.
                </p>
              </div>

              <Image
                src={'/images/triangle-balloon.svg'}
                width={54}
                height={14}
                alt="balloon"
                className="absolute -left-[54px] top-16"
              />
            </div>
            <div className="flex flex-col w-full max-w-lg flex-1 gap-4">
              <div className="flex flex-col gap-1">
                <Textarea
                  {...register('wish')}
                  rows={3}
                  maxLength={250}
                  className="scrollbar-minimal"
                  placeholder="Digite aqui"
                  autoCapitalize="sentences"
                />
                {errors.wish && (
                  <span className="text-red-400 text-xs">
                    {errors.wish.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <footer className="flex w-full  3xl:h-32 h-24 justify-center 3xl:items-end items-center  3xl:pb-11 gap-4 border-t">
          <Button
            onClick={handleSubmit(handleBackStep)}
            className="px-5"
            variant="outline"
          >
            Voltar
          </Button>
          <Button onClick={handleSubmit(handleSaveData)} className="px-5">
            Avançar
          </Button>
        </footer>
      </div>
    </FormProvider>
  )
}
