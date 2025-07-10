// import FormbricksLoader from '@/components/formbricks'
import { MusicPlayerProvider } from '@/components/music-player-provider'
import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const CrispWithNoSSR = dynamic(() => import('../../../components/crisp'))

  return (
    <MusicPlayerProvider>
      <SessionProvider>
        <CrispWithNoSSR />

        {/* <FormbricksLoader /> */}
        {children}
      </SessionProvider>
    </MusicPlayerProvider>
  )
}
