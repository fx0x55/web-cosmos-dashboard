import type { Chain } from './types'

export const CHAINS: Chain[] = [
  {
    id: 'aifx',
    name: 'Pundi AIFX',
    icon: '',
    denom: 'PUNDIAI',
    decimals: 18,
    explorer_base_url: 'https://pundiscan.io/pundiaifx/',
    rest_url: 'https://fx-rest.functionx.io:1317',
    adenom: 'apundiai',
  },
  // { id: 'pundix', name: 'Pundi X', icon: '', denom: 'PUNDIX', decimals: 18 },
]

export const DEFAULT_CHAIN_ID = CHAINS[0]?.id || 'aifx'

export function getChainConfig(chainId: string): Chain {
  return (
    CHAINS.find(c => c.id === chainId) ||
    CHAINS.find(c => c.id === DEFAULT_CHAIN_ID) ||
    CHAINS[0]
  )
}
