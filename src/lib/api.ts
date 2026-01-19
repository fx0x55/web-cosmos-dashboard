import type {
  Chain,
  Account,
  Staking,
  Unbonding,
  AccountDetailResponse,
  PaginatedResponse,
  ChainStats,
} from './types'

export const CHAINS: Chain[] = [
  { id: 'aifx', name: 'Pundi AIFX', icon: '', denom: 'PUNDIAI', decimals: 18 },
  { id: 'pundix', name: 'Pundi X', icon: '', denom: 'PUNDIX', decimals: 18 },
]

const BASE_URL = 'http://localhost:8080'

// Helper for fetch
async function fetchAPI<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, String(params[key]))
    }
  })

  const res = await fetch(url.toString())
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Not Found')
    }
    throw new Error(`API Error: ${res.statusText}`)
  }
  return res.json()
}

export const getChains = async (): Promise<Chain[]> => {
  // Mock implementation as API doesn't provide this yet
  return CHAINS
}

export const getChainStats = async (chainId: string): Promise<ChainStats> => {
  // Mock implementation as API doesn't provide this yet
  const chain = CHAINS.find(c => c.id === chainId) || CHAINS[0]
  return {
    totalSupply: {
      amount: (1000000000 * Math.random() + 500000000).toFixed(0),
      denom: chain.denom,
    },
    bondedTokens: {
      amount: (300000000 * Math.random() + 100000000).toFixed(0),
      denom: chain.denom,
    },
    notBondedTokens: {
      amount: (50000000 * Math.random() + 10000000).toFixed(0),
      denom: chain.denom,
    },
    communityPool: {
      amount: (10000000 * Math.random() + 1000000).toFixed(0),
      denom: chain.denom,
    },
  }
}

export const getAccounts = async (
  page = 1,
  page_size = 10
): Promise<PaginatedResponse<Account>> => {
  return fetchAPI<PaginatedResponse<Account>>('/accounts', { page, page_size })
}

export const getTopDelegators = async (
  page = 1,
  page_size = 10
): Promise<PaginatedResponse<Account>> => {
  return fetchAPI<PaginatedResponse<Account>>('/delegators', { page, page_size })
}

export const getUnbondings = async (
  page = 1,
  page_size = 10
): Promise<PaginatedResponse<Unbonding>> => {
  return fetchAPI<PaginatedResponse<Unbonding>>('/unbondings', { page, page_size })
}

export const getAccountDetail = async (
  address: string
): Promise<AccountDetailResponse> => {
  return fetchAPI<AccountDetailResponse>(`/accounts/${address}`)
}
