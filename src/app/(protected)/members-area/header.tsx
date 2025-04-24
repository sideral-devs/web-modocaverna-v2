'use client'
import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

export function MembersAreaHeader() {
  const pathName = usePathname()
  const router = useRouter()

  return (
    <Header>
      {pathName.includes('/watch') ? (
        <Button
          variant="outline"
          className="w-12 h-12 rounded-xl border text-primary"
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </Button>
      ) : (
        <HeaderTitle title="CONTEÚDOS" />
      )}
      <button onClick={() => router.back()} className="focus:outline-none">
        <Image src="/images/logo.svg" alt="Logo" width={132} height={35} />
      </button>
      <HeaderClose to="cursos-e-conhecimentos" />
    </Header>
  )
}
