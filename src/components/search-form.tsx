'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DEFAULT_CHAIN_ID } from '@/lib/api'
import { Search } from 'lucide-react'

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setError('Address is required')
      return
    }

    // Simple mock validation
    if (query.length < 5) {
      setError('Address is too short')
      return
    }

    setError('')
    const chain = searchParams.get('chain') || DEFAULT_CHAIN_ID
    router.push(`/address/${query}?chain=${chain}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative z-10 flex w-full items-end gap-3">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="search-address" className="sr-only">
          Search Address
        </Label>
        <div className="relative">
          <Input
            id="search-address"
            type="text"
            placeholder="Search address..."
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              if (error) setError('')
            }}
            className={`h-10 w-full border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all focus-visible:ring-2 dark:border-white/20 dark:bg-black/50 ${error ? 'border-red-500 ring-red-500' : ''}`}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="h-10 w-10 shrink-0 border border-slate-200 bg-white/50 shadow-sm backdrop-blur-sm transition-all hover:bg-white/80 dark:border-white/20 dark:bg-black/50 dark:hover:bg-white/10">
        <Search className="h-4 w-4 text-slate-500" />
      </Button>
    </form>
  )
}
