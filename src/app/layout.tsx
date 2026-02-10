import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/main-nav'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chain Data Dashboard',
  description: 'A dashboard for Chain Data',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/30`}>
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="fixed left-0 right-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Suspense>
            <MainNav />
          </Suspense>
          <main className="mx-auto max-w-6xl space-y-12 px-6 py-12 md:px-8">
            <Suspense fallback={<div className="p-6">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
