'use client'

import { useEffect, useState } from 'react'
import { AlertDescription } from '@/components/ui/alert'
import { X } from 'lucide-react'

export default function MobileAlert() {
  const [showAlert, setShowAlert] = useState(false)
  // const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const localStoreAlert = localStorage.getItem('showMobileAlert')
      const shouldShowAlert =
        localStoreAlert === null || localStoreAlert === 'false'
      setShowAlert(shouldShowAlert && window.innerWidth < 600)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // function handleCheckboxChange(checked: boolean) {
  //   if (checked) {
  //     localStorage.setItem('showMobileAlert', 'true')
  //   } else {
  //     localStorage.setItem('showMobileAlert', 'false')
  //   }
  //   setChecked(checked)
  // }

  if (!showAlert) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[93%] bg-yellow-400 text-black p-4 z-[99] flex justify-between items-center rounded-xl shadow-lg">
      <div>
        <AlertDescription className="flex flex-col gap-4 pe-2">
          <p className="text-sm">
            Nova versão do aplicativo em breve! Por enquanto, recomendamos a
            versão web para uma melhor experiência.
          </p>
          <p className="text-sm">
            Para acessar em seu computador, digite{' '}
            <a
              className="text-red-500 underline"
              href="https://www.modocaverna.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.modocaverna.com
            </a>{' '}
            e faça login.
          </p>
          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              onClick={() => handleCheckboxChange(!checked)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Não ver essa mensagem novamente.
            </label>
          </div> */}
        </AlertDescription>
      </div>
      <button
        onClick={() => setShowAlert(false)}
        className="absolute top-3 right-3 text-black cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
