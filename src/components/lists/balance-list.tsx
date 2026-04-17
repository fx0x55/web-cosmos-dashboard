'use client'

import { useEffect, useState } from 'react'
import {
  CHAINS,
  DEFAULT_CHAIN_ID,
  getAccounts,
  getModuleAccounts,
} from '@/lib/api'
import type { Account } from '@/lib/types'
import { DataTable } from '@/components/data-table'
import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { getAddressLabel } from '@/lib/address-labels'

export function BalanceList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID
  const chain = CHAINS.find(item => item.id === chainId) || CHAINS[0]

  const [data, setData] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [moduleAccountMap, setModuleAccountMap] = useState<Map<string, string>>(
    new Map()
  )
  const pageSize = 50

  useEffect(() => {
    getModuleAccounts(chainId)
      .then(accounts => {
        const map = new Map<string, string>()
        for (const account of accounts) {
          map.set(account.address, account.name)
        }
        setModuleAccountMap(map)
      })
      .catch(() => {})
  }, [chainId])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await getAccounts(page, pageSize)
        setData(res.list)
        setTotal(res.total)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page])

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
          header: 'Address',
          cell: item => {
            const moduleName = moduleAccountMap.get(item.address)
            const customLabel = getAddressLabel(item.address)
            return (
              <div className="flex items-center gap-2">
                <Link
                  href={`/address/${item.address}?chain=${chainId}`}
                  className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
                  {item.address}
                </Link>
                {moduleName && (
                  <Badge
                    variant="outline"
                    className="shrink-0 border-amber-500/30 bg-amber-500/10 font-mono text-amber-600">
                    {moduleName}
                  </Badge>
                )}
                {customLabel && (
                  <Badge variant="outline" className={customLabel.className}>
                    {customLabel.label}
                  </Badge>
                )}
              </div>
            )
          },
        },
        {
          header: 'Balance',
          cell: item => <span>{formatAmount(item.amount.toString())}</span>,
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
