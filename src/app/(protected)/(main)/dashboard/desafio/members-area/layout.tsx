import { ProtectedRoute } from '@/components/protected-route'
import { ReactNode } from 'react'

export default function MembersAreaLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full items-center">{children}</div>
    </ProtectedRoute>
  )
}
