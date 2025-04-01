import Image from 'next/image'

export default function Manutencao() {
  return (
    <div className="flex flex-col items-center justify-center h-80 space-y-4">
      {/* <Image
        src="/images/logo-vertical.webp"
        alt="Manutenção"
        width={200}
        height={200}
      ></Image> */}

      <h1 className="text-6xl pt-6 mt-11"> Atualização em progresso... </h1>
      <p className="text-2xl">
        Estamos trabalhando para melhorar a sua experiência. Tente novamente
        mais tarde.
      </p>

      <Image
        src={'/images/bg.webp'}
        alt="bg"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'top center',
          zIndex: -3,
          opacity: 0.5,
        }}
      />
    </div>
  )
}
