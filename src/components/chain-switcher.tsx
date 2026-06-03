'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DEFAULT_CHAIN_ID, getChains } from '@/lib/api'
import type { Chain } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

export function ChainSwitcher() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [chains, setChains] = React.useState<Chain[]>([])
  const [loading, setLoading] = React.useState(true)

  // Get current chain from URL or default to first chain
  const currentChainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  React.useEffect(() => {
    const fetchChains = async () => {
      try {
        const data = await getChains()
        setChains(data)
      } catch (error) {
        console.error('Failed to fetch chains', error)
      } finally {
        setLoading(false)
      }
    }
    fetchChains()
  }, [])

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('chain', value)
    router.push(`?${params.toString()}`)
  }

  if (loading) {
    return <Skeleton className="h-10 w-[180px]" />
  }

  const currentChain = chains.find(c => c.id === currentChainId) || chains[0]

  return (
    <Select value={currentChainId} onValueChange={handleValueChange}>
      <SelectTrigger className="h-9 w-[180px] rounded-full border-border/50 bg-card transition-all duration-200 ease-out hover:bg-muted/80 hover:border-border focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="Select chain">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center text-xs">
              {currentChain?.icon}
            </span>
            <span className="text-sm font-medium">{currentChain?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border bg-card">
        {chains.map(chain => (
          <SelectItem
            key={chain.id}
            value={chain.id}
            className="cursor-pointer rounded-lg focus:bg-muted">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center text-xs">
                {chain.icon}
              </span>
              <span className="font-medium">{chain.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
