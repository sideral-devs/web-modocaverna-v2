import { GlobalProviders } from '@/components/providers'
import { env } from '@/lib/env'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
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
      <body className={`${geistSans.className} ${geistMono.variable} antialiased`} >
        {/* <MobileAlert /> */}
        <meta name="apple-itunes-app" content="app-id=6544803387" />
        <GlobalProviders>{children}</GlobalProviders>
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_METRIC_ID!} />
      </body>
    </html>
  )
}
