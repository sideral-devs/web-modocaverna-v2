'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Exercise } from '@/types/type'

interface ExerciciosCreateUpdateProps {
  exercise?: Exercise
  isOpen: boolean
  onClose: () => void
}

export function ExerciciosCreateUpdate({
  exercise,
  isOpen,
  onClose,
}: ExerciciosCreateUpdateProps) {
  // const { createExercise, updateExercise } = useExercises()
  // const [formData, setFormData] = useState({
  //   name: exercise?.nome || '',
  //   series: exercise?.series || 0,
  //   repetitions: exercise?.repeticoes || 0,
  //   currentWeight: exercise?.carga_atual || 0,
  //   imageUrl: exercise?.imagem_url || '',
  // })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // if (exercise) {
    //   await updateExercise({
    //     id: exercise.id,
    //     data: formData,
    //   })
    // } else {
    //   await createExercise({
    //     ...formData,
    //   })
    // }
    onClose()
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            {exercise ? 'Editar exercício' : 'Novo exercício'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Nome do exercício</label>
            {/* <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            /> */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Séries</label>
              {/* <Input
                type="number"
                value={formData.series}
                onChange={(e) =>
                  setFormData({ ...formData, series: Number(e.target.value) })
                }
                className="bg-zinc-800 border-zinc-700"
              /> */}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Repetições</label>
              {/* <Input
                type="number"
                value={formData.repetitions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    repetitions: Number(e.target.value),
                  })
                }
                className="bg-zinc-800 border-zinc-700"
              /> */}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Carga atual (kg)</label>
            {/* <Input
              type="number"
              value={formData.currentWeight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentWeight: Number(e.target.value),
                })
              }
              className="bg-zinc-800 border-zinc-700"
            /> */}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">URL da imagem</label>
            {/* <Input
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700"
            /> */}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-zinc-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              {exercise ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
