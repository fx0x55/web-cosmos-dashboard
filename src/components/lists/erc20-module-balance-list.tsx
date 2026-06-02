'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { DEFAULT_CHAIN_ID, getErc20ModuleBalances } from '@/lib/api'
import type { DisplayCoinBalance, Erc20ModuleBalance } from '@/lib/types'
import { formatAmount } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function Erc20ModuleBalanceList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [allData, setAllData] = useState<Erc20ModuleBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [retryCount, setRetryCount] = useState(0)
  const pageSize = 20

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setPage(1)
      setError(null)

      try {
        const balances = await getErc20ModuleBalances(chainId)
        setAllData(balances)
      } catch (err) {
        console.error(err)
        setAllData([])
        setError(
          'Unable to load ERC20 modules. Check your connection and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [chainId, retryCount])

  const moduleAccount = allData[0]

  const balanceRows = useMemo<DisplayCoinBalance[]>(
    () => moduleAccount?.balances ?? [],
    [moduleAccount]
  )

  const start = (page - 1) * pageSize
  const data = balanceRows.slice(start, start + pageSize)

  return (
    <div className="space-y-4">
      {moduleAccount && (
        <div className="text-sm">
          <span className="text-muted-foreground">Address: </span>
          <Link
            href={`/address/${moduleAccount.address}?chain=${chainId}`}
            className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
            {moduleAccount.address}
          </Link>
        </div>
      )}

      <DataTable
        data={data}
        loading={loading}
        error={error}
        onRetry={() => setRetryCount(c => c + 1)}
        page={page}
        pageSize={pageSize}
        total={balanceRows.length}
        onPageChange={setPage}
        columns={[
          {
            header: 'Token',
            cell: balance => (
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 font-mono text-primary">
                {balance.displayDenom || balance.denom}
              </Badge>
            ),
          },
          {
            header: 'Amount',
            cell: balance => (
              <span className="font-medium">
                {formatAmount(balance.amount)}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
