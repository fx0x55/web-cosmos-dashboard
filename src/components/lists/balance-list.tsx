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
import { getAddressLabel, getAccountTypeLabels } from '@/lib/address-labels'

export function BalanceList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID
  const chain = CHAINS.find(item => item.id === chainId) || CHAINS[0]

  const [data, setData] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [moduleAccountMap, setModuleAccountMap] = useState<Map<string, string>>(
    new Map()
  )
  const pageSize = 50
  const [retryCount, setRetryCount] = useState(0)

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
      setError(null)
      try {
        const res = await getAccounts(page, pageSize)
        setData(res.list)
        setTotal(res.total)
      } catch (err) {
        console.error(err)
        setError(
          'Unable to load accounts. Check your connection and try again.'
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
          header: 'Address',
          cell: item => {
            const moduleName = moduleAccountMap.get(item.address)
            const customLabel = getAddressLabel(item.address)
            const typeLabels = getAccountTypeLabels(item)
            const hasEth = !!item.eth_address
            const displayAddress = hasEth ? item.eth_address! : item.address
            return (
              <div className="flex items-center gap-2">
                <Link
                  href={`/address/${item.address}?chain=${chainId}`}
                  className="font-medium decoration-zinc-400 underline-offset-4 transition-all hover:underline">
                  {displayAddress}
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
                {typeLabels.map((label, i) => (
                  <Badge key={i} variant="outline" className={label.className}>
                    {label.label}
                  </Badge>
                ))}
              </div>
            )
          },
        },
        {
          header: 'Balance',
          cell: item => <span>{formatAmount(item.amount.toString())}</span>,
        },
        {
          header: 'Token',
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
