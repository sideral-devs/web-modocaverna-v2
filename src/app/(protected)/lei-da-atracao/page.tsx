'use client'
import { BoxCountdown } from '@/components/box-countdown'
import { DreamboardMaker } from '@/components/dreamboard/dreamboard-maker'
import { Header, HeaderClose } from '@/components/header'
import { Dialog } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { MailIcon, PlusIcon } from 'lucide-react'

import { UpgradeModalTrigger } from '@/components/modals/UpdateModalTrigger'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NewLockedMessageDialog } from './new-locked-message'
import { OpenedMessageDialog } from './opened-message-dialog'
dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

export default function Page() {
  // eslint-disable-next-line
  const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'))
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [currentMessage, setCurrentMessage] = useState<LockedMessage | null>(
    null,
  )
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false)
  const [openedMessageDialogOpen, setOpenedMessageDialogOpen] = useState(false)

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/metas/find')
      return response.data as Goal[]
    },
  })
  const { data: lockedMessages } = useQuery({
    queryKey: ['locked-messages'],
    queryFn: async () => {
      const response = await api.get('/locked-messages/find')
      return response.data as LockedMessage[]
    },
  })

  useEffect(() => {
    if (goals) {
      setCurrentGoal(goals.find((goal) => goal.ano === selectedYear) || null)
    }
  }, [goals, selectedYear])

  return (
    <UpgradeModalTrigger>
      <div className="flex flex-col w-full min-h-screen items-center gap-10 overflow-y-auto scrollbar-minimal">
        <Header className="border-0">
          <div className="flex w-fit items-center px-3 py-2 gap-1 border border-white rounded-full">
            <span className="uppercase text-[10px] text-white font-semibold">
              Lei da Atração
            </span>
          </div>
          <HeaderClose to="ordem-no-caos" />
        </Header>
        <section className="flex flex-col items-center w-full  h-full  gap-4">
          <div className="grid grid-1 flex-1 w-full max-w-8xl  min-h-[740px]  md:h-[740px] p-4 gap-4">
            <div className="flex flex-col col-span-3 gap-6">
              {currentGoal ? (
                <DreamboardMaker
                  year={Number(selectedYear)}
                  startingContent={currentGoal.fotos.map((foto) => ({
                    id: foto.id,
                    height: Number(foto.height),
                    width: Number(foto.width),
                    x: Number(foto.x),
                    y: Number(foto.y),
                    rotation: foto.rotation,
                    src: `${env.NEXT_PUBLIC_PROD_URL}${foto.foto}`,
                  }))}
                />
              ) : (
                <Skeleton className="flex flex-col flex-1 items-center gap-8 w-full" />
              )}
            </div>
          </div>
          <div className="w-[75%] h-[1px] bg-border" />
          <div className="flex flex-col w-full items-center max-w-8xl p-4 gap-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <MailIcon size={20} />
              Cartas para o Futuro
            </h2>
            <div className="flex flex-col w-full gap-4 overflow-x-auto item-center justify-center scrollbar-minimal">
              {lockedMessages ? (
                <div className="flex  flex-col items-center gap-12 w-full py-12">
                  {lockedMessages.map((message, index) =>
                    dayjs(message.data_abertura).toDate() < new Date() ? (
                      <div
                        className="flex  w-[876px]  justify-between py-4"
                        key={index}
                      >
                        <div className="flex flex-row  w-[40%]  align-middle py-4 pl-10  relative  left-6">
                          <BoxCountdown
                            targetDate={dayjs(message.data_abertura).toDate()}
                            onClick={() => {
                              setOpenedMessageDialogOpen(true)
                              setCurrentMessage(message)
                            }}
                          />
                        </div>
                        <div className="w-[10%] relative flex flex-col items-center py-3">
                          {/* Linha central da timeline */}
                          <div className="absolute left-1/2 -translate-x-1/2 w-[1px] h-[112%] bg-gradient-to-b from-red-500 to-[#3f3f46]" />

                          {/* Ponto 1 */}
                          <div className="relative bottom-3 z-10 flex items-center mb-10">
                            <div className="w-[11px] h-[11px] rounded-full bg-red-500 " />
                          </div>
                        </div>
                        <div
                          className="flex flex-col justify-end items-end min-w-[380px] min-h-[380px] py-4  p-2 bg-zinc-900 rounded-3xl
                        bg-cover bg-center bg-no-repeat border-red-500 border relative left-4"
                          style={{
                            backgroundImage: `url(${
                              dayjs(message.data_abertura).toDate() < new Date()
                                ? '/images/locked-messages/bau-aberto.png'
                                : '/images/locked-messages/bau-fechado.png'
                            })`,
                          }}
                          key={index}
                        >
                          <span className="flex w-fit h-fit relative bottom-1 right-3 p-[3px] px-4 rounded-lg bg-red-700 text-white text-xs">
                            Criada em{' '}
                            {dayjs(message.data_fechamento).format(
                              'DD/MM/YYYY',
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex  w-[872px] justify-between py-5"
                        key={index}
                      >
                        <div
                          className="flex flex-col w-[380px] h-[380px] justify-end items-end p-2 bg-zinc-900 rounded-3xl
                        bg-cover bg-center bg-no-repeat  border  border-[#a0a0a9] relative right-8 bottom-4 "
                          style={{
                            backgroundImage: `url(${
                              dayjs(message.data_abertura).toDate() < new Date()
                                ? '/images/locked-messages/bau-aberto.png'
                                : '/images/locked-messages/bau-fechado.png'
                            })`,
                          }}
                          key={index}
                        >
                          <span className="flex w-fit h-fit relative bottom-3 right-3 p-[3px] px-4 rounded-lg bg-red-700 text-white text-xs">
                            Criada em{' '}
                            {dayjs(message.data_fechamento).format(
                              'DD/MM/YYYY',
                            )}
                          </span>
                        </div>
                        <div className="w-[10%] relative flex flex-col items-start py-4">
                          {/* Linha central da timeline */}
                          <div className="absolute left-[14px] top-[2px] -translate-x-1/2 w-[1px] h-[110%] bg-gradient-to-b from-[#3f3f46] to-zinc-500" />

                          {/* Ponto 1 */}
                          <div className="relative right-[2px] z-10 flex items-center mb-10">
                            <div className="w-[11px] h-[11px]  rounded-full bg-red border border-[#3f3f46]  relative bottom-[34px] left-[10px] " />
                          </div>
                        </div>
                        <div className="flex flex-row  w-[40%]   align-middle py-4 pl-10 relative right-20">
                          <BoxCountdown
                            targetDate={dayjs(message.data_abertura).toDate()}
                            onClick={() => {
                              setOpenedMessageDialogOpen(true)
                              setCurrentMessage(message)
                            }}
                          />
                        </div>
                      </div>
                    ),
                  )}

                  <button
                    onClick={() => setNewMessageDialogOpen(true)}
                    className="flex flex-col text-center w-14 h-14 items-center justify-center border-2 border-white rounded-full relative bottom-7 right-[14px]"
                  >
                    <PlusIcon size={20} color="#FFF" />
                  </button>
                  <NewLockedMessageDialog
                    newMessageDialogOpen={newMessageDialogOpen}
                    setNewMessageDialogOpen={setNewMessageDialogOpen}
                  />

                  {currentMessage && (
                    <Dialog
                      open={openedMessageDialogOpen}
                      onOpenChange={setOpenedMessageDialogOpen}
                    >
                      <OpenedMessageDialog message={currentMessage} />
                    </Dialog>
                  )}
                  <span className="relative bottom-14 right-3 text-normal">
                    Nova Carta
                  </span>
                </div>
              ) : (
                Array.from({ length: 3 }, (_, index) => (
                  <Skeleton
                    className="w-64 min-w-64 h-72 bg-zinc-900"
                    key={index}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </UpgradeModalTrigger>
  )
}
