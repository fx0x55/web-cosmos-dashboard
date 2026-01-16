"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChainStats } from "@/lib/api";
import { ChainStats } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Coins, Lock, Unlock, PiggyBank } from "lucide-react";

export function DashboardStats() {
  const searchParams = useSearchParams();
  const chainId = searchParams.get("chain") || "cosmos";
  
  const [stats, setStats] = useState<ChainStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getChainStats(chainId);
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [chainId]);

  const items = [
    {
      title: "Total Supply",
      value: stats?.totalSupply.amount,
      denom: stats?.totalSupply.denom,
      icon: Coins,
      color: "text-blue-500",
    },
    {
      title: "Bonded Tokens",
      value: stats?.bondedTokens.amount,
      denom: stats?.bondedTokens.denom,
      icon: Lock,
      color: "text-emerald-500",
    },
    {
      title: "Not Bonded Tokens",
      value: stats?.notBondedTokens.amount,
      denom: stats?.notBondedTokens.denom,
      icon: Unlock,
      color: "text-amber-500",
    },
    {
      title: "Community Pool",
      value: stats?.communityPool.amount,
      denom: stats?.communityPool.denom,
      icon: PiggyBank,
      color: "text-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <Card 
          key={i} 
          className="glass-card border-none ring-1 ring-white/10 dark:ring-white/5"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-xl bg-background/50 dark:bg-white/5 ring-1 ring-white/20 transition-colors group-hover:bg-primary/10 group-hover:ring-primary/20`}>
                <item.icon className={`h-4 w-4 ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex flex-col gap-1 tracking-tight">
              <span className="truncate bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent" title={item.value}>
                {parseInt(item.value || "0").toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {item.denom}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
