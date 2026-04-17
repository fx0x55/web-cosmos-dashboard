'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_CHAIN_ID, getChainStats } from '@/lib/api'
import type { ChainStats } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { Lock, Unlock, PiggyBank, ArrowRightLeft, Wallet } from 'lucide-react'

function calcPercent(value: string, total: string): number {
  const v = Number(value)
  const t = Number(total)
  if (!t || !v) return 0
  return Math.min((v / t) * 100, 100)
}

function fmt(value: string | undefined): string {
  return value ? Number(value).toLocaleString() : '0'
}

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

  const m = stats?.migration
  const migrated = m?.migratedSupply || '0'

  const percentItems = [
    {
      title: 'User Balance',
      value: m?.userBalance,
      denom: stats?.totalSupply.denom,
      icon: Wallet,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      barColor: 'bg-cyan-500',
      percent: m ? calcPercent(m.userBalance, migrated) : 0,
    },
    {
      title: 'Bonded',
      value: stats?.bondedTokens.amount,
      denom: stats?.bondedTokens.denom,
      icon: Lock,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      barColor: 'bg-emerald-500',
      percent: m ? calcPercent(m.userDelegation, migrated) : 0,
    },
    {
      title: 'Unbonding',
      value: stats?.notBondedTokens.amount,
      denom: stats?.notBondedTokens.denom,
      icon: Unlock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      barColor: 'bg-amber-500',
      percent: m ? calcPercent(m.userUnbonding, migrated) : 0,
    },
    {
      title: 'Community Pool',
      value: stats?.communityPool.amount,
      denom: stats?.communityPool.denom,
      icon: PiggyBank,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      barColor: 'bg-purple-500',
      percent: m
        ? calcPercent(stats?.communityPool.amount || '0', migrated)
        : 0,
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="glass-card h-36 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 pt-4">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="mt-2 h-6 w-28 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* Migration Total Card */}
      <Card className="glass-card group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 z-10 flex flex-col justify-center bg-background/95 px-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Calculation
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-muted-foreground">
                Total Supply
              </span>
              <span className="truncate font-mono tabular-nums">
                {fmt(stats?.totalSupply.amount)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-muted-foreground">ETH Module</span>
              <span className="truncate font-mono tabular-nums text-red-500">
                −{fmt(m?.ethModuleBalance)}
              </span>
            </div>
            <div className="border-t border-border/50 pt-1.5">
              <div className="flex items-baseline justify-between gap-3 font-semibold">
                <span>= </span>
                <span className="truncate font-mono tabular-nums text-indigo-500">
                  {fmt(m?.migratedSupply)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 pb-2 pt-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Migration Total
            </CardTitle>
          </div>
          <div className="shrink-0 rounded-lg bg-indigo-500/10 p-2 text-indigo-500 shadow-sm transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            <ArrowRightLeft className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="flex flex-col gap-1">
            <span className="truncate text-xl font-bold tabular-nums tracking-tight text-foreground transition-colors group-hover:text-primary">
              {fmt(m?.migratedSupply)}
            </span>
            <span className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
              {stats?.totalSupply.denom}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Percentage Cards */}
      {percentItems.map((item, i) => (
        <Card
          key={i}
          className="glass-card group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 pb-2 pt-4">
            <div className="min-w-0">
              <CardTitle className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.title}
              </CardTitle>
            </div>
            <div
              className={`shrink-0 rounded-lg p-2 shadow-sm transition-colors ${item.bgColor} ${item.color} group-hover:bg-primary/10 group-hover:text-primary`}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-col gap-1.5">
              <span className="truncate text-xl font-bold tabular-nums tracking-tight text-foreground transition-colors group-hover:text-primary">
                {fmt(item.value)}
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                {item.denom}
              </span>
              <div className="h-5 w-full overflow-hidden rounded-full bg-muted">
                <div className="relative h-full w-full">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${item.barColor}`}
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums text-foreground/70">
                    {item.percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
