import { Button } from '@/components/ui/button'
import { ImageInput } from '@/components/ui/image-input'
import { Textarea } from '@/components/ui/textarea'
import { useChallengerStore } from '@/store/challenge'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { AlertOctagonIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  wish: z.string().min(2, { message: 'Obrigatório' }),
})

type FormData = z.infer<typeof schema>

export function ThirdStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [images, setImages] = useState<{ name: string; src: string }[]>([])
  const { setReason, setInitialReasonPhotos } = useChallengerStore()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form

  function handleSaveData(data: FormData) {
    setReason(data.wish)
    setInitialReasonPhotos(images.map((image) => image.src))
    onNext()
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col  w-[140dvh] relative flex-1 items-start">
        <div className="flex flex-1 items-start pl-10 3xl:pb-8 pb-4 gap-16">
          <Image
            src={'/images/lobo/apresentando.webp'}
            alt="Capitão Caverna"
            width={250}
            height={374}
          />
          <div className="flex flex-col h-full items-center 3xl:gap-8 gap-4">
            <div className="flex flex-col relative w-[611px] 3xl:px-12 3xl:py-8 px-8 py-6 gap-6 border border-zinc-700 rounded-lg">
              <h1 className="3xl:text-xl text-lg">
                Descreva brevemente a sua situação atual. Quais desafios vem
                enfrentando? O que te trouxe até aqui?
              </h1>
              <p className="text-zinc-400 3xl:text-base text-[0.85rem]">
                Por exemplo: “Há 5 dias, estava com alguns amigos e todos
                falavam sobre suas conquistas. Foi quando percebi que estava
                ficando para trás e decidi que precisava mudar isso. Hoje, estou
                devendo 5 mil reais ao banco, meu casamento está à beira do fim,
                e não suporto mais minha rotina ou meu trabalho.”
              </p>
              <div className="w-full flex items-center 3xl:px-5 3xl:py-6  px-4 py-4 gap-6 bg-[#44430D80]/50 rounded-lg">
                <AlertOctagonIcon
                  className={clsx(
                    'text-yellow-400',
                    'w-4 h-4',
                    '3xl:w-6 3xl:h-6',
                  )}
                />
                <p className="text-yellow-400 text-xs 3xl:text-base text-[0.85rem]">
                  Seja honesto(a) e direto(a). Essa é uma excelente oportunidade
                  de autoanálise.
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
              <p className="text-xs">
                Faça um registro, de até 02 fotos, que representem a sua
                situação atual. (Opcional)
              </p>
              <div className="flex gap-2">
                <ImageInput
                  customId="image-upload-1"
                  customLabel={
                    <label
                      htmlFor="image-upload-1"
                      className="flex w-20 h-20 items-center justify-center bg-zinc-800 rounded-lg cursor-pointer"
                    >
                      <ImageIcon className="text-primary" />
                    </label>
                  }
                  descriptionField={false}
                  onSave={setImages}
                />
                <ImageInput
                  customId="image-upload-2"
                  customLabel={
                    <label
                      htmlFor="image-upload-2"
                      className="flex w-20 h-20 items-center justify-center bg-zinc-800 rounded-lg cursor-pointer"
                    >
                      <ImageIcon className="text-primary" />
                    </label>
                  }
                  descriptionField={false}
                  onSave={setImages}
                />
              </div>
            </div>
          </div>
        </div>
        <footer className="flex w-full  3xl:h-32 h-24 justify-center 3xl:items-end items-center  3xl:pb-11 gap-4 border-t">
          <Button onClick={onBack} className="px-5" variant="outline">
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
