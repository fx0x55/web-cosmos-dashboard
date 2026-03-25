'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  DEFAULT_CHAIN_ID,
  getBridgeChainNames,
  getCrosschainOracles,
  getObservedBlockHeight,
} from '@/lib/api'
import type { CrosschainOracleInfo, ObservedBlockHeightResponse } from '@/lib/types'
import { formatAmount, truncateAddress } from '@/lib/utils'
import bridgeChainsConfig from '@/lib/bridge-chains.json'

const bridgeChainMap = new Map(
  bridgeChainsConfig.map(c => [c.chain_name, c])
)

export function CrosschainOraclesList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [chainNames, setChainNames] = useState<string[]>([])
  const [chainsLoading, setChainsLoading] = useState(true)
  const [selectedChain, setSelectedChain] = useState<string>('')

  // Fetch supported bridge chains
  useEffect(() => {
    const fetchChains = async () => {
      setChainsLoading(true)
      try {
        const names = await getBridgeChainNames(chainId)
        setChainNames(names)
        if (names.length > 0 && !selectedChain) {
          setSelectedChain(names[0])
        }
      } catch (error) {
        console.error('Failed to fetch bridge chain list', error)
        setChainNames([])
      } finally {
        setChainsLoading(false)
      }
    }
    fetchChains()
  }, [chainId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (chainsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (chainNames.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No supported crosschain bridges found.
      </div>
    )
  }

  return (
    <Tabs
      value={selectedChain}
      onValueChange={setSelectedChain}
      className="space-y-6">
      <div className="flex justify-start px-1">
        <TabsList
          className={`grid h-11 w-full max-w-3xl rounded-full border border-white/10 bg-black/5 p-1 shadow-inner backdrop-blur-xl dark:bg-white/5`}
          style={{
            gridTemplateColumns: `repeat(${chainNames.length}, minmax(0, 1fr))`,
          }}>
          {chainNames.map(name => {
            const config = bridgeChainMap.get(name)
            const showName = config?.show_name || name
            return (
              <TabsTrigger
                key={name}
                value={name}
                className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                {showName}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>

      {chainNames.map(name => (
        <TabsContent key={name} value={name} className="outline-none">
          <OracleTable chainId={chainId} chainName={name} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function OracleTable({
  chainId,
  chainName,
}: {
  chainId: string
  chainName: string
}) {
  const [data, setData] = useState<CrosschainOracleInfo[]>([])
  const [observed, setObserved] = useState<ObservedBlockHeightResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setPage(1)
      try {
        const [oracles, observedRes] = await Promise.all([
          getCrosschainOracles(chainId, chainName),
          getObservedBlockHeight(chainId, chainName).catch(() => null),
        ])
        setData(oracles)
        setObserved(observedRes)
      } catch (error) {
        console.error(`Failed to fetch oracles for ${chainName}`, error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [chainId, chainName])

  const start = (page - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)

  return (
    <div className="space-y-4">
      {observed && (
        <div className="flex gap-6 px-1">
          <div className="glass-panel flex items-center gap-3 rounded-xl px-5 py-3">
            <span className="text-sm text-muted-foreground">External Block Height</span>
            <span className="font-mono text-sm font-semibold">{observed.external_block_height}</span>
          </div>
          <div className="glass-panel flex items-center gap-3 rounded-xl px-5 py-3">
            <span className="text-sm text-muted-foreground">Observed Block Height</span>
            <span className="font-mono text-sm font-semibold">{observed.block_height}</span>
          </div>
        </div>
      )}
    <DataTable
      data={pageData}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={data.length}
      onPageChange={setPage}
      columns={[
        {
          header: 'Oracle Address',
          cell: item => (
            <span className="font-mono text-xs">
              {truncateAddress(item.oracle_address, 10, 8)}
            </span>
          ),
        },
        {
          header: 'Bridger Address',
          cell: item => (
            <span className="font-mono text-xs">
              {truncateAddress(item.bridger_address, 10, 8)}
            </span>
          ),
        },
        {
          header: 'External Address',
          cell: item => (
            <span className="font-mono text-xs">
              {truncateAddress(item.external_address, 10, 8)}
            </span>
          ),
        },
        {
          header: 'Status',
          cell: item => (
            <Badge
              variant={item.online ? 'default' : 'destructive'}
              className={
                item.online
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : ''
              }>
              {item.online ? 'Online' : 'Offline'}
            </Badge>
          ),
        },
        {
          header: 'Delegate Amount',
          cell: item => (
            <span className="font-medium">{formatAmount(item.delegate_amount)}</span>
          ),
        },
        {
          header: 'Event Nonce',
          cell: item => (
            <span className="font-mono text-sm">{item.event_nonce}</span>
          ),
        },
        {
          header: 'Block Height',
          cell: item => (
            <span className="font-mono text-sm">{item.block_height}</span>
          ),
        },
        {
          header: 'Slash Times',
          cell: item => (
            <span className="font-mono text-sm">{item.slash_times}</span>
          ),
        },
      ]}
    />
    </div>
  )
}
