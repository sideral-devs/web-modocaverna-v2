import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { api } from '@/lib/api'
import { useRef, useState } from 'react'

export function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/images/upload', formData)
    } catch (error) {
      console.error(error)
    }
    setIsUploading(false)
  }

  return (
    <DialogContent className="bg-zinc-900">
      <DialogHeader>
        <DialogTitle>Adicionar Imagem</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col px-4 py-8 gap-8 overflow-y-auto">
        {/* <Dropzone title="Imagem" /> */}
        <input accept="image/jpeg,image/png" multiple={false} type="file" />
      </div>
      <DialogFooter className="border-t p-4">
        <Button onClick={handleFileChange} variant="outline">
          Salvar
          {isUploading && '...'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
