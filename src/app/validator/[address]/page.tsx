import { getValidatorSummary, CHAINS } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
          className="group rounded-lg border border-white/10 bg-white/50 p-3 shadow-sm transition-colors hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10">
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
          <div className="flex w-fit items-center gap-3 rounded-md border border-white/10 bg-muted/50 p-2 pl-4">
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
        <Card className="glass-card group relative overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Total Delegated
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatAmount(summary.total_delegated_amount.toString())}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card group relative overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Delegators
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {summary.total_delegators_count}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card group relative overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Total Unbonding
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatAmount(summary.total_undelegated_amount.toString())}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card group relative overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Undelegators
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {summary.total_undelegators_count}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="delegations" className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid h-12 w-full max-w-md grid-cols-2 rounded-full border border-white/10 bg-black/5 p-1 shadow-inner backdrop-blur-xl dark:bg-white/5">
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

        <TabsContent value="delegations" className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Delegations
              </h2>
              <p className="text-muted-foreground">
                Current delegations to this validator.
              </p>
            </div>
          </div>
          <ValidatorDelegationList valAddress={address} />
        </TabsContent>

        <TabsContent value="unbonding" className="space-y-4 outline-none">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-gradient text-2xl font-bold tracking-tight">
                Unbonding
              </h2>
              <p className="text-muted-foreground">
                Delegations currently unbonding from this validator.
              </p>
            </div>
          </div>
          <ValidatorUnbondingList valAddress={address} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
