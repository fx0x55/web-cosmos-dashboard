import { DEFAULT_CHAIN_ID, getAccountDetail, CHAINS } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAmount, truncateAddress, formatDateTime } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'
import { AddressToggle } from '@/components/address-toggle'
import { getAccountTypeLabels } from '@/lib/address-labels'

export default async function AddressPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>
  searchParams: Promise<{ chain?: string }>
}) {
  const { address } = await params
  const { chain: chainId = DEFAULT_CHAIN_ID } = await searchParams
  const chainConfig = CHAINS.find(c => c.id === chainId) || CHAINS[0]

  const data = await getAccountDetail(address)
  const typeLabels = getAccountTypeLabels(data.account)

  return (
    <div className="space-y-10">
      <div className="flex items-start gap-6 pt-4">
        <Link
          href={`/?chain=${chainId}`}
          className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/40 to-muted/20 p-3 transition-all duration-300 ease-out hover:border-primary/20 hover:shadow-sm">
          <ArrowLeft className="h-5 w-5 text-muted-foreground/70 transition-colors duration-200 group-hover:text-primary" />
        </Link>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Address Details
            </h1>
            <Badge
              variant="outline"
              className="border-primary/20 bg-gradient-to-r from-primary/10 to-purple-500/10 px-3 py-1 font-mono text-sm text-primary">
              {chainId}
            </Badge>
            {typeLabels.map((label, i) => (
              <Badge key={i} variant="outline" className={label.className}>
                {label.label}
              </Badge>
            ))}
          </div>
          <AddressToggle
            address={address}
            ethAddress={data.account.eth_address}
            explorerBaseUrl={`${chainConfig.explorer_base_url}address/`}
          />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-gradient-to-br from-muted/30 to-transparent px-3 py-1.5 transition-all duration-200 ease-out hover:bg-muted/50">
              <span className="text-xs font-medium text-muted-foreground/60">
                Account #
              </span>
              <span className="font-mono font-medium text-foreground">
                {data.account.account_number}
              </span>
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border border-border/40 bg-gradient-to-br from-muted/30 to-transparent px-3 py-1.5 transition-all duration-200 ease-out hover:bg-muted/50"
              title="Number of transactions sent from this account">
              <span className="text-xs font-medium text-muted-foreground/60">
                Tx Count
              </span>
              <span className="font-mono font-medium text-foreground">
                {data.account.sequence}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="surface-card gradient-border-top group">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary/80">
              Spendable Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="text-foreground">
                {formatAmount(data.account.amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card group border-t-2 border-t-blue-400">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary/80">
              Staked (Delegated)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                {formatAmount(data.account.staking_amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card group border-t-2 border-t-orange-400">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary/80">
              Unbonding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent dark:from-orange-400 dark:to-orange-300">
                {formatAmount(data.account.unbonding_amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card group border-t-2 border-t-emerald-400">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary/80">
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
                +{formatAmount(data.account.reward_amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground">
              Delegations
              <Badge
                variant="secondary"
                className="bg-primary/10 px-2 text-sm font-normal text-primary hover:bg-primary/20">
                {data.account.staking_count}
              </Badge>
            </h2>
          </div>

          <div className="surface-panel overflow-hidden rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/30 bg-gradient-to-r from-muted/30 to-muted/10 hover:bg-muted/30">
                  <TableHead className="h-11 px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Validator
                  </TableHead>
                  <TableHead className="h-11 px-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Amount
                  </TableHead>
                  <TableHead className="h-11 px-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Reward
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.stakings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground">
                      This address has no active delegations.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.stakings.map((item, i) => (
                    <TableRow
                      key={i}
                      className="group h-14 border-b border-border/20 transition-all duration-300 ease-out hover:bg-primary/[0.025] hover:shadow-[inset_3px_0_0_0_hsl(var(--primary)/0.7)]">
                      <TableCell className="px-6 text-sm text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90">
                        <div className="flex flex-col gap-0.5">
                          <Link
                            href={`/validator/${item.val_address}?chain=${chainId}`}
                            className="hover:underline">
                            {item.val_moniker && (
                              <span className="font-medium text-foreground">
                                {item.val_moniker}
                              </span>
                            )}
                          </Link>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/validator/${item.val_address}?chain=${chainId}`}
                              className="font-mono text-xs text-muted-foreground hover:underline"
                              title={item.val_address}>
                              {truncateAddress(item.val_address)}
                            </Link>
                            <CopyButton value={item.val_address} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-right font-mono text-sm text-emerald-600/80 transition-colors duration-300 group-hover:text-emerald-600 dark:text-emerald-400/80 dark:group-hover:text-emerald-400">
                        {formatAmount(item.delegation_amount.toString())}
                      </TableCell>
                      <TableCell className="px-6 text-right font-mono text-sm text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90">
                        {formatAmount(item.reward_amount.toString())}{' '}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Unbonding
            </h2>
          </div>

          <div className="surface-panel overflow-hidden rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/30 bg-gradient-to-r from-muted/30 to-muted/10 hover:bg-muted/30">
                  <TableHead className="h-11 px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Validator
                  </TableHead>
                  <TableHead className="h-12 px-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Completion
                  </TableHead>
                  <TableHead className="h-11 px-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.unbondings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center text-muted-foreground">
                      No tokens are currently unbonding from this address.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.unbondings.map((item, i) => (
                    <TableRow
                      key={i}
                      className="group h-14 border-b border-border/20 transition-all duration-300 ease-out hover:bg-primary/[0.025] hover:shadow-[inset_3px_0_0_0_hsl(var(--primary)/0.7)]">
                      <TableCell className="px-6 text-sm text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90">
                        <div className="flex flex-col gap-0.5">
                          <Link
                            href={`/validator/${item.val_address}?chain=${chainId}`}
                            className="hover:underline">
                            {item.val_moniker && (
                              <span className="font-medium text-foreground">
                                {item.val_moniker}
                              </span>
                            )}
                          </Link>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/validator/${item.val_address}?chain=${chainId}`}
                              className="font-mono text-xs text-muted-foreground hover:underline"
                              title={item.val_address}>
                              {truncateAddress(item.val_address)}
                            </Link>
                            <CopyButton value={item.val_address} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatDateTime(item.completion_time_ms)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-right font-mono text-sm text-foreground/70 transition-colors duration-300 group-hover:text-foreground/90">
                        {formatAmount(item.unbonding_amount.toString())}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
