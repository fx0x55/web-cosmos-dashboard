'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_CHAIN_ID, getValidatorUnbondings } from '@/lib/api'
import type { ValidatorUnbonding } from '@/lib/types'
import { DataTable } from '@/components/data-table'
import { formatAmount, formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

interface ValidatorUnbondingListProps {
  valAddress: string
}

export function ValidatorUnbondingList({
  valAddress,
}: ValidatorUnbondingListProps) {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [data, setData] = useState<ValidatorUnbonding[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await getValidatorUnbondings(valAddress, page, pageSize)
        setData(res.list)
        setTotal(res.total)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, valAddress])

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
          header: 'Delegator Address',
          cell: item => (
            <Link
              href={`/address/${item.address}?chain=${chainId}`}
              className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
              {item.address}
            </Link>
          ),
        },
        {
          header: 'Unbonding ID',
          cell: item => <span className="font-mono">{item.unbonding_id}</span>,
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
              {formatDateTime(item.completion_time_ms)}
            </Badge>
          ),
        },
      ]}
    />
  )
}
