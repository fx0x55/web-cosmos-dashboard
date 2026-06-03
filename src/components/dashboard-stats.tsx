'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_CHAIN_ID, getChainStats } from '@/lib/api'
import type { ChainStats } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import {
  Lock,
  Unlock,
  PiggyBank,
  ArrowRightLeft,
  Wallet,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getChainStats(chainId)
        if (!cancelled) setStats(data)
      } catch (err) {
        if (!cancelled) {
          console.error(err)
          setError(
            'Unable to load chain statistics. Check your connection and try again.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [chainId])

  const fetchStats = useCallback(() => {
    setLoading(true)
    setError(null)
    getChainStats(chainId)
      .then(data => setStats(data))
      .catch(err => {
        console.error(err)
        setError(
          'Unable to load chain statistics. Check your connection and try again.'
        )
      })
      .finally(() => setLoading(false))
  }, [chainId])

  const m = stats?.migration
  const migrated = m?.migratedSupply || '0'

  const percentItems = [
    {
      title: 'User Balances',
      value: m?.userBalance,
      denom: stats?.totalSupply.denom,
      icon: Wallet,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/15',
      barColor: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      borderColor: 'border-t-cyan-400',
      percent: m ? calcPercent(m.userBalance, migrated) : 0,
    },
    {
      title: 'Bonded Tokens',
      value: stats?.bondedTokens.amount,
      denom: stats?.bondedTokens.denom,
      icon: Lock,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      barColor: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
      borderColor: 'border-t-emerald-400',
      percent: m ? calcPercent(m.userDelegation, migrated) : 0,
    },
    {
      title: 'Unbonding Tokens',
      value: stats?.notBondedTokens.amount,
      denom: stats?.notBondedTokens.denom,
      icon: Unlock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
      barColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
      borderColor: 'border-t-amber-400',
      percent: m ? calcPercent(m.userUnbonding, migrated) : 0,
    },
    {
      title: 'Community Pool',
      value: stats?.communityPool.amount,
      denom: stats?.communityPool.denom,
      icon: PiggyBank,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/15',
      barColor: 'bg-gradient-to-r from-purple-400 to-purple-500',
      borderColor: 'border-t-purple-400',
      percent: m
        ? calcPercent(stats?.communityPool.amount || '0', migrated)
        : 0,
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="surface-card h-48 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-2 pt-5">
            <div className="shimmer h-3.5 w-24 rounded bg-muted/50" />
            <div className="shimmer h-8 w-8 rounded-full bg-muted/50" />
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="shimmer mt-2 h-8 w-40 rounded bg-muted/50" />
            <div className="mt-4 space-y-2">
              <div className="shimmer h-3 w-full rounded bg-muted/50" />
              <div className="shimmer h-3 w-full rounded bg-muted/50" />
              <div className="shimmer h-3 w-3/4 rounded bg-muted/50" />
            </div>
          </CardContent>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="surface-card h-[88px]"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-1 pt-4">
                <div className="shimmer h-3 w-16 rounded bg-muted/50" />
                <div className="shimmer h-7 w-7 rounded-lg bg-muted/50" />
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0">
                <div className="shimmer mt-1 h-5 w-20 rounded bg-muted/50" />
              </CardContent>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-12">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          className="gap-2 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Migration Total - Hero Metric */}
      <Card className="surface-card gradient-border-top lg:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5 pb-2 pt-5">
          <div className="min-w-0">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Migrated Supply
            </CardTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground/60">
              Total token supply, excluding the ETH module reserve
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-gradient-to-br from-primary/15 to-purple-500/10 p-2 text-primary">
            <ArrowRightLeft className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          <div className="flex items-baseline gap-2">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tabular-nums tracking-tight text-transparent">
              {fmt(m?.migratedSupply)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {stats?.totalSupply.denom}
            </span>
          </div>

          <div className="mt-4 space-y-2 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 px-4 py-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-mono tabular-nums text-foreground">
                {fmt(stats?.totalSupply.amount)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground">ETH Module Reserve</span>
              <span className="font-mono tabular-nums text-red-500">
                -{fmt(m?.ethModuleBalance)}
              </span>
            </div>
            <div className="border-t border-border/50 pt-2">
              <div className="flex items-baseline justify-between gap-3 font-semibold">
                <span className="text-muted-foreground">Migrated Supply</span>
                <span className="font-mono tabular-nums text-primary">
                  {fmt(m?.migratedSupply)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics - 2x2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {percentItems.map((item, i) => (
          <Card
            key={i}
            className={cn('surface-card group border-t-2', item.borderColor)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-1 pt-4">
              <CardTitle className="truncate text-[11px] font-medium text-muted-foreground/70">
                {item.title}
              </CardTitle>
              <div className={cn('rounded-md p-1', item.bgColor)}>
                <item.icon className={cn('h-3.5 w-3.5 shrink-0', item.color)} />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="flex flex-col gap-2">
                <span className="truncate text-lg font-bold tabular-nums tracking-tight text-foreground">
                  {fmt(item.value)}
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className={cn(
                      'progress-animate h-full rounded-full',
                      item.barColor
                    )}
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium tabular-nums text-muted-foreground/60">
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
