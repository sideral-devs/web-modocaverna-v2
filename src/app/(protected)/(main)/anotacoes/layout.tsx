import { ProtectedRoute } from '@/components/protected-route'
import { ReactNode } from 'react'
import { NotesHeader } from './header'
import { NotesSidebar } from './sidebar'

export default function MembersAreaLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full h-screen items-center overflow-hidden">
        <NotesHeader />
        <div className="flex w-full max-w-8xl h-full">
          <NotesSidebar />
          <div className="flex flex-1 h-full bg-[#212124] overflow-y-auto scrollbar-minimal">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
