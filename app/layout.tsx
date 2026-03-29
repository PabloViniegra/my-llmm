import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Sora } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { MotionProvider } from '@/components/motion-provider'
import { env } from '@/lib/env'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'LLM Chat',
    template: '%s · LLM Chat',
  },
  description: 'Chat con modelos de IA open-source vía OpenRouter. Rápido, privado, sin registro.',
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  openGraph: {
    title: 'LLM Chat',
    description: 'Chat con modelos de IA open-source vía OpenRouter.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary',
    title: 'LLM Chat',
    description: 'Chat con modelos de IA open-source vía OpenRouter.',
  },
  icons: {
    icon: '/icon-llm-chat.png',
    apple: '/icon-llm-chat.png',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} ${sora.variable} antialiased h-full`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
