'use client'
import { useUser } from '@/hooks/queries/use-user'
import { env } from '@/lib/env'
import { useAuthStore } from '@/store/auth'
import { LogOutIcon, Settings } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function UserDropdown() {
  const { data: user } = useUser()
  const { logout, setToken } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  async function handleLogout(): Promise<void> {
    try {
      await logout()
      await signOut({ redirect: false })
    } catch {
      setToken(null)
    }
  }

  if (!user) {
    return
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild data-tutorial-id="perfil">
        {user.user_foto && !imageError ? (
          <Image
            src={`${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}`}
            width={44}
            height={44}
            className="rounded-xl cursor-pointer"
            objectFit="cover"
            objectPosition="center"
            alt="Foto do usuário"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex w-11 h-11 items-center justify-center bg-primary px-3 rounded-xl cursor-pointer">
            <span className="text-2xl uppercase">{user.name[0]}</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-mt-4 mr-4 xl:mr-[50px] max-w-80 sm:w-80 border border-zinc-700">
        <div className="flex flex-col px-4 py-5 gap-5">
          <h3 className="text-sm">Meu perfil</h3>
          <div>
            <Link href={'/settings'} className="flex items-center gap-3">
              {user.user_foto && !imageError ? (
                <Image
                  src={`${env.NEXT_PUBLIC_PROD_URL}${user.user_foto}`}
                  width={36}
                  height={36}
                  className="rounded-xl"
                  objectFit="cover"
                  objectPosition="center"
                  alt="Foto do usuário"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex w-9 h-9 items-center justify-center bg-primary px-3 rounded-xl cursor-pointer">
                  <span className="text-2xl">{user.name[0]}</span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="text-xs">{user.name}</p>
                <span className="text-[10px] text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </Link>
          </div>
        </div>
        <DropdownMenuSeparator />
        <Link href={'/settings'}>
          <div className="flex items center p-4 gap-2">
            <Settings size={16} />
            <span className="text-xs">Configurações</span>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items center p-4 gap-2 text-red-400"
        >
          <LogOutIcon size={16} />
          <span className="text-xs">Sair</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
