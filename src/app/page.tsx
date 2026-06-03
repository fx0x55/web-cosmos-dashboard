'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { BalanceList } from '@/components/lists/balance-list'
import { ModuleAccountBalanceList } from '@/components/lists/module-account-balance-list'
import { CrosschainModuleBalanceList } from '@/components/lists/crosschain-module-balance-list'
import { Erc20ModuleBalanceList } from '@/components/lists/erc20-module-balance-list'
import { SupplyBalanceList } from '@/components/lists/supply-balance-list'
import { DelegationList } from '@/components/lists/delegation-list'
import { UnbondingList } from '@/components/lists/unbonding-list'
import { CrosschainOraclesList } from '@/components/lists/crosschain-oracles-list'
import { CrosschainBridgeTokensList } from '@/components/lists/crosschain-bridge-tokens-list'
import { DashboardStats } from '@/components/dashboard-stats'

const BALANCE_SUBTABS = [
  { value: 'accounts', label: 'Accounts' },
  { value: 'module-accounts', label: 'Chain Modules' },
  { value: 'crosschain-modules', label: 'Bridge Modules' },
  { value: 'erc20-modules', label: 'ERC20 Module' },
  { value: 'total-supply', label: 'Total Supply' },
] as const

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tab = searchParams.get('tab') || 'balances'
  const subtab = searchParams.get('subtab') || 'accounts'

  const setTab = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', value)
      if (value !== 'balances') {
        params.delete('subtab')
      }
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const setSubtab = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('subtab', value)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-10">
      {/* Hero section with glow */}
      <section className="hero-glow -mx-6 -mt-8 px-6 pb-8 pt-12 md:-mx-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-display text-4xl font-black tracking-tight md:text-5xl">
            Chain Overview
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Balances and staking metrics
          </p>
          <div className="mt-6">
            <DashboardStats />
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <Tabs value={tab} onValueChange={setTab} className="w-full space-y-8">
        <TabsList className="flex h-auto w-full justify-start gap-2 rounded-none border-b border-border/30 bg-transparent p-0">
          <TabsTrigger
            value="balances"
            className="relative rounded-none border-b-[3px] border-transparent px-5 pb-3.5 text-sm font-semibold text-muted-foreground transition-all duration-300 ease-out hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="delegations"
            className="relative rounded-none border-b-[3px] border-transparent px-5 pb-3.5 text-sm font-semibold text-muted-foreground transition-all duration-300 ease-out hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Delegations
          </TabsTrigger>
          <TabsTrigger
            value="unbonding"
            className="relative rounded-none border-b-[3px] border-transparent px-5 pb-3.5 text-sm font-semibold text-muted-foreground transition-all duration-300 ease-out hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Unbonding
          </TabsTrigger>
          <TabsTrigger
            value="crosschain-oracles"
            className="relative rounded-none border-b-[3px] border-transparent px-5 pb-3.5 text-sm font-semibold text-muted-foreground transition-all duration-300 ease-out hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Oracles
          </TabsTrigger>
          <TabsTrigger
            value="bridge-tokens"
            className="relative rounded-none border-b-[3px] border-transparent px-5 pb-3.5 text-sm font-semibold text-muted-foreground transition-all duration-300 ease-out hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
            Bridges
          </TabsTrigger>
        </TabsList>

        {/* Balances: secondary pill navigation */}
        <TabsContent value="balances" className="space-y-6 outline-none">
          <div className="space-y-4 px-1">
            <h2 className="section-accent text-2xl font-bold tracking-tight text-foreground">
              Token Balances
            </h2>
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Balance type">
              {BALANCE_SUBTABS.map(st => (
                <button
                  key={st.value}
                  role="tab"
                  aria-selected={subtab === st.value}
                  onClick={() => setSubtab(st.value)}
                  className={cn(
                    'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ease-out',
                    subtab === st.value
                      ? 'border border-primary/20 bg-gradient-to-r from-primary/[0.12] to-purple-500/[0.08] text-primary shadow-md shadow-primary/[0.1]'
                      : 'border border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  )}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {subtab === 'accounts' && <BalanceList />}

          {subtab === 'module-accounts' && (
            <div className="space-y-4">
              <p className="px-1 text-sm text-muted-foreground/70">
                Built-in chain modules (e.g. staking, distribution) and their
                token holdings.
              </p>
              <ModuleAccountBalanceList />
            </div>
          )}

          {subtab === 'crosschain-modules' && (
            <div className="space-y-4">
              <p className="px-1 text-sm text-muted-foreground/70">
                Bridge modules that hold tokens for cross-chain transfers.
              </p>
              <CrosschainModuleBalanceList />
            </div>
          )}

          {subtab === 'erc20-modules' && (
            <div className="space-y-4">
              <p className="px-1 text-sm text-muted-foreground/70">
                The ERC20 module account, which manages EVM-compatible token
                representations on-chain.
              </p>
              <Erc20ModuleBalanceList />
            </div>
          )}

          {subtab === 'total-supply' && (
            <div className="space-y-4">
              <p className="px-1 text-sm text-muted-foreground/70">
                Every token type currently in circulation on the network.
              </p>
              <SupplyBalanceList />
            </div>
          )}
        </TabsContent>

        {/* Delegations */}
        <TabsContent value="delegations" className="space-y-6 outline-none">
          <div className="px-1">
            <h2 className="section-accent text-2xl font-bold tracking-tight text-foreground">
              Delegations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Accounts ranked by staked token amount.
            </p>
          </div>
          <DelegationList />
        </TabsContent>

        {/* Unbonding */}
        <TabsContent value="unbonding" className="space-y-6 outline-none">
          <div className="px-1">
            <h2 className="section-accent text-2xl font-bold tracking-tight text-foreground">
              Unbonding
            </h2>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Tokens currently in the 21-day unbonding period before they can be
              withdrawn.
            </p>
          </div>
          <UnbondingList />
        </TabsContent>

        {/* Oracles */}
        <TabsContent
          value="crosschain-oracles"
          className="space-y-6 outline-none">
          <div className="px-1">
            <h2 className="section-accent text-2xl font-bold tracking-tight text-foreground">
              Oracles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Relayers that attest to events on connected external chains (e.g.
              Ethereum). Each oracle monitors a bridge and reports block heights
              and events.
            </p>
          </div>
          <CrosschainOraclesList />
        </TabsContent>

        {/* Bridge Tokens */}
        <TabsContent value="bridge-tokens" className="space-y-6 outline-none">
          <div className="px-1">
            <h2 className="section-accent text-2xl font-bold tracking-tight text-foreground">
              Bridge Tokens
            </h2>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Tokens registered for transfer between this chain and external
              networks via bridges.
            </p>
          </div>
          <CrosschainBridgeTokensList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
