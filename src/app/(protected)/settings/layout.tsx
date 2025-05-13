import { ReactNode } from 'react'
import { CloseButton } from './CloseButton'
import { Sidebar } from './Sidebar'

export default function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex relative w-full h-full min-h-screen justify-center bg-zinc-900">
      <div className="md:grid grid-cols-4 w-full max-w-6xl px-4 py-16 gap-8 lg:gap-16">
        <Sidebar />
        {children}
      </div>
      <CloseButton className="absolute top-7 right-9" />
    </div>
  )
}
