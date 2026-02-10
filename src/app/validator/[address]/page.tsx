import { getValidatorSummary, CHAINS } from '@/lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAmount } from '@/lib/utils'
import { ArrowLeft, Users, Coins, UserMinus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ValidatorDelegationList } from '@/components/lists/validator-delegation-list'
import { ValidatorUnbondingList } from '@/components/lists/validator-unbonding-list'

export default async function ValidatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>
  searchParams: Promise<{ chain?: string }>
}) {
  const { address } = await params
  const { chain: chainId = 'aifx' } = await searchParams
  const chainConfig = CHAINS.find(c => c.id === chainId) || CHAINS[0]

  // Fetch validator summary
  let summary
  try {
    summary = await getValidatorSummary(address)
  } catch (error) {
    console.error('Failed to fetch validator summary', error)
    // Handle error gracefully, maybe show not found or empty
    summary = {
      val_address: address,
      val_moniker: 'Unknown Validator',
      total_delegators_count: 0,
      total_delegated_amount: 0,
      total_undelegators_count: 0,
      total_undelegated_amount: 0,
    }
  }

  return (
    <div className="space-y-10 duration-700 animate-in fade-in slide-in-from-bottom-8">
      {/* Header Section */}
      <div className="flex items-start gap-6 pt-4">
        <Link
          href={`/?chain=${chainId}`}
          className="group rounded-2xl border border-white/10 bg-white/50 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10">
          <ArrowLeft className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </Link>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {summary.val_moniker}
            </h1>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 px-3 py-1 font-mono text-sm uppercase tracking-wider text-primary backdrop-blur-sm">
              Validator
            </Badge>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-muted/50 p-2 pl-4">
            <span className="break-all font-mono text-base text-muted-foreground">
              {address}
            </span>
            <CopyButton value={address} />
            <div className="mx-1 h-4 w-px bg-white/10" />
            <a
              href={`${chainConfig.explorer_base_url}validator/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary hover:underline">
              <span>View in Explorer</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden border-white/10 bg-white/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md dark:bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Delegated
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(summary.total_delegated_amount.toString())}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-white/10 bg-white/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md dark:bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delegators
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.total_delegators_count}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-white/10 bg-white/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md dark:bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unbonding Amount
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(summary.total_undelegated_amount.toString())}
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-white/10 bg-white/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md dark:bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Undelegators
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.total_undelegators_count}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="delegations" className="space-y-6">
        <TabsList className="grid h-12 w-full max-w-md grid-cols-2 rounded-2xl bg-white/20 p-1 backdrop-blur-md dark:bg-white/10">
          <TabsTrigger
            value="delegations"
            className="rounded-xl px-8 transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-black/40">
            Delegations
          </TabsTrigger>
          <TabsTrigger
            value="unbonding"
            className="rounded-xl px-8 transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-black/40">
            Unbondings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="delegations" className="space-y-4 outline-none">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Delegations</CardTitle>
              <CardDescription>
                List of addresses currently delegating to this validator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValidatorDelegationList valAddress={address} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unbonding" className="space-y-4 outline-none">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Unbonding Delegations</CardTitle>
              <CardDescription>
                List of unbonding events from this validator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValidatorUnbondingList valAddress={address} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
