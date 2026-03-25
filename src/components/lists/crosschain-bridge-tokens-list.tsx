'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  DEFAULT_CHAIN_ID,
  getBridgeChainNames,
  getBridgeTokensByChain,
} from '@/lib/api'
import type { BridgeToken } from '@/lib/types'
import { ExternalLink } from 'lucide-react'
import bridgeChainsConfig from '@/lib/bridge-chains.json'

const bridgeChainMap = new Map(
  bridgeChainsConfig.map(c => [c.chain_name, c])
)

function getContractExplorerUrl(chainName: string, contract: string): string | null {
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
          className="grid h-11 w-full max-w-3xl rounded-full border border-white/10 bg-black/5 p-1 shadow-inner backdrop-blur-xl dark:bg-white/5"
          style={{
            gridTemplateColumns: `repeat(${chainNames.length}, minmax(0, 1fr))`,
          }}>
          {chainNames.map(name => {
            const config = bridgeChainMap.get(name)
            const showName = config?.show_name || name
            const bridgeUrl = getBridgeAddressUrl(name)
            return (
              <TabsTrigger
                key={name}
                value={name}
                className="rounded-full text-sm font-medium transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <span className="inline-flex items-center gap-1">
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
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>

      {chainNames.map(name => (
        <TabsContent key={name} value={name} className="outline-none">
          <BridgeTokenTable chainId={chainId} chainName={name} />
        </TabsContent>
      ))}
    </Tabs>
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
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      setPage(1)
      try {
        const res = await getBridgeTokensByChain(chainId, chainName)
        setData(res.bridge_tokens || [])
      } catch (error) {
        console.error(`Failed to fetch bridge tokens for ${chainName}`, error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchTokens()
  }, [chainId, chainName])

  const start = (page - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)

  return (
    <DataTable
      data={pageData}
      loading={loading}
      page={page}
      pageSize={pageSize}
      total={data.length}
      onPageChange={setPage}
      columns={[
        {
          header: 'Denom',
          cell: item => (
            <span className="font-mono text-xs">{item.denom}</span>
          ),
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
                className="inline-flex items-center gap-1 font-mono text-xs decoration-zinc-400 underline-offset-4 transition-all hover:underline hover:text-primary">
                {item.contract}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-mono text-xs">{item.contract}</span>
            )
          },
        },
        {
          header: 'Native',
          cell: item => (
            <Badge
              variant={item.is_native ? 'default' : 'outline'}
              className={
                item.is_native
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : ''
              }>
              {item.is_native ? 'Yes' : 'No'}
            </Badge>
          ),
        },
      ]}
    />
  )
}
