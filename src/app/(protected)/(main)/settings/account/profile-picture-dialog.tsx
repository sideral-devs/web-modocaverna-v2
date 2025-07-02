'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Camera, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'

interface ProfilePictureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentImage: string | null
  user: User
}

export default function ProfilePictureDialog({
  open,
  onOpenChange,
  currentImage,
  user,
}: ProfilePictureDialogProps) {
  const queryClient = useQueryClient()
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage)
  const [isEdited, setIsEdited] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const userInitial = user ? user.name.charAt(0).toUpperCase() : 'U'

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
        setPreviewImage(croppedBase64)
        setIsEdited(true)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveClick = () => {
    setPreviewImage(null)
    setIsEdited(true)
  }

  async function handleSave() {
    setIsUploading(true)
    try {
      await api.put('/users/update?save=true', {
        user_foto: previewImage,
      })
      toast.success('Foto de Perfil atualizada!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      onOpenChange(false)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewImage(currentImage)
    setIsEdited(false)
    onOpenChange(false)
  }

  useEffect(() => {
    if (!open) {
      setPreviewImage(currentImage)
      setIsEdited(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Foto de Perfil</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative group">
            <Avatar className="h-32 w-32">
              {previewImage ? (
                <AvatarImage src={previewImage} alt="Profile picture" />
              ) : (
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={handleEditClick}
                aria-label="Edit profile picture"
              >
                <Camera className="h-6 w-6" />
              </Button>
              {previewImage && (
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
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEditClick}>
              Editar
            </Button>
            {previewImage && (
              <Button variant="outline" onClick={handleRemoveClick}>
                Remover
              </Button>
            )}
          </div>
        </div>
        <DialogFooter className="p-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isEdited}
            loading={isUploading}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
