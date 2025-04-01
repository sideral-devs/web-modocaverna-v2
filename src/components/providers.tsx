'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { Toaster } from 'sonner'
import { MenusProviders } from './menus/menus-providers'

export function GlobalProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <main>{children}</main>
      <MenusProviders />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  )
}
