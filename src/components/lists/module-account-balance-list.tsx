'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { CHAINS, DEFAULT_CHAIN_ID, getModuleAccountBalances } from '@/lib/api'
import type { ModuleAccountBalance } from '@/lib/types'
import { formatAmount } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type ModuleAccountRow = ModuleAccountBalance & {
  pundiaiAmount: string
}

export function ModuleAccountBalanceList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID
  const chain = CHAINS.find(item => item.id === chainId) || CHAINS[0]

  const [allData, setAllData] = useState<ModuleAccountBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setPage(1)

      try {
        const balances = await getModuleAccountBalances(chainId)
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

  const sortedRows = useMemo<ModuleAccountRow[]>(() => {
    return allData
      .map(account => ({
        ...account,
        pundiaiAmount: account.primaryAmount || '0',
      }))
      .sort((a, b) => Number(b.pundiaiAmount) - Number(a.pundiaiAmount))
  }, [allData])

  const start = (page - 1) * pageSize
  const data = sortedRows.slice(start, start + pageSize)

  return (
    <DataTable
      data={data}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={sortedRows.length}
      onPageChange={setPage}
      columns={[
        {
          header: 'Module',
          cell: item => (
            <div className="space-y-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-muted-foreground">
                {item.permissions.length > 0
                  ? item.permissions.join(', ')
                  : 'No permissions'}
              </div>
            </div>
          ),
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
          header: 'Amount',
          cell: item => <span>{formatAmount(item.pundiaiAmount)}</span>,
        },
        {
          header: 'Denom',
          cell: () => (
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 font-mono text-primary">
              {chain.denom}
            </Badge>
          ),
        },
      ]}
    />
  )
}
