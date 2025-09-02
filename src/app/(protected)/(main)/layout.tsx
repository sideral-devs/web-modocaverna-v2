// import FormbricksLoader from '@/components/formbricks'
import { MusicPlayerProvider } from '@/components/music-player-provider'
import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const WhatsAppSupportWithNoSSR = dynamic(() => import('../../../components/whatsapp-support'))

  return (
    <MusicPlayerProvider>
      <SessionProvider>
        <WhatsAppSupportWithNoSSR />

        {/* <FormbricksLoader /> */}
        {children}
      </SessionProvider>
    </MusicPlayerProvider>
  )
}
