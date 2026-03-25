import type {
  Chain,
  Account,
  Unbonding,
  AccountDetailResponse,
  PaginatedResponse,
  ChainStats,
  ValidatorSummaryResponse,
  ValidatorDelegation,
  ValidatorUnbonding,
} from './types'
import { CHAINS, getChainConfig } from './config'
export { CHAINS, DEFAULT_CHAIN_ID } from './config'
export {
  getBridgeChainNames,
  getBridgeTokensByChain,
  getCrosschainModuleBalances,
  getCrosschainOracles,
  getObservedBlockHeight,
  getErc20ModuleBalances,
  getModuleAccountBalances,
  getTotalSupply,
} from './chain-rest'

// Environment variable for API URL (Server-side)
// Ensure it has a protocol
const getEnvApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`
  }
  // Remove trailing slash if present to avoid double slashes with endpoint
  return url.replace(/\/$/, '')
}

const ENV_API_URL = getEnvApiUrl()

// Determine BASE_URL
// On server side: Direct connection to backend using absolute URL
// On client side: Use relative path to leverage Next.js rewrites (proxy) to avoid CORS
const isServer = typeof window === 'undefined'
const BASE_URL = isServer ? `${ENV_API_URL}/api` : '/api'

// Helper for fetch
async function fetchAPI<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const path = `${BASE_URL}${endpoint}`

  // Construct URL with parameters
  // If path is relative (client-side), we need a base for URL constructor
  // But we can simply append query string manually or use URL with window.location.origin if needed
  // Simpler approach: use URLSearchParams directly

  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined)
    .map(
      key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`
    )
    .join('&')

  const fullUrl = queryString ? `${path}?${queryString}` : path

  const res = await fetch(fullUrl)
  if (!res.ok) {
    console.error(`[API] Error ${res.status} on ${fullUrl}`)
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
  const chain = getChainConfig(chainId)

  if (chain.rest_url && chain.adenom) {
    try {
      const [supplyRes, poolRes, communityPoolRes] = await Promise.all([
        fetch(
          `${chain.rest_url}/cosmos/bank/v1beta1/supply/by_denom?denom=${chain.adenom}`
        ).then(res => res.json()),
        fetch(`${chain.rest_url}/cosmos/staking/v1beta1/pool`).then(res =>
          res.json()
        ),
        fetch(
          `${chain.rest_url}/cosmos/distribution/v1beta1/community_pool`
        ).then(res => res.json()),
      ])

      const communityPoolCoin = communityPoolRes.pool?.find(
        (c: { denom: string }) => c.denom === chain.adenom
      )

      const formatValue = (value: string | undefined) => {
        if (!value) return '0'
        // Handle potentially very large numbers by using BigInt
        // Then divide by 10^decimals to get the main unit value
        try {
          // Remove any decimal part first for BigInt (API might return decimals for some fields)
          const integerPart = value.split('.')[0]
          const bigValue = BigInt(integerPart)
          const str = bigValue.toString().padStart(chain.decimals + 1, '0')
          const integer = str.slice(0, -chain.decimals)
          return integer
        } catch (e) {
          console.error('Error formatting value:', value, e)
          return '0'
        }
      }

      return {
        totalSupply: {
          amount: formatValue(supplyRes.amount?.amount),
          denom: chain.denom,
        },
        bondedTokens: {
          amount: formatValue(poolRes.pool?.bonded_tokens),
          denom: chain.denom,
        },
        notBondedTokens: {
          amount: formatValue(poolRes.pool?.not_bonded_tokens),
          denom: chain.denom,
        },
        communityPool: {
          amount: formatValue(communityPoolCoin?.amount),
          denom: chain.denom,
        },
      }
    } catch (error) {
      console.error('Failed to fetch chain stats from REST API:', error)
      // Return 0 values on failure as requested
      return {
        totalSupply: { amount: '0', denom: chain.denom },
        bondedTokens: { amount: '0', denom: chain.denom },
        notBondedTokens: { amount: '0', denom: chain.denom },
        communityPool: { amount: '0', denom: chain.denom },
      }
    }
  }

  // Fallback for chains without REST API config or if logic falls through (though above returns in catch)
  return {
    totalSupply: { amount: '0', denom: chain.denom },
    bondedTokens: { amount: '0', denom: chain.denom },
    notBondedTokens: { amount: '0', denom: chain.denom },
    communityPool: { amount: '0', denom: chain.denom },
  }
}

export const getValidatorSummary = async (
  valAddress: string
): Promise<ValidatorSummaryResponse> => {
  return fetchAPI<ValidatorSummaryResponse>(`/validators/${valAddress}`)
}

export const getValidatorDelegations = async (
  valAddress: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<ValidatorDelegation>> => {
  return fetchAPI<PaginatedResponse<ValidatorDelegation>>(
    `/validators/${valAddress}/delegations`,
    {
      page,
      page_size: pageSize,
    }
  )
}

export const getValidatorUnbondings = async (
  valAddress: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<ValidatorUnbonding>> => {
  return fetchAPI<PaginatedResponse<ValidatorUnbonding>>(
    `/validators/${valAddress}/unbondings`,
    {
      page,
      page_size: pageSize,
    }
  )
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
  return fetchAPI<PaginatedResponse<Account>>('/delegators', {
    page,
    page_size,
  })
}

export const getUnbondings = async (
  page = 1,
  page_size = 10
): Promise<PaginatedResponse<Unbonding>> => {
  return fetchAPI<PaginatedResponse<Unbonding>>('/unbondings', {
    page,
    page_size,
  })
}

export const getAccountDetail = async (
  address: string
): Promise<AccountDetailResponse> => {
  return fetchAPI<AccountDetailResponse>(`/accounts/${address}`)
}
