'use client'
import { useUser } from '@/hooks/queries/use-user'
import { useEffect } from 'react'

export default function OrimonBot() {
  const { data: user } = useUser()

  useEffect(() => {
    if (!user || !Number(user.tutorial_complete)) return

    const script = document.createElement('script')
    script.src = 'https://bot.orimon.ai/deploy/index.js'
    script.setAttribute('tenantId', 'c3b60c04-68cb-44b2-a15a-de7b5b3337b3')
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [user])

  return null
}
