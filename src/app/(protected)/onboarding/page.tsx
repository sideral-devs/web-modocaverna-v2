'use client'
import { ProtectedRoute } from '@/components/protected-route'
import { useUser } from '@/hooks/queries/use-user'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { data: user } = useUser()

  useEffect(() => {
    if (user && !!Number(user.tutorial_complete)) return

    const timeout = setTimeout(() => {
      if (user && !Number(user.tutorial_complete)) {
        window.location.href = '/onboarding/steps'
      }
    }, 2500)

    return () => clearTimeout(timeout)
  }, [user])

  if (user && !!Number(user.tutorial_complete)) {
    return redirect('/dashboard')
  }

  return (
    <ProtectedRoute>
      <div className="flex w-full min-h-screen relative">
        {/* <header className="flex absolute w-full max-w-8xl left-1/2 right-1/2 -translate-x-1/2 items-center justify-center p-6">
          <p className="absolute left-6 text-sm text-muted-foreground">
            Onboarding
          </p>
          <div className="flex flex-col w-full max-w-xl items-center gap-6">
            <Image
              src={'/images/logo-icon.svg'}
              alt="Logo"
              width={32}
              height={27}
            />
            <div className="flex w-full h-[1px] bg-zinc-700"></div>
          </div>
        </header> */}
        <div className="flex relative flex-1 justify-center items-center p-4">
          <div className="flex flex-col items-center gap-16">
            <motion.div
              className="flex flex-col items-center gap-8 relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image
                src={'/icons/logo-completo.svg'}
                className="scale-110 z-10"
                alt="Logo"
                width={130}
                height={40}
              />
              <h1 className="text-lg text-center z-10">
                Preparando sua jornada...
              </h1>
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 size-80 rounded-full opacity-20 blur-xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
              {/* <p className="text-zinc-400 max-w-sm text-center">
                Você está preparado(a) para a jornada mais desafiadora e
                transformadora da sua vida?
              </p> */}
            </motion.div>
            {/* <Link href={'/onboarding/steps'}>
              <AutoSubmitButton>Estou pronto(a)!</AutoSubmitButton>
            </Link> */}
          </div>
        </div>
        <Image
          src={'/images/bg.webp'}
          alt="bg"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'top center',
            zIndex: -1,
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-[800px] -left-[800px] size-[1600px] rounded-full opacity-10 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
          <div className="absolute -top-[800px] -right-[800px] size-[1600px] rounded-full opacity-10 blur-3xl bg-[radial-gradient(circle,_#ff3333_0%,_transparent_70%)]" />
        </div>
      </div>
    </ProtectedRoute>
  )
}
