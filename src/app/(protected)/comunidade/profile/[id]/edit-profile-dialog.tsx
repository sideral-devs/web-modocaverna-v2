'use client'
import { PhaseCounter } from '@/app/(public)/trial/sign-up/PhaseCounter'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar } from '@radix-ui/react-avatar'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Camera, Trash2 } from 'lucide-react'
import NextImage from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(customParseFormat)

const schema = z.object({
  biography: z.string().min(1, { message: 'A biografia é obrigatória' }),
  nickname: z.string().min(1, { message: 'O nome de usuário é obrigatório' }),

  instagram: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine(
      (value) => {
        if (value?.toLowerCase().includes('https://')) {
          return (
            z.string().url().safeParse(value.toLowerCase().trim()).success &&
            value.includes('instagram.com')
          )
        } else if (value) {
          return (
            z
              .string()
              .url()
              .safeParse('https://' + value.toLowerCase().trim()).success &&
            value.includes('instagram.com')
          )
        } else {
          return false
        }
      },
      {
        message:
          'A URL deve ser válida e do Instagram (ex: https://instagram.com/usuario)',
      },
    ),

  linkedin: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((value) => value?.toLowerCase().includes('linkedin.com'), {
      message:
        'A URL deve ser válida e do LinkedIn (ex: https://linkedin.com/in/usuario)',
    }),
})

type RegisterData = z.infer<typeof schema>

export function EditProfileDialog({
  refetch,
  profile,
  setIsOpen,
}: {
  refetch: () => void
  profile: UserProfile
  setIsOpen: (open: boolean) => void
}) {
  const [strength, setStrength] = useState(0)

  const form = useForm<RegisterData>({
    resolver: zodResolver(schema),
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)
  const [previewProfile, setPreviewProfile] = useState<string | null>(
    profile.foto_perfil
      ? `${env.NEXT_PUBLIC_PROD_URL}${profile.foto_perfil}`
      : null,
  )
  const [previewBanner, setPreviewBanner] = useState<string | null>(
    profile.banner ? `${env.NEXT_PUBLIC_PROD_URL}${profile.banner}` : '',
  )
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = form

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewBanner(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleEditBannerClick = () => {
    bannerFileInputRef.current?.click()
  }

  const handleRemoveBannerClick = () => {
    setPreviewBanner(null)
  }

  useEffect(() => {
    if (profile) {
      reset({
        biography: profile.biography || undefined,
        nickname: profile.nickname || undefined,
        instagram: profile.instagram || undefined,
        linkedin: profile.linkedin || undefined,
      })
      if (profile.banner) {
        setPreviewBanner(env.NEXT_PUBLIC_PROD_URL + profile.banner)
      } else if (profile.foto_perfil) {
        setPreviewProfile(env.NEXT_PUBLIC_PROD_URL + profile.foto_perfil)
      }
    }
  }, [profile, reset])

  function buildBookPayload(data: RegisterData, previewBanner: string | null) {
    const isBannerBase64 = previewBanner?.startsWith('data:image/')

    return {
      nickname: data.nickname,
      biography: data.biography,
      instagram: (data.instagram && data.instagram.startsWith('https://')
        ? data.instagram
        : 'https://' + data.instagram
      ).toLowerCase(),
      linkedin: (data.linkedin && data.linkedin.startsWith('https://')
        ? data.linkedin
        : 'https://' + data.linkedin
      ).toLowerCase()
    }
  }

  function buildUserImages() {
    const isBannerBase64 = previewBanner?.startsWith('data:image/');
    const isPhotoProfileBase64 = previewProfile?.startsWith('data:image/');
  
    let result ={
      ...(isBannerBase64 || previewBanner == null
        ? { banner: previewBanner }
        : {}),
        ...(isPhotoProfileBase64 || previewProfile == null
          ? { user_foto: previewProfile }
          : {}),
    };
  
  
    return result;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const cropSize = Math.min(img.width, img.height)

        canvas.width = cropSize
        canvas.height = cropSize

        const offsetX = (img.width - cropSize) / 2
        const offsetY = (img.height - cropSize) / 2

        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          cropSize,
          cropSize,
          0,
          0,
          cropSize,
          cropSize,
        )

        const croppedBase64 = canvas.toDataURL('image/png')
        setPreviewProfile(croppedBase64)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveClick = () => {
    setPreviewProfile(null)
  }

  async function updatePhotoProfile() {
    try {
      await api.put(
        '/users/update?save=true',
        buildUserImages(),
      )
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        if (err.response.data.status === 500)
          toast.error(
            'Ocorreu um erro ao atualizar a foto de perfil do usuário.',
          )
        else toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

  async function handleRegister(data: RegisterData) {
    try {
      const payload = buildBookPayload(data, previewBanner)
      await api.put(`/perfil-comunidade/update/${profile.id}`, payload)
      await updatePhotoProfile()

      refetch()
      setIsOpen(false)
      toast.success('Perfil atualizado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['user-profile-user'] })
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        if (err.response.data.status === 500)
          toast.error('Ocorreu um erro ao atualizar o perfil da comunidade.')
        else toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

  useEffect(() => {
    setStrength(0)

    if (profile.nickname) {
      setStrength((prev) => prev + 1)
    }

    if (profile.banner) {
      setStrength((prev) => prev + 1)
    }

    if (profile.foto_perfil) {
      setStrength((prev) => prev + 1)
    }

    if (profile.biography) {
      setStrength((prev) => prev + 1)
    }

    if (profile.instagram) {
      setStrength((prev) => prev + 1)
    }

    if (profile.linkedin) {
      setStrength((prev) => prev + 1)
    }
  }, [profile])

  return (
    <DialogContent className="max-h-[85%] bg-zinc-900 overflow-y-auto scrollbar-minimal">
      <DialogHeader>
        <DialogTitle>Editar Perfil Comunidade</DialogTitle>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="flex flex-col px-4 pb-8 gap-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {strength < 6 && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-400">
                  Complete seu perfil {Math.floor((strength / 6) * 100)}%
                </span>
                <PhaseCounter
                  total={6}
                  current={strength}
                  animate={{
                    backgroundColor: strength > 3 ? '#F9CB15' : '#EE4444',
                  }}
                />
              </div>
            )}
            <div className="relative h-52 w-full">
              <div className="relative h-40 bg-muted rounded-xl group">
                <NextImage
                  src={previewBanner || '/images/bg.webp'}
                  alt="Cover image"
                  width={600}
                  height={200}
                  className="w-full h-full object-cover rounded-xl"
                />

                {/* Overlay com botões (aparece no hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white"
                    onClick={handleEditBannerClick}
                    aria-label="Edit banner"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                  {previewBanner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={handleRemoveBannerClick}
                      aria-label="Remove banner"
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  )}
                </div>

                {/* Input escondido para upload do banner */}
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  onChange={handleBannerChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Container da foto de perfil (mantido como estava) */}
              <div className="relative -top-12 left-48 right-48 group cursor-pointer border-4 border-background rounded-full overflow-hidden h-24 w-24">
                {profile ? (
                  <>
                    <Avatar className="w-full h-full">
                      <AvatarImage src={previewProfile || undefined } alt="Profile picture" />
                      <AvatarFallback className="uppercase">
                        {profile.nickname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        onClick={handleEditClick}
                        aria-label="Edit profile picture"
                      >
                        <Camera className="h-6 w-6" />
                      </Button>
                      {previewProfile && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white"
                          onClick={handleRemoveClick}
                          aria-label="Remove profile picture"
                        >
                          <Trash2 className="h-6 w-6" />
                        </Button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex">
                      <Button variant="outline" onClick={handleEditClick}>
                        Editar
                      </Button>
                      {previewProfile && (
                        <Button variant="outline" onClick={handleRemoveClick}>
                          Remover
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <Skeleton className="absolute inset-0 rounded-full" />
                )}
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="nickname" className="text-sm font-medium">
                Nickname
              </label>
              <Input
                type="text"
                placeholder="Digite seu nickname"
                {...register('nickname')}
              />
              {errors.nickname && (
                <span className="text-red-300 text-xs">
                  {errors.nickname.message}
                </span>
              )}
            </div>

            <div className="flex flex-col w-full gap-3">
              <label htmlFor="biography" className="text-sm font-medium">
                Biografia
              </label>
              <div className="flex flex-col w-full gap-2">
                <Textarea
                  placeholder="Descreva em curtas palavras quem é você..."
                  rows={4}
                  maxLength={250}
                  {...register('biography')}
                />
                {errors.biography && (
                  <span className="text-red-400 text-xs">
                    {errors.biography.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="url" className="text-sm font-medium">
                Instagram
              </label>
              <div className="flex flex-col w-full gap-2">
                <Input
                  placeholder="Ex: https://www.instagram.com/modocaverna"
                  {...register('instagram')}
                />
                {errors.instagram && (
                  <span className="text-red-400 text-xs">
                    {errors.instagram.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <label htmlFor="url" className="text-sm font-medium">
                Linkedin
              </label>
              <div className="flex flex-col w-full gap-2">
                <Input
                  placeholder="Ex: https://linkedin.com/in/centralcaverna"
                  {...register('linkedin')}
                />
                {errors.linkedin && (
                  <span className="text-red-400 text-xs">
                    {errors.linkedin.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
      <DialogFooter className="border-t p-4">
        <Button onClick={handleSubmit(handleRegister)} loading={isSubmitting}>
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
