import { ReactNode, Suspense } from 'react'
import { CloseButton } from './CloseButton'
import { Sidebar } from './Sidebar'

export default function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex relative w-full h-full min-h-screen justify-center bg-zinc-900">
      <div className="flex flex-col lg:grid lg:grid-cols-4 w-full max-w-6xl px-4 py-16 gap-8 lg:gap-16">
        <Suspense>
          <Sidebar />
        </Suspense>
        {children}
      </div>
      <CloseButton className="absolute top-7 right-9" />
    </div>
  )
}
