'use client'
import { useEffect } from 'react'

import { Crisp } from 'crisp-sdk-web'

export default function CrispChat() {
  useEffect(() => {
    Crisp.configure('bdb2f5e6-d636-417f-a1c7-e6db9ed0c049')
  }, [])

  return null
}
