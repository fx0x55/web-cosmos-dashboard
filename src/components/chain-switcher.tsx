"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHAINS, getChains } from "@/lib/api";
import { Chain } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function ChainSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chains, setChains] = React.useState<Chain[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Get current chain from URL or default to first chain
  const currentChainId = searchParams.get("chain") || "cosmos";

  React.useEffect(() => {
    const fetchChains = async () => {
      try {
        const data = await getChains();
        setChains(data);
      } catch (error) {
        console.error("Failed to fetch chains", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChains();
  }, []);

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("chain", value);
    router.push(`?${params.toString()}`);
  };

  if (loading) {
    return <Skeleton className="h-10 w-[180px]" />;
  }

  const currentChain = chains.find((c) => c.id === currentChainId) || chains[0];

  return (
    <Select value={currentChainId} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px] h-11 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-white/20 transition-all hover:scale-105 duration-200">
        <SelectValue placeholder="Select chain">
          <div className="flex items-center gap-2">
            <span>{currentChain?.icon}</span>
            <span className="font-medium">{currentChain?.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id}>
            <div className="flex items-center gap-2">
              <span>{chain.icon}</span>
              <span>{chain.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
