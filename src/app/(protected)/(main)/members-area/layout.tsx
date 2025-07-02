import { ProtectedRoute } from '@/components/protected-route'
import { ReactNode } from 'react'
import { MembersAreaHeader } from './header'

export default function MembersAreaLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen items-center">
        <MembersAreaHeader />
        {children}
      </div>
    </ProtectedRoute>
  )
}
