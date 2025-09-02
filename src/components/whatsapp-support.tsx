'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function WhatsAppSupport() {
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    // Show bubble after 10 seconds, only once per session
    const timer = setTimeout(() => {
      setShowBubble(true)
    }, 10000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleSupportClick = () => {
    window.open('https://redirect.lifs.app/suporte-app', '_blank')
    setShowBubble(false) // Hide bubble when clicked
  }

  const handleBubbleClick = () => {
    setShowBubble(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {showBubble && (
        <div 
          className="absolute bottom-16 right-0 mb-2 animate-in slide-in-from-bottom-2 fade-in duration-300"
          onClick={handleBubbleClick}
        >
          <div className="relative bg-white rounded-2xl px-5 py-3 shadow-lg border border-gray-200 w-56">
            <p className="text-sm text-gray-800 font-medium">
              Precisa de ajuda?
            </p>
            {/* Speech bubble arrow */}
            <div className="absolute bottom-0 right-4 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              <div className="absolute -top-px left-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200"></div>
            </div>
            {/* Close button */}
            <button
              onClick={handleBubbleClick}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-xs flex items-center justify-center transition-colors"
              aria-label="Fechar mensagem"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Support Button */}
      <button
        onClick={handleSupportClick}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none overflow-hidden"
        style={{ backgroundColor: '#ff3333' }}
        title="Suporte via WhatsApp"
        aria-label="Abrir suporte via WhatsApp"
      >
        <Image
          src="/images/cpt.webp"
          alt="Suporte"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </button>
    </div>
  )
}
