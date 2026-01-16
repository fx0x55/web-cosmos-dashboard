import Link from "next/link";
import { ChainSwitcher } from "@/components/chain-switcher";
import { SearchForm } from "@/components/search-form";
import { ModeToggle } from "@/components/mode-toggle";

export function MainNav() {
  return (
    <div className="border-b border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 shadow-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center px-6 max-w-7xl mx-auto justify-between gap-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 transition-all hover:scale-105 duration-200 shrink-0 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
            C
          </div>
          <span className="font-bold text-xl hidden sm:inline-block tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Cosmos Dashboard</span>
        </Link>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden md:block w-full max-w-sm">
            <SearchForm />
          </div>
          <ChainSwitcher />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
