import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { MotionProvider } from '@/components/motion-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'LLM Chat',
  description: 'AI chatbot powered by OpenRouter',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased h-full" suppressHydrationWarning>
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
