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
          className="group rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted">
          <ArrowLeft className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </Link>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Address Details
            </h1>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 px-3 py-1 font-mono text-sm text-primary">
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
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:bg-muted">
              <span className="text-xs font-medium text-muted-foreground">
                Account #
              </span>
              <span className="font-mono font-medium text-foreground">
                {data.account.account_number}
              </span>
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:bg-muted"
              title="Number of transactions sent from this account">
              <span className="text-xs font-medium text-muted-foreground">
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
        <Card className="surface-card group">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
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

        <Card className="surface-card group">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
              Staked (Delegated)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="text-blue-600 dark:text-blue-400">
                {formatAmount(data.account.staking_amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card group">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
              Unbonding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="text-orange-600 dark:text-orange-400">
                {formatAmount(data.account.unbonding_amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card group">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="text-emerald-600 dark:text-emerald-400">
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
                <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Validator
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Amount
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
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
                      className="group h-16 border-b border-border/50 transition-colors hover:bg-primary/5">
                      <TableCell className="px-6 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
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
                      <TableCell className="px-6 text-right font-mono text-sm text-emerald-600 transition-colors group-hover:text-foreground dark:text-emerald-400">
                        {formatAmount(item.delegation_amount.toString())}
                      </TableCell>
                      <TableCell className="px-6 text-right font-mono text-sm text-foreground/80 transition-colors group-hover:text-foreground">
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
                <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Validator
                  </TableHead>
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    Completion
                  </TableHead>
                  <TableHead className="h-12 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
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
                      className="group h-16 border-b border-border/50 transition-colors hover:bg-primary/5">
                      <TableCell className="px-6 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
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
                      <TableCell className="px-6 text-right font-mono text-sm text-foreground/80 transition-colors group-hover:text-foreground">
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
