import Image from 'next/image'
import { ChallengeTourDialog } from './tour-dialog'

export default function Page() {
  return (
    <div className="w-screen h-screen relative">
      <Image
        src={'/images/desafio/bg-blur.jpg'}
        className="object-cover"
        fill
        alt="bg-blur"
      />
      <ChallengeTourDialog />
    </div>
  )
}
