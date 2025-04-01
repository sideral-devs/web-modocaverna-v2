import { cn } from '@/lib/utils'
import { CloudUploadIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const Dropzone = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, title, ...props }, ref) => {
  const [file, setFile] = useState<
    (File & { preview: string | undefined }) | null
  >(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0]
      setFile(Object.assign(file, { preview: URL.createObjectURL(file) }))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop,
    maxFiles: 1,
    noKeyboard: true,
  })

  return (
    <div
      {...getRootProps({
        className: cn('flex w-full items-center gap-6', className),
      })}
    >
      <input {...getInputProps()} ref={ref} {...props} />
      {file && file.preview ? (
        <Image
          src={file.preview}
          alt="Imagem enviada"
          className="w-20 h-20 object-cover rounded-lg"
          width={80}
          height={80}
        />
      ) : (
        <button
          onClick={open}
          className="flex w-20 h-20 items-center justify-center bg-zinc-800 border border-primary border-dashed rounded-lg"
        >
          <CloudUploadIcon className="text-primary" size={32} />
        </button>
      )}
      <div className="flex flex-col gap-1">
        <p>
          {isDragActive
            ? 'Arraste a imagem para cá'
            : file
              ? file.name
              : title || 'Capa'}
        </p>
        <span className="text-xs text-zinc-400">
          Arraste ou clique ao lado para adicionar uma foto
        </span>
      </div>
    </div>
  )
})
Dropzone.displayName = 'Input'

export { Dropzone }
