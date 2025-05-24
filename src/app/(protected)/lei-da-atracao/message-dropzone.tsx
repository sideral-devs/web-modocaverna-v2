'use client'

import { FileIcon, FileVideo, ImageIcon, UploadCloud, X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type FileWithPreview = {
  file: File
  preview: string | null
}

const acceptedFileTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'video/mp4': ['.mp4'],
}

export function MessageDropzone({
  saveFile,
}: {
  saveFile: (arg: File) => void
}) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const additionalInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setError(null)

    const newFiles: FileWithPreview[] = []

    Array.from(selectedFiles).forEach((selectedFile) => {
      const fileType = selectedFile.type
      if (!Object.keys(acceptedFileTypes).includes(fileType)) {
        setError(
          `Arquivo do tipo ${selectedFile.name.split('.').pop()} não é aceito. Formatos aceitos: jpg, jpeg, png, pdf ou mp4.`,
        )
        return
      }

      const preview = URL.createObjectURL(selectedFile)
      newFiles.push({ file: selectedFile, preview })
      saveFile(selectedFile)
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    handleFileChange(droppedFiles)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleAddFile = () => {
    additionalInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    const fileToRemove = files[index]
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const renderFilePreview = () => {
    if (files.length === 0) return null

    const fileItem = files[0]
    const fileType = fileItem.file.type

    if (fileType.startsWith('image/') || fileType === 'video/mp4') {
      return (
        <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
          {fileType.startsWith('image/') ? (
            <Image
              src={fileItem.preview || '/placeholder.svg'}
              alt={fileItem.file.name}
              className="object-contain"
              fill
            />
          ) : (
            <video
              src={fileItem.preview || undefined}
              controls
              className="w-full h-full"
            >
              Seu navegador não suporta a tag vídeo.
            </video>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => removeFile(0)}
          >
            <X className="h-4 w-4 mr-1" />
            Remover
          </Button>
        </div>
      )
    }
  }

  const shouldShowDropzone = () => {
    if (files.length === 0) return true
    const fileType = files[0].file.type
    return !(
      fileType.startsWith('image/') ||
      fileType === 'video/mp4' ||
      fileType === 'application/pdf'
    )
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-6 w-6 text-muted-foreground" />
    } else if (fileType === 'application/pdf') {
      return <FileIcon className="h-6 w-6 text-muted-foreground" />
    } else if (fileType === 'video/mp4') {
      return <FileVideo className="h-6 w-6 text-muted-foreground" />
    }
    return <FileIcon className="h-6 w-6 text-muted-foreground" />
  }

  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [])

  return (
    <div className="w-full">
      {shouldShowDropzone() && (
        <div
          className={cn(
            'border-2 aspect-video border-dashed rounded-lg p-6 transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25',
            'hover:border-primary/50 hover:bg-primary/5',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col flex-1 h-full items-center justify-center gap-4 text-center">
            <UploadCloud className="text-primary" />
            <div className="flex flex-col gap-2 max-w-80">
              <p className="text-xl">Arraste e solte seu arquivo </p>
              <p className="text-xs text-zinc-400 mt-1">
                Aperte o botão abaixo para escolher seu arquivo. (PNG, PDF, JPG,
                mp4, webm)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.mp4"
              className="hidden"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <Button onClick={handleButtonClick} className="mt-2">
              Escolher arquivo
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {renderFilePreview()}

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Arquivos selecionados</h3>
          <div className="flex flex-col gap-4">
            {files.map((fileItem, index) => (
              <div
                key={index}
                className="relative group border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {fileItem.preview &&
                  fileItem.file.type.startsWith('image/') ? (
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                      <Image
                        src={fileItem.preview || '/placeholder.svg'}
                        alt={fileItem.file.name}
                        className="h-full w-full object-contain"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded flex items-center justify-center bg-muted">
                      {getFileIcon(fileItem.file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(fileItem.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remover arquivo</span>
                  </Button>
                </div>
              </div>
            ))}
            <input
              ref={additionalInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.mp4"
              className="hidden"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={handleAddFile}
            >
              + Adicionar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
