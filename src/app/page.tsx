'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BalanceList } from '@/components/lists/balance-list'
import { DelegationList } from '@/components/lists/delegation-list'
import { UnbondingList } from '@/components/lists/unbonding-list'
import { DashboardStats } from '@/components/dashboard-stats'

export default function Home() {
  return (
    <div className="space-y-10 duration-700 animate-in fade-in slide-in-from-bottom-4">
      <DashboardStats />

      <Tabs defaultValue="balances" className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid h-12 w-full max-w-md grid-cols-3 rounded-full border border-white/10 bg-black/5 p-1 shadow-inner backdrop-blur-xl dark:bg-white/5">
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
          <BalanceList />
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
      </Tabs>
    </div>
  )
}
