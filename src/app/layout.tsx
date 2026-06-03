import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/main-nav'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

const dmSans = DM_Sans({ subsets: ['latin'] })

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
        className={`${dmSans.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}>
          <Suspense>
            <MainNav />
          </Suspense>
          <main className="mx-auto max-w-7xl space-y-8 px-8 py-10 md:px-10">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-12">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
                </div>
              }>
              {children}
            </Suspense>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
