"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceList } from "@/components/lists/balance-list";
import { DelegationList } from "@/components/lists/delegation-list";
import { UnbondingList } from "@/components/lists/unbonding-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard-stats";

export default function Home() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <DashboardStats />

      <Tabs defaultValue="balances" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-3 h-16 p-2 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-inner">
          <TabsTrigger 
            value="balances" 
            className="rounded-xl h-full text-base font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger 
            value="delegations"
            className="rounded-xl h-full text-base font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
          >
            Delegations
          </TabsTrigger>
          <TabsTrigger 
            value="unbonding"
            className="rounded-xl h-full text-base font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all duration-300"
          >
            Unbonding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4 outline-none">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Latest Balances</CardTitle>
              <CardDescription>Recent account balance updates on the network.</CardDescription>
            </CardHeader>
            <CardContent>
              <BalanceList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delegations" className="space-y-4 outline-none">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Active Delegations</CardTitle>
              <CardDescription>Recent delegation activities to validators.</CardDescription>
            </CardHeader>
            <CardContent>
              <DelegationList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unbonding" className="space-y-4 outline-none">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Unbonding Delegations</CardTitle>
              <CardDescription>Delegations currently in the unbonding period.</CardDescription>
            </CardHeader>
            <CardContent>
              <UnbondingList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
