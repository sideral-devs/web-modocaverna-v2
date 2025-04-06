'use client'

import type React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { DraggableImage } from './draggable-image'

export interface ImageItem {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export function DreamboardMaker({
  year,
  startingContent = [],
  editable = true,
}: {
  year: number
  startingContent?: ImageItem[]
  editable?: boolean
}) {
  const [dreamBoardMessage, setDreamboardMessage] = useState('')
  const queryClient = useQueryClient()
  const [images, setImages] = useState<ImageItem[]>(startingContent)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)
  const handleReset = async () => {
    const rollback = images
    try {
      setImages([])
      const idsToDelete = images.map((i) => {
        return i.id
      })
      // setImages((prev) => prev.filter((img) => img.id !== id))
      await api.delete(`metas/delete-all-photos`, {
        data: { fotos: idsToDelete },
      })
      toast.success('Quadro Resetado com sucesso!')
      queryClient.refetchQueries({ queryKey: ['goals'] })
    } catch {
      toast.error('Não há Fotos para Apagar!')
      setImages(rollback)
    }
    closeDialog()
  }

  const getMessageForTime = (messages: string[]) => {
    const now = new Date()
    const minutesOfDay = now.getHours() * 60 + now.getMinutes()
    const index = Math.floor(minutesOfDay / 20) % messages.length
    return messages[index]
  }
  const messagesQuadroSonhos = [
    `Clique em 'Adicionar Imagem' para começar a criar seu quadro dos sonhos.`,
    'Adicione imagens que representem seus maiores desejos e metas.',
    'Seu quadro dos sonhos está vazio. Preencha-o com suas inspirações.',
    'Adicione imagens para começar a visualizar seus objetivos e conquistas.',
    `Clique em 'Adicionar Imagem' e comece a construir seu quadro dos sonhos.`,
    'Preencha seu quadro dos sonhos com imagens que refletem seu futuro ideal.',
  ]

  useEffect(() => {
    setDreamboardMessage(getMessageForTime(messagesQuadroSonhos))
    setInterval(() => {
      setDreamboardMessage(getMessageForTime(messagesQuadroSonhos))
    }, 1200000)
  }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const rollback = images
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const centerX = 0
          const centerY = 0
          const randomX = centerX
          const randomY = centerY

          const newImage: ImageItem = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            src: event.target.result as string,
            x: randomX,
            y: randomY,
            width: 200,
            height: 200,
            rotation: 0,
          }

          setImages((prev) => [...prev, newImage])
          api
            .post('/metas/upload', {
              ano: year,
              foto: newImage.src,
              tipo: 'quadro_dos_sonhos',
              rotation: newImage.rotation,
              width: String(newImage.width),
              height: String(newImage.height),
              x: String(newImage.x),
              y: String(newImage.y),
            })
            .then((res) => res.data)
            .then((inserted: { id: string }) => {
              setImages((prev) =>
                prev.map((img) =>
                  img.id === newImage.id ? { ...img, id: inserted.id } : img,
                ),
              )
              queryClient.refetchQueries({ queryKey: ['goal'] })
            })
            .catch((err) => {
              console.log(err)
              setImages(rollback)
            })
        }
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleImageUpdate(updatedImage: ImageItem) {
    const rollback = images
    try {
      setImages((prev) =>
        prev.map((img) => (img.id === updatedImage.id ? updatedImage : img)),
      )

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        await api.put('/metas/update-photo-setup/' + updatedImage.id, {
          foto: {
            foto: updatedImage.src,
            id: updatedImage.id,
            rotation: updatedImage.rotation,
            width: String(updatedImage.width),
            height: String(updatedImage.height),
            x: String(updatedImage.x),
            y: String(updatedImage.y),
          },
        })
      }, 500)
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setImages(rollback)
    }
  }

  async function handleDeleteImage(id: string) {
    const rollback = images
    try {
      setImages((prev) => prev.filter((img) => img.id !== id))
      await api.delete(`/metas/delete-photo/${id}`)
      queryClient.refetchQueries({ queryKey: ['goals'] })
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
      setImages(rollback)
    }
  }

  const exportBoard = async () => {
    if (!boardRef.current) return

    try {
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: null,
        scale: 2,
      })

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `dreamboard-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()
    } catch {
      toast.error('Não foi possível exportar a imagem')
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-8 w-full">
      <motion.div
        ref={boardRef}
        className="relative w-full max-h-[600px] flex-1  border rounded-lg overflow-hidden bg-zinc-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images.length === 0 && editable && (
          <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <div className="flex flex-row items-center justify-center gap-4">
              <Image
                src="/images/empty-states/empty_dream_board.png"
                alt="Nenhum objetivo encontrado"
                width={100}
                height={110}
                className="opacity-50"
              />
              <div className="flex flex-col gap-4 w-[40dvh]">
                <p className="text-center text-[13px] text-zinc-500">
                  {dreamBoardMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {images.map((image) => (
          <DraggableImage
            key={image.id}
            image={image}
            onUpdate={handleImageUpdate}
            onDelete={handleDeleteImage}
            editable={editable}
          />
        ))}
      </motion.div>
      {editable && (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Plus size={16} />
              Adicionar imagem
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-900 border rounded-xl"
              onClick={openDialog}
              disabled={images.length === 0}
            >
              Resetar
            </Button>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza disso?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação excluirá todas as imagens do seu Quadro.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={closeDialog}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Button
            onClick={exportBoard}
            className="flex items-center gap-2"
            disabled={images.length === 0}
          >
            <Image
              src="/icons/sonhos-e-metas/export-image.svg"
              alt="Download Image"
              width={30}
              height={30}
            />
            Exportar
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
            multiple
          />
        </div>
      )}
    </div>
  )
}
