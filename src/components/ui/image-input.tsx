import { cn } from '@/lib/utils'
import { CloudUploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function ImageInput({
  onSave,
  customLabel,
  descriptionField = true,
  size,
  className,
  imageClassName,
  customId,
  initialPreview,
  position,
}: {
  onSave: Dispatch<SetStateAction<{ name: string; src: string }[]>>
  customLabel?: JSX.Element
  descriptionField?: boolean
  size?: number
  className?: string
  imageClassName?: string
  customId?: string,
  initialPreview?: string,
  position: number
}) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (initialPreview) setPreview(initialPreview)
    else setPreview(null)
  }, [initialPreview])

  const uuid = crypto.randomUUID()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      ['image/png', 'image/jpeg'].includes(file.type) &&
      file.size <= 3 * 1024 * 1024
    ) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreview(base64)
        onSave((prev) => [...prev, { name: file.name, src: base64 }])
      }
      reader.readAsDataURL(file)
      setImage(file)
    } else {
      toast.error('Por favor, envie um arquivo PNG ou JPG de até 3MB.')
    }
  }

  const removeImage = () => {
    onSave((prev) => {
      const newImages = [...prev]
      newImages[position] = null as any
      return newImages.filter(Boolean)
    })
    setPreview(null)
    setImage(null)
  }
  
  return (
    <div className={cn('flex items-center gap-6 group', className)}>
      {preview ? (
        <div
          className="relative"
          style={{
            width: size || 80,
            height: size || 80,
          }}
        >
          <Image
            src={preview}
            alt="Imagem enviada"
            className={cn('object-cover rounded-lg peer', imageClassName)}
            fill
          />
          <XIcon
            className="absolute hidden peer-hover:block group-hover:block right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-primary rounded-full p-1 z-10 cursor-pointer"
            style={{
              scale: Math.min(Math.max((size ?? 80) / 80, 0), 1.25),
            }}
            onClick={removeImage}
          />
        </div>
      ) : (
        customLabel || (
          <label
            htmlFor={uuid}
            className="flex w-20 h-20 items-center justify-center bg-zinc-800 border border-primary border-dashed rounded-lg cursor-pointer"
          >
            <CloudUploadIcon className="text-primary" size={32} />
          </label>
        )
      )}
      {descriptionField ? (
        <div className="flex flex-col gap-1">
          <p className="truncate">{image ? image.name : 'Capa'}</p>
          <span className="text-xs text-zinc-400">
            Clique ao lado para adicionar uma foto
          </span>
        </div>
      ) : (
        ''
      )}
      <input
        id={customId || uuid}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )
}
