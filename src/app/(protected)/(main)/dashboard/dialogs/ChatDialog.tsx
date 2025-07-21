'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ChatDialog({
  open,
  setIsOpen,
  tutorialId,
}: {
  open: boolean
  setIsOpen: (arg: boolean) => void
  tutorialId?: string
}) {
  const [highlightRect, setHighlightRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (!open) return

    const el = document.querySelector(
      `[data-tutorial-id="${tutorialId || 'chat'}"]`,
    )

    if (el) {
      const rect = el.getBoundingClientRect()
      console.log(rect)
      setHighlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    } else {
      setHighlightRect({ top: 0, left: 0, width: 0, height: 0 })
    }
  }, [open])

  const closeTutorial = () => {
    setIsOpen(false)
  }

  const getDialogPosition = () => {
    const rect = highlightRect

    if (!rect.top && !rect.left) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    return {
      top: rect.top - 10,
      left: rect.left - 10,
      transform: 'translate(-100%, -100%)',
      position: 'absolute' as const,
    }
  }

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute bg-white/10 border-2 border-primary rounded-lg shadow-2xl"
          style={{
            left: `${highlightRect.left}px`,
            top: `${highlightRect.top}px`,
            width: `${highlightRect.width}px`,
            height: `${highlightRect.height}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
            zIndex: 51,
          }}
        />
      </div>

      <Card
        className="absolute w-[400px] z-[52] shadow-2xl border-2"
        style={getDialogPosition()}
      >
        <CardHeader className="flex flex-col items-start px-6 py-4 gap-4">
          <div className="w-full flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={closeTutorial}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-lg">Dúvidas?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            Fale comigo direto no chat. Sou eu mesmo, o Capitão Caverna, pronto
            pra te destravar.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
