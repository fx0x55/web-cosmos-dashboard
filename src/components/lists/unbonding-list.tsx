'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_CHAIN_ID, getUnbondings } from '@/lib/api'
import type { Unbonding } from '@/lib/types'
import { DataTable } from '@/components/data-table'
import { formatAmount, truncateAddress, formatCountdown } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CopyButton } from '@/components/copy-button'
import { Badge } from '@/components/ui/badge'

export function UnbondingList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [data, setData] = useState<Unbonding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [retryCount, setRetryCount] = useState(0)
  const pageSize = 50

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getUnbondings(page, pageSize)
        setData(res.list)
        setTotal(res.total)
      } catch (err) {
        console.error(err)
        setError('Failed to load unbonding records. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, retryCount])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <DataTable
      data={data}
      loading={loading}
      error={error}
      onRetry={() => setRetryCount(c => c + 1)}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={setPage}
      columns={[
        {
          header: 'Delegator',
          cell: item => (
            <Link
              href={`/address/${item.address}?chain=${chainId}`}
              className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
              {item.address}
            </Link>
          ),
        },
        {
          header: 'Validator',
          cell: item => (
            <div className="flex flex-col gap-0.5">
              <Link
                href={`/validator/${item.val_address}?chain=${chainId}`}
                className="font-medium text-foreground hover:underline">
                {item.val_moniker && <span>{item.val_moniker}</span>}
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
          ),
        },
        {
          header: 'Amount',
          cell: item => (
            <div className="flex items-center gap-2">
              <span>{formatAmount(item.unbonding_amount.toString())}</span>
            </div>
          ),
        },
        {
          header: 'Completion Time',
          cell: item => (
            <Badge variant="outline" className="font-mono text-xs">
              {formatCountdown(item.completion_time_ms, now)}
            </Badge>
          ),
        },
      ]}
    />
  )
}
