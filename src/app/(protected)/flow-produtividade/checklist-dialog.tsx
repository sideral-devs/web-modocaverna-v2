import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { VideoPlayer } from '@/components/video-player'
import { videos } from '@/lib/constants'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { HourglassIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import DreamboardCard from '../dashboard/cards/dreamboard'

export function ChecklistDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  const [checkedItems, setCheckedItems] = useState<number[]>([])

  function handleActivate() {
    localStorage.setItem(
      'checklistModalLastOpened',
      dayjs().valueOf().toString(),
    )
    setOpen(false)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleSelect(id: number) {
    if (checkedItems.includes(id)) {
      // Remover comentário abaixo para remover ao selecionar de novo
      // setCheckedItems((prevItems) => prevItems.filter((item) => item !== id))
    } else {
      setCheckedItems((prevItems) => [...prevItems, id])
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-h-[95%] bg-zinc-800 border-zinc-700 gap-4 overflow-y-auto scrollbar-minimal">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex w-fit px-3 py-2 gap-2 border rounded-full text-[10px] font-semibold uppercase">
            <HourglassIcon size={14} className="text-primary" />
            Ritual de ativação Flow Caverna
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="relative w-full h-full overflow-y-auto scrollbar-minimal">
          <div className="flex flex-col gap-4">
            <div className="flex w-full-items-center gap-16">
              <Image
                src={'/images/lobo-face.svg'}
                width={125}
                height={109}
                alt="Capitão Caverna"
              />
              <div className="flex flex-col relative w-full p-6 py-4 gap-2 border border-zinc-700 rounded-lg">
                <h3 className="text-xl font-semibold">Bora lá!</h3>
                <p className="text-zinc-400">
                  Preparar-se para o flow é como abrir as portas para sua melhor
                  versão. O ritual não é obrigatório, mas potencializa foco e
                  produtividade. Experimente!
                </p>
                <Image
                  src={'/images/triangle-balloon.svg'}
                  width={54}
                  height={14}
                  alt="balloon"
                  className="absolute -left-[54px] bottom-16"
                  draggable={false}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex w-full items-center gap-12">
                  <span className="flex w-fit px-3 py-2 gap-2 border rounded-full text-[10px] font-semibold uppercase">
                    CHECKLIST INICIAL
                  </span>
                  <div className="flex-1 h-[1px] bg-border" />
                </div>
                <div className="flex flex-col gap-4">
                  {initialOptions.map((option, index) => {
                    return (
                      <ChecklistItem
                        key={option.id}
                        number={index + 1}
                        id={option.id}
                        label={option.label}
                        selected={checkedItems.includes(option.id)}
                        onSelect={handleSelect}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex w-full items-center gap-12">
                  <span className="flex w-fit px-3 py-2 gap-2 border rounded-full text-[10px] font-semibold uppercase">
                    DROPS DE MOTIVAÇÃO
                  </span>
                  <div className="flex-1 h-[1px] bg-border" />
                </div>
                <div className="flex flex-col gap-4">
                  <Dialog>
                    <DialogTrigger>
                      <ChecklistItem
                        number={4}
                        id={4}
                        label="Mural de visualização (1 minuto de contemplação)"
                        selected={checkedItems.includes(4)}
                        onSelect={handleSelect}
                      />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center px-3 py-6 max-w-2xl gap-4">
                      <DialogTitle className="flex w-fit px-3 py-2 gap-2 border rounded-full text-[10px] font-semibold uppercase">
                        Quadro dos sonhos
                      </DialogTitle>
                      <div className="w-full aspect-video">
                        <DreamboardCard hideLabel />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger>
                      <ChecklistItem
                        number={5}
                        id={5}
                        label="Exercício Mindfulness (Clique e faça o exercício)"
                        selected={checkedItems.includes(5)}
                        onSelect={handleSelect}
                      />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col max-w-xl items-center px-3 py-6 gap-4">
                      <DialogTitle className="flex w-fit px-3 py-2 gap-2 border rounded-full text-[10px] font-semibold uppercase">
                        Exercício Mindfulness
                      </DialogTitle>
                      <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <VideoPlayer id={videos.mindfulness} />
                      </div>
                      <DialogClose asChild>
                        <Button className="mt-4">Finalizar</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger>
                      <ChecklistItem
                        number={6}
                        id={6}
                        label="Rito da Caverna (Assista e mentaliza)"
                        selected={checkedItems.includes(6)}
                        onSelect={handleSelect}
                      />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col max-w-xl items-center px-3 py-6 gap-4">
                      <DialogTitle className="flex w-fit px-3 py-2 gap-2 border rounded-full text-[10px] font-semibold uppercase">
                        Rito da caverna
                      </DialogTitle>
                      <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <VideoPlayer id={videos.caveRite} />
                      </div>
                      <DialogClose asChild>
                        <Button className="mt-4">Finalizar</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <AlertDialogFooter className="mt-3">
              <Button variant="ghost" onClick={handleClose}>
                Pular
              </Button>
              <Button onClick={handleActivate}>Ativar Flow</Button>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ChecklistItem({
  number,
  id,
  label,
  selected,
  onSelect,
}: {
  number: number
  id: number
  label: string
  selected: boolean
  onSelect: (id: number) => void
}) {
  function handleSelect() {
    onSelect(id)
  }

  return (
    <div className="flex w-full gap-2">
      <div className="flex w-14 h-14 items-center justify-center border rounded-2xl text-zinc-400">
        {number}
      </div>
      <motion.div
        className="flex flex-1 items-center justify-between p-5 py-4 rounded-2xl cursor-pointer"
        initial={{
          backgroundColor: '#18181B',
        }}
        animate={{
          backgroundColor: selected ? '#064E3B' : '#18181B',
        }}
        onClick={handleSelect}
      >
        <motion.span
          className="flex-1 text-left"
          animate={{
            color: selected ? '#6EE6B6' : '#A0A0A9',
          }}
        >
          {label}
        </motion.span>
        <motion.div
          className="flex w-4 h-4 items-center justify-center rounded-full"
          initial={{
            border: '1px solid #FF3333',
          }}
          animate={{
            border: selected ? '1px solid #34D298' : '1px solid #FF3333',
          }}
        >
          <motion.div
            className="w-2 h-2 bg-emerald-400 rounded-full"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: selected ? 1 : 0,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

const initialOptions = [
  {
    id: 1,
    label: 'Organizar a mesa e preparar o ambiente de trabalho',
  },
  {
    id: 2,
    label: 'Estabelecer um horário de inicio',
  },
  {
    id: 3,
    label: 'Garrafa de água',
  },
]
