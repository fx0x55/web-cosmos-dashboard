'use client'

import { useEffect, useState } from 'react'
import { getDelegations } from '@/lib/api'
import type { Delegation } from '@/lib/types'
import { DataTable } from '@/components/data-table'
import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function DelegationList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || 'aifx'

  const [data, setData] = useState<Delegation[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 50

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await getDelegations(chainId, page, pageSize)
        setData(res.data)
        setTotal(res.total)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [chainId, page])

  return (
    <DataTable
      data={data}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={setPage}
      columns={[
        {
          header: 'Delegator',
          cell: item => (
            <Link
              href={`/address/${item.delegatorAddress}?chain=${chainId}`}
              className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
              {item.delegatorAddress}
            </Link>
          ),
        },
        {
          header: 'Amount',
          cell: item => (
            <div className="flex items-center gap-2">
              <span>{formatAmount(item.amount)}</span>
              <span className="text-sm text-slate-500">{item.denom}</span>
            </div>
          ),
        },
        {
          header: 'Total Delegations',
          cell: item => (
            <span className="font-mono">{item.delegationCount}</span>
          ),
        },
      ]}
    />
  )
}
