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
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { CloudUploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React, {
  ReactNode,
  useState,
  useEffect,
  KeyboardEventHandler,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { CategorySelect } from '@/components/ui/reactSelect2'
import { env } from '@/lib/env'

const schema = z.object({
  title: z
    .string({ required_error: 'Obrigatório' })
    .min(1, { message: 'Obrigatório' }),

  category: z
    .string({ required_error: 'Obrigatório' })
    .array()
    .min(1, { message: 'Um curso pode possuir no mínimo 1 categoria' })
    .max(5, { message: 'Um curso pode possuir no máximo 5 categorias' }),

  url: z.string().nullable(),

  status: z.enum(['desejos', 'pendente', 'em_andamento', 'concluido'], {
    message: 'Categoria inválida.',
  }),
})

type RegisterData = z.infer<typeof schema>

interface Option {
  readonly label: string
  readonly value: string
}

export function UploadCourseModalTrigger({
  children,
  refetch,
  onClose,
  status,
  mode = 'create',
  isOpen,
  courseData,
}: {
  children?: ReactNode
  mode: 'create' | 'edit'
  status?: 'desejos' | 'pendente' | 'em_andamento' | 'concluido'
  isOpen: boolean
  courseData?: Course
  refetch: () => void
  onClose: () => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [valueSelect, setValueSelect] = useState<readonly Option[]>([])

  const form = useForm<RegisterData & { image: File | null }>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      category: [],
      url: '',
      status: 'desejos', // Valor padrão
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
    if (courseData) {
      reset({
        title: courseData.titulo,
        category: courseData.categorias || [],
        url: courseData.link || '',
        status: courseData.status as
          | 'desejos'
          | 'pendente'
          | 'em_andamento'
          | 'concluido',
      })
      if (courseData.categorias) {
        const categories = courseData.categorias.map((cat) => ({
          label: cat,
          value: cat,
        }))
        setValueSelect(categories)
      }
      if (courseData.capa) {
        setPreview(env.NEXT_PUBLIC_PROD_URL + courseData.capa || null) // Atualiza a pré-visualização da imagem
      }
    }
  }, [courseData, reset])

  useEffect(() => {
    if (mode === 'create' && status) {
      setValue('status', status)
    }
  }, [mode, status, setValue])

  function onChangeSelect(newValue: readonly Option[]) {
    setValueSelect(newValue)
    setValue(
      'category',
      newValue.map((item) => item.value) as RegisterData['category'],
    )
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setCategoryInSelect(inputValue)
        setInputValue('')
        event.preventDefault()
    }
  }

  function setCategoryInSelect(value: string) {
    const exists = valueSelect.some(
      (option) => option.label.toLowerCase() === value.toLowerCase(),
    )
    if (!exists && valueSelect.length <= 4) {
      const newValue = [...valueSelect, { label: value, value }]
      setValueSelect(newValue)
      setValue(
        'category',
        newValue.map((item) => item.value) as RegisterData['category'],
      )
    }
  }

  const image = watch('image')

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
      toast.warning('Por favor, envie um arquivo PNG ou JPG de até 3MB.')
    }
  }

  const removeImage = () => {
    setPreview(null)
    setValue('image', null)
  }

  function buildCoursePayload(data: RegisterData, preview: string | null) {
    const isBase64 = preview?.startsWith('data:image/')

    return {
      titulo: data.title,
      status: data.status,
      link: data.url,
      categorias: data.category,
      ...(isBase64 || preview === null ? { capa: preview } : {}),
    }
  }

  function closeAllPopovers() {
    document.querySelectorAll("[data-state='open']").forEach((el) => {
      ;(el as HTMLElement).click()
    })
  }

  function handleBlur() {
    if (!inputValue) return
    setCategoryInSelect(inputValue)
    setInputValue('')
  }

  async function handleRegister(data: RegisterData) {
    try {
      const payload = buildCoursePayload(data, preview)

      if (mode === 'create') {
        await api.post('/cursos/store', payload)
        toast.success('Curso criado com sucesso!')
      } else if (mode === 'edit' && courseData) {
        await api.put(`/cursos/update/${courseData.id}`, payload)
        toast.success('Curso atualizado com sucesso!')
      }

      removeImage()
      reset(
        {
          title: '',
          category: [],
          url: '',
          status: 'desejos',
        },
        {
          keepErrors: true,
          keepDirty: true,
        },
      )
      setValueSelect([])
      onClose()
      closeAllPopovers()
      refetch()
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Não foi possível salvar o curso.')
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
              ? 'Editar Curso'
              : status === 'desejos'
                ? 'Adicionar Curso na Lista de Desejos'
                : 'Adicionar Curso em Meus Cursos'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(handleRegister)}>
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
                    <Input
                      placeholder="Insira o título"
                      {...register('title')}
                    />
                    {errors.title && (
                      <span className="text-red-400 text-xs">
                        {errors.title.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-full gap-3">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoria
                  </label>
                  <div className="flex flex-col w-full gap-2">
                    <CategorySelect
                      inputValue={inputValue}
                      valueSelect={valueSelect}
                      onInputChange={(newValue) => setInputValue(newValue)}
                      onChange={(newValue) => onChangeSelect(newValue)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                      placeholder="Pressione Enter para adicionar uma nova categoria..."
                    />
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
                        value={watch('status')}
                        onValueChange={(val: RegisterData['status']) =>
                          setValue('status', val)
                        }
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
                            value="em_andamento"
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
            <DialogFooter className="border-t p-4">
              <Button type="submit" loading={isSubmitting}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
