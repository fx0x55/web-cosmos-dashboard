'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { DEFAULT_CHAIN_ID, getCrosschainModuleBalances } from '@/lib/api'
import type { CrosschainModuleBalance } from '@/lib/types'
import { formatAmount } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function CrosschainModuleBalanceList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [allData, setAllData] = useState<CrosschainModuleBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setPage(1)

      try {
        const balances = await getCrosschainModuleBalances(chainId)
        setAllData(balances)
      } catch (error) {
        console.error(error)
        setAllData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [chainId])

  const rows = useMemo(
    () =>
      [...allData]
        .filter(item => !/^(arbitrum|optimism)$/i.test(item.chainName))
        .sort((a, b) => a.chainName.localeCompare(b.chainName)),
    [allData]
  )

  const start = (page - 1) * pageSize
  const data = rows.slice(start, start + pageSize)

  return (
    <DataTable
      data={data}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={rows.length}
      onPageChange={setPage}
      columns={[
        {
          header: 'Name',
          cell: item => <div className="font-semibold">{item.moduleName}</div>,
        },
        {
          header: 'Address',
          cell: item => (
            <Link
              href={`/address/${item.address}?chain=${chainId}`}
              className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
              {item.address}
            </Link>
          ),
        },
        {
          header: 'Balances',
          cell: item => (
            <div className="space-y-2 py-2">
              {item.balances.length > 0 ? (
                item.balances.map(balance => (
                  <div
                    key={`${item.address}-${balance.denom}`}
                    className="space-y-1">
                    <div className="font-medium">
                      {formatAmount(balance.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No balances found.
                </span>
              )}
            </div>
          ),
        },
        {
          header: 'Denom',
          cell: item => (
            <div className="space-y-2 py-2">
              {item.balances.length > 0 ? (
                item.balances.map(balance => (
                  <div
                    key={`${item.address}-${balance.denom}-denom`}
                    className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/10 font-mono text-primary">
                        {balance.displayDenom || balance.denom}
                      </Badge>
                      <span className="font-mono text-muted-foreground">
                        raw: {balance.denom}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No balances found.
                </span>
              )}
            </div>
          ),
        },
      ]}
    />
  )
}
