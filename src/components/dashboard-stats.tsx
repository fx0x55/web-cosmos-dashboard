'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_CHAIN_ID, getChainStats } from '@/lib/api'
import type { ChainStats } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { Coins, Lock, Unlock, PiggyBank } from 'lucide-react'

export function DashboardStats() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [stats, setStats] = useState<ChainStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const data = await getChainStats(chainId)
        setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [chainId])

  const items = [
    {
      title: 'Total Supply',
      value: stats?.totalSupply.amount,
      denom: stats?.totalSupply.denom,
      icon: Coins,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Bonded Tokens',
      value: stats?.bondedTokens.amount,
      denom: stats?.bondedTokens.denom,
      icon: Lock,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Not Bonded Tokens',
      value: stats?.notBondedTokens.amount,
      denom: stats?.notBondedTokens.denom,
      icon: Unlock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Community Pool',
      value: stats?.communityPool.amount,
      denom: stats?.communityPool.denom,
      icon: PiggyBank,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card h-40 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="mt-4 h-8 w-32 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <Card
          key={i}
          className="glass-card group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {item.title}
              </CardTitle>
            </div>
            <div
              className={`rounded-xl p-2.5 shadow-sm transition-colors ${item.bgColor} ${item.color} group-hover:bg-primary/10 group-hover:text-primary`}>
              <item.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-3xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                {item.value ? Number(item.value).toLocaleString() : '0'}
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
                {item.denom}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
