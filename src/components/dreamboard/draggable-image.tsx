'use client'

import { cn } from '@/lib/utils'
import { motion, PanInfo } from 'framer-motion'
import { RotateCcw, RotateCw, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ImageItem } from './dreamboard-maker'

interface DraggableImageProps {
  image: ImageItem
  onUpdate: (image: ImageItem) => void
  onDelete: (id: string) => void
  editable?: boolean
}

export function DraggableImage({
  image,
  onUpdate,
  onDelete,
  editable = true,
}: DraggableImageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleDragStart = () => {
    console.log(isResizing)
    if (!editable || isResizing) return
    setIsDragging(true)
    setShowControls(true)
  }

  const handleDragEnd = (event: MouseEvent, info: PanInfo) => {
    if (!editable || isResizing) return
    console.log('dragEnd')
    setIsDragging(false)
    onUpdate({
      ...image,
      x: image.x + info.offset.x,
      y: image.y + info.offset.y,
    })
  }

  const handleImageClick = (e: React.MouseEvent) => {
    if (!editable) return
    e.stopPropagation()
    setShowControls(true)
  }

  const handleResize = (event: MouseEvent, direction: string) => {
    if (!editable) return
    event.stopPropagation()
    setIsResizing(true)

    const startX = event.clientX
    const startY = event.clientY
    const startWidth = image.width
    const startHeight = image.height

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight

      const aspectRatio = startWidth / startHeight

      if (direction === 'se' || direction === 'ne') {
        newWidth = startWidth + dx
        newHeight = newWidth / aspectRatio
      } else if (direction === 'sw' || direction === 'nw') {
        newWidth = startWidth - dx
        newHeight = newWidth / aspectRatio
      } else if (direction === 'n') {
        newWidth = startWidth
        newHeight = startHeight - dy
      } else if (direction === 's') {
        newWidth = startWidth
        newHeight = startHeight + dy
      } else if (direction === 'e') {
        newWidth = startWidth - dx
        newHeight = startHeight
      } else if (direction === 'w') {
        newWidth = startWidth + dx
        newHeight = startHeight
      }

      // newWidth = Math.max(50, newWidth)
      // newHeight = Math.max(50, newHeight)

      onUpdate({
        ...image,
        width: newWidth,
        height: newHeight,
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const rotateImage = (direction: 'clockwise' | 'counterclockwise') => {
    if (!editable) return
    const rotationAmount = direction === 'clockwise' ? 15 : -15
    onUpdate({
      ...image,
      rotation: image.rotation + rotationAmount,
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' && showControls) {
        onDelete(image.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showControls, image.id, onDelete])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        imageRef.current &&
        !imageRef.current.contains(event.target as Node)
      ) {
        setShowControls(false)
      }
    }

    if (showControls) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showControls])

  return (
    <motion.div
      ref={imageRef}
      className={cn(
        'absolute cursor-move hover:ring ring-red-700',
        showControls && 'ring',
      )}
      style={{
        top: 0,
        left: 0,
        x: image.x,
        y: image.y,
        zIndex: isDragging || isResizing ? 10 : 1,
      }}
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleImageClick}
    >
      <motion.div
        style={{
          width: image.width,
          height: image.height,
          rotate: image.rotation,
        }}
        className="relative group"
      >
        <Image
          src={image.src || '/placeholder.svg'}
          alt="Dreamboard item"
          className="w-full h-full object-cover rounded-md"
          fill
          draggable={false}
        />

        {showControls && editable && !isResizing && (
          <div className="absolute top-0 translate-y-[-150%] left-1/2 transform -translate-x-1/2 bg-zinc-900 rounded-full py-1 px-2 flex gap-1 border">
            <button
              onClick={(e) => {
                e.stopPropagation()
                rotateImage('counterclockwise')
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Rotate counterclockwise"
            >
              <RotateCcw size={16} className="text-white hover:text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                rotateImage('clockwise')
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Rotate clockwise"
            >
              <RotateCw size={16} className="text-white hover:text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(image.id)
              }}
              className="p-1 hover:bg-red-100 text-red-500 rounded"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        {showControls && editable && (
          <>
            <div
              className="absolute w-4 h-4 bg-zinc-100 rounded-full border border-gray-300 cursor-nwse-resize -right-2 -bottom-2 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'se')}
            />
            <div
              className="absolute w-4 h-4 bg-zinc-100 rounded-full border border-gray-300 cursor-nesw-resize -left-2 -bottom-2 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'sw')}
            />
            <div
              className="absolute w-4 h-4 bg-zinc-100 rounded-full border border-gray-300 cursor-nesw-resize -right-2 -top-2 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'ne')}
            />
            <div
              className="absolute w-4 h-4 bg-zinc-100 rounded-full border border-gray-300 cursor-nwse-resize -left-2 -top-2 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'nw')}
            />
            <div
              className="absolute w-4 h-2 bg-zinc-100 rounded-full border cursor-ns-resize left-1/2 -translate-x-1/2 -top-1.5 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'n')}
            />
            <div
              className="absolute w-4 h-2 bg-zinc-100 rounded-full border cursor-ns-resize left-1/2 -translate-x-1/2 -bottom-1.5 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 's')}
            />
            <div
              className="absolute w-2 h-4 bg-zinc-100 rounded-full border cursor-ew-resize top-1/2 translate-y-1/2 -left-1.5 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'e')}
            />
            <div
              className="absolute w-2 h-4 bg-zinc-100 rounded-full border cursor-ew-resize top-1/2 translate-y-1/2 -right-1.5 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'w')}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
