/* eslint-disable camelcase */
import { Button } from '@/components/ui/button'
import { ImageInput } from '@/components/ui/image-input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useFinishChallengeStore } from '@/store/finish-challenge'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.locale('pt-br')

const schema = z.object({
  situation: z.string().min(2, { message: 'Obrigatório' }),
})

type FormData = z.infer<typeof schema>

export function FinalStepTwo({ onBack, challenge }: { onBack: () => void; challenge: Challenge }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { fotos_situacao_final, situacao_final, relato_conquistas, setRelatoConquistas, fotos_oque_motivou_final, setFotosOqueMotivouFinal } = useFinishChallengeStore()
  const [images, setImages] = useState<{ name: string; src: string }[]>([])
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form

  function handleBackStep (data: FormData){
    setFotosOqueMotivouFinal(images.map((image) => image.src))
    setRelatoConquistas(data.situation)
    onBack()
  }

  useEffect(() => {
    if (fotos_oque_motivou_final) {
      setImages(fotos_oque_motivou_final.map((src) => ({
        name: src.split('/').pop() || '',
        src,
      })));
    }
    if (relato_conquistas) {
      form.setValue('situation', relato_conquistas)
    }
  }, [fotos_oque_motivou_final, relato_conquistas])


  async function handleSaveData(data: FormData) {
    try {
      const fotosOqueMotivouFinal = images.map((image) => image.src)
      await api.put('/desafios/finish', {
        modalidade: 'cavernoso_40',
        situacao_final,
        fotos_situacao_final,
        relato_conquistas: data.situation,
        fotos_oque_motivou_final: fotosOqueMotivouFinal,
      })
      queryClient.invalidateQueries({ queryKey: ['challenge'] })
      router.replace('/desafio-caverna/concluido')
    } catch {
      toast.error('Não foi possível concluir esse desafio!')
    }
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col w-full items-center relative flex-1">
        <div className="flex flex-col flex-1 w-full max-w-3xl 2xl:max-w-4xl p-4 pb-8 gap-8">
          <div className="flex flex-col gap-4">
            <span className="flex w-fit text-[10px] px-3 py-1.5 bg-primary rounded-full uppercase">
              Relembre
            </span>
            <p className="text-xs">
              Confira seus registros feitos em{' '}
              <span className="text-zinc-400">
                {dayjs(challenge.created_at).format('DD [de] MMMM, YYYY[.]')}
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 gap-8">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <span className="flex w-fit text-[10px] px-3 py-1.5 border rounded-full uppercase">
                  Como se sentia
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 2 }, (_, index) => {
                    const photos = challenge.fotos_oque_motivou_inicial
                    const foto = photos ? photos[index] : undefined

                    return (
                      <div
                        key={'photo-' + index}
                        className="w-full h-[173px] border rounded-lg overflow-hidden relative"
                      >
                        <Image
                          src={
                            foto
                              ? env.NEXT_PUBLIC_PROD_URL + foto
                              : '/images/image-empty.png'
                          }
                          className="object-cover"
                          alt="Foto situação inicial"
                          draggable={false}
                          fill
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <Image
                    height={14}
                    width={20}
                    alt="Quote"
                    src={'/icons/quote-2.svg'}
                  />
                  <p>
                    Descreva, brevemente a sua situação atual. Quais desafios
                    vem enfrentando? O que te trouxe até aqui?
                  </p>
                </div>
                <p className="text-zinc-400">
                  {challenge.textarea_oque_motivou}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <span className="flex w-fit text-[10px] px-3 py-1.5 border rounded-full uppercase text-red-500 border-red-500">
                  Como se sente hoje?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <ImageInput
                    customId="image-upload-1"
                    customLabel={
                      <label
                        htmlFor="image-upload-1"
                        className="flex w-full h-[173px] items-center justify-center border rounded-lg cursor-pointer"
                      >
                        <ImageIcon className="text-primary" />
                      </label>
                    }
                    descriptionField={false}
                    size={173}
                    onSave={setImages}
                    initialPreview={images[0]?.src}
                    position={0}
                  />
                  <ImageInput
                    customId="image-upload-2"
                    customLabel={
                      <label
                        htmlFor="image-upload-2"
                        className="flex w-full h-[173px] items-center justify-center border rounded-lg cursor-pointer"
                      >
                        <ImageIcon className="text-primary" />
                      </label>
                    }
                    descriptionField={false}
                    size={173}
                    onSave={setImages}
                    initialPreview={images[1]?.src}
                    position={1}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <Image
                    height={14}
                    width={20}
                    alt="Quote"
                    src={'/icons/quote-2.svg'}
                  />
                  <p>
                    Como você se sente hoje em comparação ao que sentia ao
                    entrar na Caverna?{' '}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Textarea
                    {...register('situation')}
                    rows={4}
                    maxLength={250}
                    placeholder="Digite aqui"
                    autoCapitalize="sentences"
                  />
                  {errors.situation && (
                    <span className="text-red-400 text-xs">
                      {errors.situation.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex w-full h-32 justify-center items-end bg-black pb-11 gap-4 border-t">
        <Button onClick={handleSubmit(handleBackStep)} className="px-5" variant="outline">
            Voltar
          </Button>
          <Button
            onClick={handleSubmit(handleSaveData)}
            loading={isSubmitting}
            className="px-5"
          >
            Avançar
          </Button>
        </footer>
      </div>
    </FormProvider>
  )
}
