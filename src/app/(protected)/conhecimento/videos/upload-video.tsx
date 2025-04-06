import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { CloudUploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const categories = {
  filmes: 'Filmes',
  series: 'Séries',
  documentarios: 'Documentários',
  podcast: 'Podcast',
  outros: 'Outros',
} as const

const schema = z.object({
  title: z
    .string({ required_error: 'Obrigatório' })
    .min(1, { message: 'Obrigatório' }),
  category: z.enum(Object.keys(categories) as [keyof typeof categories], {
    message: 'Obrigatório',
  }),
  url: z.string().nullable(),
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'desejos'], {
    message: 'Obrigatório',
  }),
})

type RegisterData = z.infer<typeof schema>

export function UploadVideoModalTrigger({
  children,
  refetch,
  onClose,
  mode = 'create',
  status,
  isOpen,
  videoData,
}: {
  children?: ReactNode
  mode: 'create' | 'edit'
  status?: 'pendente' | 'em_andamento' | 'concluido' | 'desejos'
  isOpen: boolean
  videoData?: Video
  refetch: () => void
  onClose: () => void
}) {
  const [preview, setPreview] = useState<string | null>(null)

  const form = useForm<RegisterData & { image: File | null }>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: 'filmes',
      url: '',
      status: 'desejos',
      image: null,
    },
  })

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = form

  useEffect(() => {
    if (videoData) {
      reset({
        title: videoData.titulo,
        category: (videoData.categorias?.[0] || 'filmes') as
          | 'filmes'
          | 'series'
          | 'documentarios'
          | 'podcast'
          | 'outros',
        url: videoData.link || '',
        status: videoData.status as
          | 'desejos'
          | 'pendente'
          | 'em_andamento'
          | 'concluido',
      })
      if (videoData.capa) {
        setPreview(env.NEXT_PUBLIC_PROD_URL + videoData.capa || null) // Atualiza a pré-visualização da imagem
      }
    }
  }, [videoData, reset])

  useEffect(() => {
    if (mode === 'create' && status) {
      setValue('status', status)
    }
  }, [mode, status, setValue])

  const image = watch('image')
  const category = watch('category')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      ['image/png', 'image/jpeg'].includes(file.type) &&
      file.size <= 3 * 1024 * 1024
    ) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
      setValue('image', file)
    } else {
      toast.error('Por favor, envie um arquivo PNG ou JPG de até 3MB.')
    }
  }

  const removeImage = () => {
    setPreview(null)
    setValue('image', null)
  }

  function closeAllPopovers() {
    document.querySelectorAll("[data-state='open']").forEach((el) => {
      ;(el as HTMLElement).click()
    })
  }

  function buildVideoPayload(data: RegisterData, preview: string | null) {
    const isBase64 = preview?.startsWith('data:image/')

    return {
      titulo: data.title,
      status: data.status,
      link: data.url,
      categorias: [data.category],
      ...(isBase64 || preview == null ? { capa: preview } : {}),
    }
  }

  async function handleRegister(data: RegisterData) {
    try {
      const payload = buildVideoPayload(data, preview)

      if (mode === 'create') {
        await api.post('/videos/store', payload)
        toast.success('Vídeo criado com sucesso!')
      } else if (mode === 'edit' && videoData) {
        await api.put(`/videos/update/${videoData.id}`, payload)
        toast.success('Vídeo atualizado com sucesso!')
      }

      removeImage()
      reset(
        {
          title: '',
          category: 'filmes',
          url: '',
          status: 'desejos',
        },
        {
          keepErrors: true,
          keepDirty: true,
        },
      )
      onClose()
      closeAllPopovers()
      refetch()
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-zinc-900">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit'
              ? 'Editar Vídeo'
              : status === 'desejos'
                ? 'Adicionar Vídeo na Lista de Desejos'
                : 'Adicionar Vídeo na Videoteca'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div className="flex flex-col px-4 py-8 gap-8 overflow-y-auto">
            <div className="flex w-full items-center gap-6">
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Imagem enviada"
                    className="w-20 h-20 object-cover rounded-lg"
                    width={80}
                    height={80}
                  />
                  <XIcon
                    className="absolute right-0 top-0 translate-x-1/2 translate-y-1/2 bg-primary rounded-full p-1 z-10 cursor-pointer"
                    onClick={removeImage}
                  />
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex w-20 h-20 items-center justify-center bg-zinc-800 border border-primary border-dashed rounded-lg cursor-pointer"
                >
                  <CloudUploadIcon className="text-primary" size={32} />
                </label>
              )}
              <div className="flex flex-col gap-1">
                <p className="truncate">{image ? image.name : 'Capa'}</p>
                <span className="text-xs text-zinc-400">
                  Clique ao lado para adicionar uma foto
                </span>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg"
                {...register('image')}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input placeholder="Insira o título" {...register('title')} />
                  {errors.title && (
                    <span className="text-red-400 text-xs">
                      {errors.title.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="category" className="text-sm font-medium">
                  Tipo
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Select
                    value={category}
                    defaultValue="filmes"
                    onValueChange={(val: RegisterData['category']) =>
                      setValue('category', val)
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 ">
                      {Object.entries(categories).map(([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <span className="text-red-400 text-xs">
                      {errors.category.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="url" className="text-sm font-medium">
                  Onde assistir
                </label>
                <div className="flex flex-col w-full gap-2">
                  <Input
                    placeholder="Ex: https://youtube.com/watch?v=asdi19d1"
                    {...register('url')}
                  />
                  {errors.url && (
                    <span className="text-red-400 text-xs">
                      {errors.url.message}
                    </span>
                  )}
                </div>
              </div>
              {mode === 'edit' && (
                <div className="flex flex-col w-full gap-3">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <div className="flex flex-col w-full gap-2">
                    <Select
                      defaultValue="desejos"
                      value={watch('status')}
                      onValueChange={(val: RegisterData['status']) => {
                        setValue('status', val)
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-lg border border-input bg-zinc-800 px-3 py-1 text-base font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 ">
                        <SelectItem
                          value="desejos"
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          Lista de desejos
                        </SelectItem>
                        <SelectItem
                          value="pendente"
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          Pendente
                        </SelectItem>
                        <SelectItem
                          value="em andamento"
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          Em andamento
                        </SelectItem>
                        <SelectItem
                          value="concluido"
                          className="w-full rounded text-zinc-400 hover:bg-red-100 hover:text-primary transition-all duration-300"
                        >
                          Concluído
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <span className="text-red-400 text-xs">
                        {errors.status.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FormProvider>
        <DialogFooter className="border-t p-4">
          <Button onClick={handleSubmit(handleRegister)} loading={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
