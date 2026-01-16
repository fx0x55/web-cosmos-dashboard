import Link from 'next/link'
import { ChainSwitcher } from '@/components/chain-switcher'
import { SearchForm } from '@/components/search-form'
import { ModeToggle } from '@/components/mode-toggle'

export function MainNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-white/60 shadow-sm backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/60 dark:bg-black/40">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 md:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-all duration-200 hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 font-bold text-white shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40">
            C
          </div>
          <span className="hidden bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:inline-block">
            Chain Dashboard
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden w-full max-w-[460px] md:block">
            <SearchForm />
          </div>
          <ChainSwitcher />
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
