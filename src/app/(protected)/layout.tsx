import { MusicPlayerProvider } from '@/components/music-player-provider'
import { ProtectedRoute } from '@/components/protected-route'
import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { UpgradeDialogController } from '@/components/popups/UpgradeDialogController'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const CrispWithNoSSR = dynamic(() => import('../../components/crisp'))
  return (
    <ProtectedRoute>
      <MusicPlayerProvider>
        <SessionProvider>
          <CrispWithNoSSR />
          <UpgradeDialogController />
          {children}
        </SessionProvider>
      </MusicPlayerProvider>
    </ProtectedRoute>
  )
}
