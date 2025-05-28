import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  comment: z
    .string({ required_error: 'Escreva algo para comentar' })
    .min(2, { message: 'Escreva algo para comentar' }),
})

type CommentData = z.infer<typeof schema>

export function CommentField({ lessonId }: { lessonId: string }) {
  const queryClient = useQueryClient()
  const form = useForm<CommentData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  async function handleComment(data: CommentData) {
    try {
      await api.post('/comentarios/store', {
        aula_id: lessonId,
        texto: data.comment,
      })
      queryClient.refetchQueries({
        queryKey: ['comments', lessonId],
      })
      reset()
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(handleComment)}
      >
        <div className="w-full">
          <Textarea
            className="w-full bg-black text-white placeholder:text-zinc-400 border-0 border-b-2 border-red-600 focus:ring-0 focus:border-red-500 resize-none rounded-none text-sm leading-tight pt-2 pb-1"
            placeholder="Adicione um comentário"
            {...register('comment')}
          />
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white rounded-md"
              type="submit"
              loading={isSubmitting}
            >
              Comentar
            </Button>
          </div>
        </div>

        {errors?.comment && (
          <span className="text-xs text-red-500">{errors.comment.message}</span>
        )}
      </form>
    </FormProvider>
  )
}
