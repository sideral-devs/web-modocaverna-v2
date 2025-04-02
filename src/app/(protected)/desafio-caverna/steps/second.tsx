import { Button } from '@/components/ui/button'
import { ImageInput } from '@/components/ui/image-input'
import { Textarea } from '@/components/ui/textarea'
import { useChallengerStore } from '@/store/challenge'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertOctagonIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
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

  function handleSaveData(data: FormData) {
    setWish(data.wish)
    setInitialSituationPhotos(images.map((image) => image.src))
    onNext()
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col w-[140dvh] relative flex-1 items-start">
        <div className="flex flex-1 items-start pl-10 pb-8 gap-16">
          <Image
            src={'/images/lobo/apontando.webp'}
            alt="Capitão Caverna"
            width={228}
            height={374}
          />
          <div className="flex flex-col h-full items-center gap-8">
            <div className="flex flex-col relative w-[611px] px-12 py-8 gap-6 border border-zinc-700 rounded-lg">
              <h1 className="text-xl">
                O que você deseja alcançar / como você deseja estar ao final dos
                40 dias do desafio?
              </h1>
              <p className="text-zinc-400">
                Por exemplo: “Vou dedicar todo meu tempo e energia à construção
                do projeto X. Em 40 dias, quero finalizar esse projeto, ter 10
                mil reais na minha conta e me tornar uma pessoa mais
                responsável, além de reduzir minha gordura corporal para 15%.”
              </p>
              <div className="w-full flex items-center px-5 py-6 gap-6 bg-[#44430D80]/50 rounded-lg">
                <AlertOctagonIcon className="text-yellow-400" size={32} />
                <p className="text-yellow-400 text-xs">
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
                  rows={4}
                  maxLength={250}
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
        <footer className="flex w-full h-32 justify-center items-end  pb-11 gap-4 border-t">
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
