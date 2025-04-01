import { MainNav } from '@/components/community/main-nav'
import { MobileNav } from '@/components/community/mobile-nav'
import { TrendingSidebar } from '@/components/community/trending-sidebar'
import { ReactNode } from 'react'
import { CommunityHeader } from './header'

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 overflow-x-hidden">
      <CommunityHeader />
      <div className="flex w-full max-w-7xl justify-center sm:py-12 sm:px-6 gap-3 lg:gap-6">
        <div className="hidden sm:block w-40 lg:w-52 sm:w-52 min-h-screen sticky top-0">
          <MainNav />
        </div>
        <main className="flex-1 min-w-0 max-w-2xl xl:max-w-none">
          {children}
        </main>
        <TrendingSidebar />
      </div>
      <MobileNav />
    </div>
  )
}
