import { getAccountDetail, CHAINS } from '@/lib/api'
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

export default async function AddressPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>
  searchParams: Promise<{ chain?: string }>
}) {
  const { address } = await params
  const { chain: chainId = 'aifx' } = await searchParams
  const chainConfig = CHAINS.find(c => c.id === chainId) || CHAINS[0]

  const data = await getAccountDetail(address)

  return (
    <div className="space-y-10 duration-700 animate-in fade-in slide-in-from-bottom-8">
      <div className="flex items-start gap-6 pt-4">
        <Link
          href={`/?chain=${chainId}`}
          className="group rounded-2xl border border-white/10 bg-white/50 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10">
          <ArrowLeft className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </Link>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Address Details
            </h1>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 px-3 py-1 font-mono text-sm uppercase tracking-wider text-primary backdrop-blur-sm">
              {chainId}
            </Badge>
          </div>
          <p className="w-fit select-all break-all rounded-xl border border-white/10 bg-muted/50 p-3 font-mono text-base text-muted-foreground">
            {address}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card border-none">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3 text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {formatAmount(data.account.amount.toString())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-emerald-500">
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3 text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                +{formatAmount(data.account.reward_amount.toString())}
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
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/30 dark:bg-black/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="h-14 bg-white/20 px-6 text-base font-medium text-muted-foreground dark:bg-black/20">
                      Validator
                    </TableHead>
                    <TableHead className="h-14 bg-white/20 px-6 text-right text-base font-medium text-muted-foreground dark:bg-black/20">
                      Amount
                    </TableHead>
                    <TableHead className="h-14 bg-white/20 px-6 text-right text-base font-medium text-muted-foreground dark:bg-black/20">
                      Reward
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.stakings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-32 text-center text-lg text-muted-foreground">
                        No delegations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.stakings.map((item, i) => (
                      <TableRow
                        key={i}
                        className="group h-20 border-white/5 transition-colors hover:bg-primary/5">
                        <TableCell className="px-6 text-base font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                          <div className="flex flex-col gap-0.5">
                            <a
                              href={`${chainConfig.explorer_validator_url}${item.val_address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline">
                              {item.val_moniker && (
                                <span className="font-medium text-foreground">
                                  {item.val_moniker}
                                </span>
                              )}
                            </a>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`${chainConfig.explorer_validator_url}${item.val_address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs text-muted-foreground hover:underline"
                                title={item.val_address}>
                                {truncateAddress(item.val_address)}
                              </a>
                              <CopyButton value={item.val_address} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-right font-mono text-base text-emerald-600 transition-colors group-hover:text-foreground dark:text-emerald-400">
                          {formatAmount(item.delegation_amount.toString())}
                        </TableCell>
                        <TableCell className="px-6 text-right font-mono text-base text-foreground/80 transition-colors group-hover:text-foreground">
                          {formatAmount(item.reward_amount.toString())}{' '}
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
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/30 dark:bg-black/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="h-14 bg-white/20 px-6 text-base font-medium text-muted-foreground dark:bg-black/20">
                      Validator
                    </TableHead>
                    <TableHead className="h-14 bg-white/20 px-6 text-base font-medium text-muted-foreground dark:bg-black/20">
                      Completion
                    </TableHead>
                    <TableHead className="h-14 bg-white/20 px-6 text-right text-base font-medium text-muted-foreground dark:bg-black/20">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.unbondings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-32 text-center text-lg text-muted-foreground">
                        No unbonding records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.unbondings.map((item, i) => (
                      <TableRow
                        key={i}
                        className="group h-20 border-white/5 transition-colors hover:bg-primary/5">
                        <TableCell className="px-6 text-base font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                          <div className="flex flex-col gap-0.5">
                            <a
                              href={`${chainConfig.explorer_validator_url}${item.val_address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline">
                              {item.val_moniker && (
                                <span className="font-medium text-foreground">
                                  {item.val_moniker}
                                </span>
                              )}
                            </a>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`${chainConfig.explorer_validator_url}${item.val_address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs text-muted-foreground hover:underline"
                                title={item.val_address}>
                                {truncateAddress(item.val_address)}
                              </a>
                              <CopyButton value={item.val_address} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs">
                            {formatDateTime(item.completion_time_ms)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-right font-mono text-base text-foreground/80 transition-colors group-hover:text-foreground">
                          {formatAmount(item.unbonding_amount.toString())}
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
  )
}
