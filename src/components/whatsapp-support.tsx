'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppSupport() {
  const handleSupportClick = () => {
    window.open('https://redirect.lifs.app/suporte-app', '_blank')
  }

  return (
    <button
      onClick={handleSupportClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      title="Suporte via WhatsApp"
      aria-label="Abrir suporte via WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  )
}
