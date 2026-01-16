import { Suspense } from "react";
import { getAccountDetail } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AddressPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ chain?: string }>;
}) {
  const { address } = await params;
  const { chain: chainId = "aifx" } = await searchParams;

  const data = await getAccountDetail(chainId, address);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-start gap-6 pt-4">
        <Link 
          href={`/?chain=${chainId}`}
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105 shadow-sm group"
        >
          <ArrowLeft className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Address Details
            </h1>
            <Badge variant="outline" className="text-sm px-3 py-1 uppercase font-mono tracking-wider bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
              {chainId}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-base break-all bg-muted/50 p-3 rounded-xl border border-white/10 w-fit select-all">
            {address}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card border-none">
          <CardHeader className="pb-4 space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold flex items-baseline gap-3 tracking-tight">
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {formatAmount(data.balance.amount)}
              </span>
              <span className="text-xl text-muted-foreground font-medium uppercase">
                {data.balance.denom}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="pb-4 space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold flex items-baseline gap-3 tracking-tight">
               <span className="bg-gradient-to-br from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                +{formatAmount(data.rewards[0]?.amount)}
              </span>
              <span className="text-xl text-muted-foreground font-medium uppercase">
                {data.rewards[0]?.denom || ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Delegations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-white/30 dark:bg-black/20">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableHead className="text-muted-foreground font-medium h-14 px-6 text-base bg-white/20 dark:bg-black/20">Validator</TableHead>
                    <TableHead className="text-muted-foreground font-medium h-14 px-6 text-base bg-white/20 dark:bg-black/20 text-right">Reward</TableHead>
                    <TableHead className="text-right text-muted-foreground font-medium h-14 px-6 text-base bg-white/20 dark:bg-black/20">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.delegations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-32 text-muted-foreground text-lg">
                        No delegations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.delegations.map((item, i) => (
                      <TableRow key={i} className="hover:bg-primary/5 border-white/5 transition-colors h-20 group">
                        <TableCell className="font-medium px-6 text-base text-foreground/80 group-hover:text-foreground transition-colors">
                          <div className="flex flex-col">
                            <span>{item.validatorName}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {item.validatorAddress}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono px-6 text-base group-hover:text-foreground transition-colors text-emerald-600 dark:text-emerald-400">
                          +{formatAmount(item.reward?.amount)} {item.reward?.denom}
                        </TableCell>
                        <TableCell className="text-right font-mono px-6 text-base text-foreground/80 group-hover:text-foreground transition-colors">
                          {formatAmount(item.amount)} {item.denom}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Unbonding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-white/30 dark:bg-black/20">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableHead className="text-muted-foreground font-medium h-14 px-6 text-base bg-white/20 dark:bg-black/20">Validator</TableHead>
                    <TableHead className="text-muted-foreground font-medium h-14 px-6 text-base bg-white/20 dark:bg-black/20">Completion</TableHead>
                    <TableHead className="text-right text-muted-foreground font-medium h-14 px-6 text-base bg-white/20 dark:bg-black/20">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.unbonding.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-32 text-muted-foreground text-lg">
                        No unbonding records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.unbonding.map((item, i) => (
                      <TableRow key={i} className="hover:bg-primary/5 border-white/5 transition-colors h-20 group">
                        <TableCell className="font-medium px-6 text-base text-foreground/80 group-hover:text-foreground transition-colors">
                          <div className="flex flex-col">
                            <span>{item.validatorName}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {item.validatorAddress}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge variant="secondary" className="font-mono text-xs bg-secondary/50">
                            {new Date(item.completionTime).toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono px-6 text-base text-foreground/80 group-hover:text-foreground transition-colors">
                          {formatAmount(item.amount)} {item.denom}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
