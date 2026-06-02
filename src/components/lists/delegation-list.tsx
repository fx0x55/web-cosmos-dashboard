'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_CHAIN_ID, getTopDelegators } from '@/lib/api'
import type { Account } from '@/lib/types'
import { DataTable } from '@/components/data-table'
import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function DelegationList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [data, setData] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const pageSize = 50

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getTopDelegators(page, pageSize)
        setData(res.list)
        setTotal(res.total)
      } catch (err) {
        console.error(err)
        setError(
          'Unable to load delegations. Check your connection and try again.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, retryCount])

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
          header: 'Staked',
          cell: item => (
            <div className="flex items-center gap-2">
              <span>{formatAmount(item.staking_amount.toString())}</span>
            </div>
          ),
        },
        {
          header: 'Validators',
          cell: item => <span className="font-mono">{item.staking_count}</span>,
        },
      ]}
    />
  )
}
