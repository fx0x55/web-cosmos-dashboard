import Link from 'next/link'
import { ChainSwitcher } from '@/components/chain-switcher'
import { SearchForm } from '@/components/search-form'
import { ModeToggle } from '@/components/mode-toggle'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/50 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-90">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-sm font-black text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
            C
          </div>
          <span className="hidden text-lg font-black tracking-tight md:inline-block">
            Cosmos
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Dash
            </span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <div className="hidden w-full max-w-[320px] md:block">
            <SearchForm />
          </div>
          <div className="flex items-center gap-2 border-l border-border/20 pl-4">
            <ChainSwitcher />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
