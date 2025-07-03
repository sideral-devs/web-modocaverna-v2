// import FormbricksLoader from '@/components/formbricks'
import { MusicPlayerProvider } from '@/components/music-player-provider'
import OrimonBot from '@/components/orimon'
import { SessionProvider } from 'next-auth/react'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MusicPlayerProvider>
      <SessionProvider>
        <OrimonBot />
        {/* <FormbricksLoader /> */}
        {children}
      </SessionProvider>
    </MusicPlayerProvider>
  )
}
