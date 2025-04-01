'use client'

import { motion, PanInfo } from 'framer-motion'
import { RotateCcw, RotateCw, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
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

  const handleDragStart = () => {
    if (!editable) return
    setIsDragging(true)
    setShowControls(true)
  }

  const handleDragEnd = (event: MouseEvent, info: PanInfo) => {
    if (!editable) return
    setIsDragging(false)
    onUpdate({
      ...image,
      x: image.x + info.offset.x,
      y: image.y + info.offset.y,
    })
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

      // Maintain aspect ratio
      // const aspectRatio = startWidth / startHeight

      if (direction === 'se') {
        newWidth = startWidth + dx
        newHeight = startHeight + dy
      } else if (direction === 'sw') {
        newWidth = startWidth - dx
        newHeight = startHeight + dy
      } else if (direction === 'ne') {
        newWidth = startWidth + dx
        newHeight = startHeight - dy
      } else if (direction === 'nw') {
        newWidth = startWidth - dx
        newHeight = startHeight - dy
      }

      // Ensure minimum size
      newWidth = Math.max(50, newWidth)
      newHeight = Math.max(50, newHeight)

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

  return (
    <motion.div
      className="absolute cursor-move"
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
      whileDrag={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => !isDragging && !isResizing && setShowControls(false)}
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

        {showControls && editable && (
          <div className="absolute top-0 -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-md p-1 flex gap-1">
            <button
              onClick={() => rotateImage('counterclockwise')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Rotate counterclockwise"
            >
              <RotateCcw size={16} className="text-black" />
            </button>
            <button
              onClick={() => rotateImage('clockwise')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Rotate clockwise"
            >
              <RotateCw size={16} className="text-black" />
            </button>
            <button
              onClick={() => onDelete(image.id)}
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
              className="absolute w-6 h-6 bg-white rounded-full border border-gray-300 cursor-nwse-resize -right-3 -bottom-3 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'se')}
            />
            <div
              className="absolute w-6 h-6 bg-white rounded-full border border-gray-300 cursor-nesw-resize -left-3 -bottom-3 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'sw')}
            />
            <div
              className="absolute w-6 h-6 bg-white rounded-full border border-gray-300 cursor-nesw-resize -right-3 -top-3 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'ne')}
            />
            <div
              className="absolute w-6 h-6 bg-white rounded-full border border-gray-300 cursor-nwse-resize -left-3 -top-3 flex items-center justify-center shadow-sm"
              // @ts-expect-error Event type
              onMouseDown={(e) => handleResize(e, 'nw')}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
