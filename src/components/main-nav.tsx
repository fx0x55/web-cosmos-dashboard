import Link from 'next/link'
import { ChainSwitcher } from '@/components/chain-switcher'
import { SearchForm } from '@/components/search-form'
import { ModeToggle } from '@/components/mode-toggle'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">
            C
          </div>
          <span className="hidden text-base font-bold tracking-tight md:inline-block">
            Cosmos<span className="text-primary">Dash</span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <div className="hidden w-full max-w-[320px] md:block">
            <SearchForm />
          </div>
          <div className="flex items-center gap-2 border-l border-border/50 pl-4">
            <ChainSwitcher />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
