'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useUser } from '@/hooks/queries/use-user'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { dateMask } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectValue } from '@radix-ui/react-select'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { AlertTriangleIcon, Crown, Pen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { UpdatePasswordDialogTrigger } from './UpdatePasswordDialog'
import ProfilePictureDialog from './profile-picture-dialog'

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

const schema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  nickname: z.string().min(1, { message: 'Nome de usuário é obrigatório' }),
  email: z.string().email().min(1, { message: 'Email é obrigatório' }),
  telefone: z.string().min(1, { message: 'Celular é obrigatório' }),
  birthdate: z
    .string()
    .refine(
      (value) => {
        return dayjs(value, 'DD/MM/YYYY', true).isValid()
      },
      {
        message: 'Data inválida.',
      },
    )
    .nullable(),
  gender: z.string(),
})

type UserData = z.infer<typeof schema>

export default function Page() {
  const [profilePictureOpen, setProfilePictureOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userBanner, setUserBanner] = useState<string | null>(null)
  const { data: user } = useUser()
  const form = useForm<UserData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = form

  async function handleEditUser(data: UserData) {
    try {
      await api.put('/users/update?save=true', {
        name: data.name,
        nickname: data.nickname,
        telefone: data.telefone,
        data_nascimento: data.birthdate
          ? dayjs(data.birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss')
          : null,
        sexo: data.gender,
      })
      setIsEditing(false)
      toast.success('Dados atualizados!')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const responseData = err.response.data

        if (responseData.status === 422 && responseData.error) {
          const fieldErrors = responseData.error

          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (
              field === 'name' ||
              field === 'nickname' ||
              field === 'email' ||
              field === 'telefone'
            ) {
              setError(field as 'name' | 'nickname' | 'email' | 'telefone', {
                message: (messages as string[])[0],
              })
            }
          })
        } else {
          toast.error(responseData.message || 'Erro inesperado ao atualizar.')
        }
      } else {
        toast.error('Não foi possível atualizar os dados!')
      }
    }
  }

  useEffect(() => {
    if (user) {
      setUserBanner(
        user.banner
          ? env.NEXT_PUBLIC_PROD_URL + user.banner
          : '/images/perfil/background_perfil.png',
      )
      form.reset({
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        telefone: user.telefone,
        birthdate: user.data_nascimento
          ? dayjs(user.data_nascimento).format('DD/MM/YYYY')
          : null,
        gender: user.sexo || 'Prefiro não Declarar',
      })
    }
  }, [user])

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col col-span-3 gap-10">
      <h1 className="font-semibold">Informações da conta</h1>
      <section className="flex flex-col w-full gap-1">
        <div
          className="flex flex-col w-full p-10 pb-12 gap-6 bg-gradient-to-b from-[#353535] to-[#212121] rounded-lg"
          style={{
            backgroundImage: ` url(${userBanner})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="relative w-fit">
            <Avatar className="w-[72px] h-[72px] ">
              <AvatarImage
                src={`${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}`}
              />
              <AvatarFallback>
                <div className="flex relative w-[72px] h-[72px] items-center justify-center bg-zinc-800 px-3 rounded-full cursor-pointer">
                  <span className="text-4xl text-zinc-500 uppercase">
                    {user.name[0]}
                  </span>
                </div>
              </AvatarFallback>
            </Avatar>
            {/* <Image
                width={72}
                height={72}
                className="rounded-full"
                objectFit="cover"
                objectPosition="center"
                alt="Foto do usuário"
              /> */}
            <button
              className="flex absolute items-center justify-center right-0 bottom-0 w-5 h-5 bg-primary rounded-full"
              onClick={() => setProfilePictureOpen(true)}
            >
              <Pen size={10} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h2>{user.name}</h2>
            <span className="text-xs">
              <span className="text-zinc-500">Membro desde</span>{' '}
              {dayjs(user.data_de_compra).format('DD [de] MMMM[,] YYYY')}
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-center p-3 gap-2 bg-zinc-800 rounded-lg">
          <Crown strokeWidth={0} fill="#FA913C" />
          <p className="text-xs">
            {user.plan === 'TRIAL' ? 'Experiência' : 'Assinatura'}{' '}
            <span className="text-[#FA913C] lowercase">{user.plan}</span> ·{' '}
            <span className="text-zinc-500">
              {user.plan === 'TRIAL' ? 'Expira em' : 'Renovação em'}{' '}
              {dayjs(user.data_de_renovacao).isValid()
                ? dayjs(user.data_de_renovacao).format('DD [de] MMMM[,] YYYY')
                : 'Indefinida'}
            </span>
          </p>
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <FormProvider {...form}>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm">Dados pessoais</h2>
              <span className="text-xs text-zinc-500">
                Insira as informações sobre você
              </span>
            </div>
            {isEditing ? (
              <Button
                size="sm"
                loading={isSubmitting}
                onClick={handleSubmit(handleEditUser)}
              >
                Atualizar Dados
              </Button>
            ) : (
              <Button
                size="sm"
                loading={isSubmitting}
                onClick={() => setIsEditing(true)}
              >
                Alterar Dados
              </Button>
            )}
          </div>
          {(!user.sexo || !user.data_nascimento) && (
            <div className="flex w-full items-center gap-4 px-5 py-4 bg-red-900 rounded-lg">
              <AlertTriangleIcon stroke="#7f1d1d" fill="var(--primary)" />
              <p className="text-xs flex-1">
                Complete os seus dados e ganhe pontos para o Ranking de
                interatividade e descontos exclusivos na Loja Caverna
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="name" className="text-xs text-zinc-500">
                Nome completo
              </label>
              <Input {...register('name')} disabled={!isEditing} />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="nickname" className="text-xs text-zinc-500">
                Nome de usuário
              </label>
              <Input {...register('nickname')} disabled={!isEditing} />
              {errors.nickname && (
                <span className="text-red-500 text-xs">
                  {errors.nickname.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="email" className="text-xs text-zinc-500">
                Email
              </label>
              <Input {...register('email')} disabled={!isEditing} />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="phone" className="text-xs text-zinc-500">
                WhatsApp
              </label>
              <Input {...register('telefone')} disabled={!isEditing} />
              {errors.telefone && (
                <span className="text-red-500 text-xs">
                  {errors.telefone.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="gender" className="text-xs text-zinc-500">
                Gênero
              </label>
              <Select
                defaultValue={user.sexo || 'Prefiro não Declarar'}
                onValueChange={(val) => setValue('gender', val)}
              >
                <SelectTrigger
                  className="h-11 w-full rounded-lg border border-input bg-zinc-800"
                  disabled={!isEditing}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                  <SelectItem value="Prefiro não Declarar">
                    Prefiro não Declarar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <label htmlFor="birthdate" className="text-xs text-zinc-500">
                Data de nascimento
              </label>
              <Input
                {...register('birthdate')}
                disabled={!isEditing}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('birthdate', dateMask(value))
                }}
              />
            </div>
          </div>
        </FormProvider>
      </section>
      <div className="w-full h-[1px] bg-zinc-700" />
      <section className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Senha</h2>
          <span className="text-xs text-zinc-500">
            Por favor, insira sua nova senha para atualizá-la.
          </span>
        </div>
        <UpdatePasswordDialogTrigger />
      </section>
      {/* <div className="w-full h-[1px] bg-zinc-700" /> */}
      {/* <section className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Cancelar assinatura</h2>
          <span className="text-xs text-zinc-500">
            Aperte no botão ao lado para cancelar sua assinatura
          </span>
        </div>
        <CancelAccountDialogTrigger />
      </section> */}
      <ProfilePictureDialog
        open={profilePictureOpen}
        onOpenChange={setProfilePictureOpen}
        currentImage={
          user.user_foto ? `${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}` : null
        }
        user={user}
      />
    </div>
  )
}
