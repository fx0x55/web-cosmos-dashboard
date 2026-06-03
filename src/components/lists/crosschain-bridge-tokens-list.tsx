'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import {
  DEFAULT_CHAIN_ID,
  getBridgeChainNames,
  getBridgeTokensByChain,
} from '@/lib/api'
import type { BridgeToken } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import bridgeChainsConfig from '@/lib/bridge-chains.json'

const bridgeChainMap = new Map(bridgeChainsConfig.map(c => [c.chain_name, c]))

function getContractExplorerUrl(
  chainName: string,
  contract: string
): string | null {
  const config = bridgeChainMap.get(chainName)
  if (!config?.explorer || !contract) return null
  return `${config.explorer}/token/${contract}`
}

function getBridgeAddressUrl(chainName: string): string | null {
  const config = bridgeChainMap.get(chainName)
  if (!config?.explorer || !config?.bridge_address) return null
  return `${config.explorer}/address/${config.bridge_address}`
}

export function CrosschainBridgeTokensList() {
  const searchParams = useSearchParams()
  const chainId = searchParams.get('chain') || DEFAULT_CHAIN_ID

  const [chainNames, setChainNames] = useState<string[]>([])
  const [chainsLoading, setChainsLoading] = useState(true)
  const [selectedChain, setSelectedChain] = useState<string>('')

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
        No cross-chain bridges are configured for this network.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 px-1" role="tablist">
        {chainNames.map(name => {
          const config = bridgeChainMap.get(name)
          const showName = config?.show_name || name
          const bridgeUrl = getBridgeAddressUrl(name)
          return (
            <button
              key={name}
              role="tab"
              aria-selected={selectedChain === name}
              onClick={() => setSelectedChain(name)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out',
                selectedChain === name
                  ? 'bg-primary/[0.08] text-primary shadow-sm shadow-primary/[0.06]'
                  : 'text-muted-foreground/70 hover:bg-muted/60 hover:text-muted-foreground'
              )}>
              {showName}
              {bridgeUrl && (
                <a
                  href={bridgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-0.5 opacity-50 transition-opacity hover:opacity-100"
                  onClick={e => e.stopPropagation()}>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </button>
          )
        })}
      </div>

      {chainNames.map(
        name =>
          selectedChain === name && (
            <BridgeTokenTable key={name} chainId={chainId} chainName={name} />
          )
      )}
    </div>
  )
}

function BridgeTokenTable({
  chainId,
  chainName,
}: {
  chainId: string
  chainName: string
}) {
  const [data, setData] = useState<BridgeToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [retryCount, setRetryCount] = useState(0)
  const pageSize = 20

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      setPage(1)
      setError(null)
      try {
        const res = await getBridgeTokensByChain(chainId, chainName)
        setData(res.bridge_tokens || [])
      } catch (err) {
        console.error(`Failed to fetch bridge tokens for ${chainName}`, err)
        setData([])
        setError(
          `Unable to load bridge tokens for ${chainName}. Check your connection and try again.`
        )
      } finally {
        setLoading(false)
      }
    }
    fetchTokens()
  }, [chainId, chainName, retryCount])

  const start = (page - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)

  return (
    <DataTable
      data={pageData}
      loading={loading}
      error={error}
      onRetry={() => setRetryCount(c => c + 1)}
      page={page}
      pageSize={pageSize}
      total={data.length}
      onPageChange={setPage}
      columns={[
        {
          header: 'Token',
          cell: item => <span className="font-mono text-xs">{item.denom}</span>,
        },
        {
          header: 'Contract',
          cell: item => {
            const url = getContractExplorerUrl(chainName, item.contract || '')
            return url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs decoration-zinc-400 underline-offset-4 transition-all hover:text-primary hover:underline">
                {item.contract}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-mono text-xs">{item.contract}</span>
            )
          },
        },
        {
          header: 'Origin',
          cell: item => (
            <Badge
              variant={item.is_native ? 'default' : 'outline'}
              className={
                item.is_native
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : ''
              }>
              {item.is_native ? 'Native to destination' : 'Wrapped'}
            </Badge>
          ),
        },
      ]}
    />
  )
}
