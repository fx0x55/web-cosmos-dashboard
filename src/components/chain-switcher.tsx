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
import { getChains } from '@/lib/api'
import type { Chain } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

export function ChainSwitcher() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [chains, setChains] = React.useState<Chain[]>([])
  const [loading, setLoading] = React.useState(true)

  // Get current chain from URL or default to first chain
  const currentChainId = searchParams.get('chain') || 'aifx'

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
      <SelectTrigger className="h-9 w-[180px] rounded-full border-white/20 bg-white/50 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 focus:ring-0 focus:ring-offset-0 dark:bg-black/50 dark:hover:bg-black/80">
        <SelectValue placeholder="Select chain">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center text-xs">
              {currentChain?.icon}
            </span>
            <span className="text-sm font-medium">{currentChain?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-white/20 bg-white/80 backdrop-blur-xl dark:bg-black/80">
        {chains.map(chain => (
          <SelectItem
            key={chain.id}
            value={chain.id}
            className="cursor-pointer rounded-lg focus:bg-black/5 dark:focus:bg-white/10">
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
