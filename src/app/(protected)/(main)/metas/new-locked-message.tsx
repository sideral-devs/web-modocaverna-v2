'use client'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CalendarIcon, MailIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { MessageDropzone } from './message-dropzone'
import { NewLockedMessageEditor } from './new-locked-message-editor'

dayjs.extend(customParseFormat)

export function NewLockedMessageDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState(dayjs().add(1, 'day').toDate())
  const [savedFile, setSavedFile] = useState<File | null>()
  const [savedContent, setSavedContent] = useState<{
    conteudo: string
    descricao: string
  } | null>(null)

  const resetForm = () => {
    setDate(dayjs().add(1, 'day').toDate())
    setSavedContent(null)
    setIsSubmitting(false)
  }
  async function handleRegister() {
    if (!savedContent) return
    setIsSubmitting(true)
    try {
      const res = await api.post('/locked-messages/store', {
        conteudo: savedContent.conteudo,
        descricao: savedContent.descricao,
        data_abertura: dayjs(date).format('YYYY-MM-DD[T]HH:mm:ss'),
        data_fechamento: dayjs().format('YYYY-MM-DD[T]HH:mm:ss'),
        titulo: savedContent.descricao,
      })

      const sentCard = res.data as { id: number }
      const formData = new FormData()
      if (savedFile) {
        formData.append('file', savedFile)
      }
      if (formData.get('file') !== null) {
        await api
          .post('/locked-messages/upload/' + sentCard.id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(() => {
            toast.success('Carta salva')
          })
          .catch(() => {
            toast.error('Falha ao enviar o arquivo!')
            api
              .delete('/locked-messages/destroy/' + sentCard.id)
              .catch(() => {})
          })
      }
      toast.success('Carta criada com sucesso.')
      setIsSubmitting(false)
      queryClient.invalidateQueries({ queryKey: ['locked-messages'] })
      resetForm()
      onClose()
    } catch (err) {
      setIsSubmitting(false)
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Algo deu errado. Tente novamente.')
        resetForm()
        onClose()
      }
    }
  }

  return (
    <DialogContent className="max-h-[85%] max-w-4xl bg-zinc-800 overflow-y-auto scrollbar-minimal">
      <div className="flex w-full h-fit items-center p-6 gap-2 border-b">
        <MailIcon className="text-primary" size={18} />
        <DialogTitle className="text-xl">Nova Carta</DialogTitle>
      </div>
      <div className="flex flex-col w-full min-h-[700px] flex-1 max-w-2xl items-center p-4 gap-6 mx-auto">
        <div className="flex flex-col items-center gap-5">
          <CalendarIcon className="text-red-500"></CalendarIcon>
          <div className="flex flex-col max-w-md items-center gap-2">
            <h2 className="text-xl font-semibold text-center">
              Data de abertura da carta
            </h2>
            <p className="text-xs text-center text-zinc-400">
              Data de abertura da carta
            </p>
          </div>
          <DatePicker
            date={date}
            fromDate={dayjs().add(1, 'day').toDate()}
            setDate={(arg: Date | undefined) => (arg ? setDate(arg) : null)}
            placeholder="Insira uma data"
            customFormat="DD [de] MMMM"
            className="text-sm text-white bg-zinc-900 px-10 py-3 h-fit rounded-lg"
          />
        </div>
        <MessageDropzone saveFile={setSavedFile} />
        <NewLockedMessageEditor
          editable={true}
          startingContent=""
          saveContentState={setSavedContent}
        />
      </div>
      <Button
        className="sticky w-24 justify-self-end mr-6 mb-6"
        onClick={handleRegister}
        loading={isSubmitting}
        disabled={isSubmitting || !savedContent}
      >
        Salvar
      </Button>
    </DialogContent>
  )
}
