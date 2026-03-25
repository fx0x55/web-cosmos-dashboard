'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { DEFAULT_CHAIN_ID, getTotalSupply } from '@/lib/api'
import type { SupplyBalance } from '@/lib/types'
import { formatAmount } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function SupplyBalanceList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [allData, setAllData] = useState<SupplyBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setPage(1)

      try {
        const supply = await getTotalSupply(chainId)
        setAllData(supply)
      } catch (error) {
        console.error(error)
        setAllData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [chainId])

  const start = (page - 1) * pageSize
  const data = allData.slice(start, start + pageSize)

  return (
    <DataTable
      data={data}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={allData.length}
      onPageChange={setPage}
      columns={[
        {
          header: 'Denom',
          cell: item => (
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 font-mono text-primary">
              {item.displayDenom || item.rawDenom}
            </Badge>
          ),
        },
        {
          header: 'Raw Denom',
          cell: item => (
            <span
              className="max-w-[300px] truncate font-mono text-xs text-muted-foreground"
              title={item.rawDenom}>
              {item.rawDenom}
            </span>
          ),
        },
        {
          header: 'Amount',
          cell: item => (
            <span className="font-medium">{formatAmount(item.amount)}</span>
          ),
        },
      ]}
    />
  )
}
