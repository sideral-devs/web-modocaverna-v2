'use client'

import type React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ImageIcon, Smile, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '../ui/skeleton'
import EmojiPicker, {
  Theme,
  EmojiStyle,
  SkinTonePickerLocation,
  SuggestionMode,
  EmojiClickData,
} from 'emoji-picker-react'

import { emojiCategories, bannedEmojis } from '@/constants/emojiConfig'
import { AxiosError } from 'axios'

interface CreatePostFormProps {
  replyToId?: string
  placeholder?: string
}

export function CreatePostForm({
  replyToId,
  placeholder = 'Escreva alguma coisa',
}: CreatePostFormProps) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<
    'Oportunidades' | 'Indicações' | 'Experiência'
  >('Experiência')
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef(null)

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/perfil-comunidade/user')
      return response.data as UserProfile
    },
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !(emojiPickerRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setEmojiPickerIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (replyToId) {
        await api.post('/posts/store/comments', {
          content,
          category,
          midia: image ? [image] : undefined,
          post_id: replyToId,
        })
      } else {
        await api.post('/posts/store', {
          content,
          category,
          midia: image ? [image] : undefined,
        })
      }
      setContent('')
      setImage(null)
      queryClient.invalidateQueries({ queryKey: ['posts'] })

      if (replyToId) {
        queryClient.invalidateQueries({ queryKey: ['replies', replyToId] })
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err instanceof AxiosError && err.response?.data) {
        toast.error(err.response.data.message)
      } else {
        toast.error('O post não pode ser criado. Por favor, tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageClick = () => {
    // Trigger file input click
    fileInputRef.current?.click()
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        // Convert the file to base64
        const base64String = await convertToBase64(file)
        setImage(base64String)
      } catch (error) {
        console.error('Error converting image to base64:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removeImage = () => {
    setImage(null)
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Este método seta o emoji em qualquer posição do textarea
  const handleEmojiClick = (emoji: EmojiClickData) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const textBefore = content.substring(0, startPos)
    const textAfter = content.substring(endPos)

    const newText = textBefore + emoji.emoji + textAfter
    setContent(newText)

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        startPos + emoji.emoji.length
      textarea.focus()
    }, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b">
      <div className="flex gap-3">
        {user ? (
          <Avatar>
            <AvatarImage
              src={
                user
                  ? `${env.NEXT_PUBLIC_PROD_URL}${user.foto_perfil}`
                  : undefined
              }
            />
            <AvatarFallback className="uppercase">
              {user.nickname[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="w-10 h-10 rounded-full" />
        )}

        <div className="flex-1">
          <div className="flex flex-col gap-4 p-4 border rounded-xl">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="bg-transparent min-h-24 p-0 border-none shadow-none resize-none focus-visible:ring-0 text-base scrollbar-minimal"
            />
            {image && (
              <div className="relative mt-2 mb-3">
                <div className="rounded-lg overflow-hidden relative max-w-sm">
                  <Image
                    src={image || '/placeholder.svg'}
                    alt="Imagem selecionada"
                    width={400}
                    height={300}
                    className="object-cover max-h-80 w-auto"
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/80 text-white"
                    onClick={removeImage}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 relative">
            <div className="flex gap-1 items-center">
              <div className="relative">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-8 w-8 text-zinc-400"
                  onClick={() => setEmojiPickerIsOpen((prev) => !prev)}
                >
                  <Smile className="h-5 w-5" />
                </Button>

                {emojiPickerIsOpen && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute left-0 mt-2 z-50"
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={Theme.DARK}
                      emojiStyle={EmojiStyle.APPLE}
                      skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                      categories={emojiCategories}
                      suggestedEmojisMode={SuggestionMode.RECENT}
                      hiddenEmojis={bannedEmojis}
                      searchPlaceHolder="Procure por um emoji"
                      searchDisabled={true}
                      height={400}
                      previewConfig={{
                        showPreview: false,
                      }}
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 text-zinc-400"
                onClick={handleImageClick}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>

              {!replyToId && (
                <Select
                  value={category}
                  onValueChange={(value) =>
                    setCategory(
                      value as 'Oportunidades' | 'Indicações' | 'Experiência',
                    )
                  }
                >
                  <SelectTrigger className="w-[140px] bg-card rounded-lg text-zinc-400 h-8 text-xs">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Experiência">Experiência</SelectItem>
                    <SelectItem value="Indicações">Indicação</SelectItem>
                    <SelectItem value="Oportunidades">Oportunidade</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <Button
              type="submit"
              className="rounded-lg px-4"
              disabled={(!content.trim() && !image) || isUploading}
              loading={isSubmitting}
            >
              {replyToId ? 'Responder' : 'Postar'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
