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
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30`}>
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
