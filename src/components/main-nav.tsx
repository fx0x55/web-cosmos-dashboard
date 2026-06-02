import Link from 'next/link'
import { ChainSwitcher } from '@/components/chain-switcher'
import { SearchForm } from '@/components/search-form'
import { ModeToggle } from '@/components/mode-toggle'

export function MainNav() {
  return (
    <div className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 md:px-8">
      <div className="surface-panel flex h-16 items-center justify-between rounded-full px-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
            <span className="font-bold">C</span>
          </div>
          <span className="hidden text-lg font-bold tracking-tight md:inline-block">
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
    </div>
  )
}
