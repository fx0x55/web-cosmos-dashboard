'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

export default function Home() {
  return (
    <div className="space-y-10 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <DashboardStats />

      <Tabs defaultValue="balances" className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid h-12 w-full max-w-xl grid-cols-5 rounded-full border border-white/10 bg-black/5 p-1 shadow-inner backdrop-blur-xl dark:bg-white/5">
            <TabsTrigger
              value="balances"
              className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Balances
            </TabsTrigger>
            <TabsTrigger
              value="delegations"
              className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Delegations
            </TabsTrigger>
            <TabsTrigger
              value="unbonding"
              className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Unbonding
            </TabsTrigger>
            <TabsTrigger
              value="crosschain-oracles"
              className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Oracles
            </TabsTrigger>
            <TabsTrigger
              value="bridge-tokens"
              className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              Bridge Tokens
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="balances" className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Latest Balances
              </h2>
              <p className="text-muted-foreground">
                Recent account balance updates on the network.
              </p>
            </div>
          </div>
          <Tabs defaultValue="accounts" className="space-y-6">
            <div className="flex justify-start px-1">
              <TabsList className="grid h-11 w-full max-w-3xl grid-cols-5 rounded-full border border-white/10 bg-black/5 p-1 shadow-inner backdrop-blur-xl dark:bg-white/5">
                <TabsTrigger
                  value="accounts"
                  className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Accounts
                </TabsTrigger>
                <TabsTrigger
                  value="module-accounts"
                  className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Module Accounts
                </TabsTrigger>
                <TabsTrigger
                  value="crosschain-modules"
                  className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Cross-chain Modules
                </TabsTrigger>
                <TabsTrigger
                  value="erc20-modules"
                  className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  ERC20 Modules
                </TabsTrigger>
                <TabsTrigger
                  value="total-supply"
                  className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  Total Supply
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="accounts" className="outline-none">
              <BalanceList />
            </TabsContent>

            <TabsContent
              value="module-accounts"
              className="space-y-4 outline-none">
              <div className="px-1">
                <p className="text-sm text-muted-foreground">
                  Module accounts fetched from the chain LCD and their current
                  balances.
                </p>
              </div>
              <ModuleAccountBalanceList />
            </TabsContent>

            <TabsContent
              value="crosschain-modules"
              className="space-y-4 outline-none">
              <div className="px-1">
                <p className="text-sm text-muted-foreground">
                  Supported cross-chain modules from bridge chain list, with
                  module account addresses and all current balances.
                </p>
              </div>
              <CrosschainModuleBalanceList />
            </TabsContent>

            <TabsContent
              value="erc20-modules"
              className="space-y-4 outline-none">
              <div className="px-1">
                <p className="text-sm text-muted-foreground">
                  ERC20 module accounts fetched from module accounts, with all
                  current balances.
                </p>
              </div>
              <Erc20ModuleBalanceList />
            </TabsContent>

            <TabsContent
              value="total-supply"
              className="space-y-4 outline-none">
              <div className="px-1">
                <p className="text-sm text-muted-foreground">
                  Total supply of all denominations on the network.
                </p>
              </div>
              <SupplyBalanceList />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="delegations" className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Active Delegations
              </h2>
              <p className="text-muted-foreground">
                Recent delegation activities to validators.
              </p>
            </div>
          </div>
          <DelegationList />
        </TabsContent>

        <TabsContent value="unbonding" className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Unbonding Delegations
              </h2>
              <p className="text-muted-foreground">
                Delegations currently in the unbonding period.
              </p>
            </div>
          </div>
          <UnbondingList />
        </TabsContent>

        <TabsContent
          value="crosschain-oracles"
          className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Crosschain Oracles
              </h2>
              <p className="text-muted-foreground">
                Oracle status and event information for supported crosschain
                bridges.
              </p>
            </div>
          </div>
          <CrosschainOraclesList />
        </TabsContent>

        <TabsContent value="bridge-tokens" className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Bridge Tokens
              </h2>
              <p className="text-muted-foreground">
                Registered bridge tokens for supported crosschain bridges.
              </p>
            </div>
          </div>
          <CrosschainBridgeTokensList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
