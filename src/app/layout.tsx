import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chain Data Dashboard",
  description: "A dashboard for Chain Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 relative overflow-x-hidden`}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/20 via-background to-background dark:from-indigo-900/20 dark:via-background dark:to-background pointer-events-none" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-200/20 via-background to-background dark:from-purple-900/20 dark:via-background dark:to-background pointer-events-none" />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
             <MainNav />
          </Suspense>
          <main className="max-w-6xl mx-auto px-6 py-12 space-y-12 md:px-8">
            <Suspense fallback={<div className="p-6">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
