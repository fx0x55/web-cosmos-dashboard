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
      <section className="hero-glow -mx-6 -mt-8 px-6 pb-6 pt-10 md:-mx-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Chain Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Real-time migration and staking metrics
          </p>
          <div className="mt-6">
            <DashboardStats />
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <Tabs value={tab} onValueChange={setTab} className="w-full space-y-8">
        <TabsList className="flex h-auto w-full justify-start gap-1 rounded-none border-b border-border/30 bg-transparent p-0">
          <TabsTrigger
            value="balances"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 text-sm font-medium text-muted-foreground/70 transition-all duration-300 ease-out data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-muted-foreground">
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="delegations"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 text-sm font-medium text-muted-foreground/70 transition-all duration-300 ease-out data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-muted-foreground">
            Delegations
          </TabsTrigger>
          <TabsTrigger
            value="unbonding"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 text-sm font-medium text-muted-foreground/70 transition-all duration-300 ease-out data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-muted-foreground">
            Unbonding
          </TabsTrigger>
          <TabsTrigger
            value="crosschain-oracles"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 text-sm font-medium text-muted-foreground/70 transition-all duration-300 ease-out data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-muted-foreground">
            Oracles
          </TabsTrigger>
          <TabsTrigger
            value="bridge-tokens"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 text-sm font-medium text-muted-foreground/70 transition-all duration-300 ease-out data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-muted-foreground">
            Bridges
          </TabsTrigger>
        </TabsList>

        {/* Balances: secondary pill navigation */}
        <TabsContent value="balances" className="space-y-6 outline-none">
          <div className="space-y-4 px-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
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
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out',
                    subtab === st.value
                      ? 'bg-primary/[0.08] text-primary shadow-sm shadow-primary/[0.06]'
                      : 'text-muted-foreground/70 hover:bg-muted/60 hover:text-muted-foreground'
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
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
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
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
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
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
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
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
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
