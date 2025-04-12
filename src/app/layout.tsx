import { GlobalProviders } from '@/components/providers'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import MobileAlert from '@/components/MobileAlert'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Modo Caverna - Desperte a sua melhor versão -',
  description:
    'Ative o MODO CAVERNA, desperte a sua melhor versão e acelere a conquista dos seus sonhos Menos procrastinação, ansiedade e distrações Mais propósito, foco, produtividade e resultados Eu aceito o desafio Ative o MODO CAVERNA, desperte a sua melhor versão e acelere a conquista dos seus sonhos Menos procrastinação, ansiedade e distrações Mais propósito, […]',
  openGraph: {
    title: 'Modo Caverna - Desperte a sua melhor versão',
    description:
      'Ative o MODO CAVERNA, desperte a sua melhor versão e acelere a conquista dos seus sonhos Menos procrastinação, ansiedade e distrações Mais propósito, foco, produtividade e resultados Eu aceito o desafio',
    url: 'https://modocaverna.com',
    siteName: 'Modo Caverna',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt_BR">
      <body className={`${rubik.className} antialiased`}>
        <MobileAlert />
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  )
}
