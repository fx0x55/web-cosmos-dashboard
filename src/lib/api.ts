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
  getModuleAccounts,
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

  const emptyMigration = {
    migratedSupply: '0',
    ethModuleBalance: '0',
    userBalance: '0',
    userDelegation: '0',
    userUnbonding: '0',
    denom: chain.denom,
  }

  if (chain.rest_url && chain.adenom) {
    try {
      const [supplyRes, poolRes, communityPoolRes, ethModuleRes] =
        await Promise.all([
          fetch(
            `${chain.rest_url}/cosmos/bank/v1beta1/supply/by_denom?denom=${chain.adenom}`
          ).then(res => res.json()),
          fetch(`${chain.rest_url}/cosmos/staking/v1beta1/pool`).then(res =>
            res.json()
          ),
          fetch(
            `${chain.rest_url}/cosmos/distribution/v1beta1/community_pool`
          ).then(res => res.json()),
          fetch(
            `${chain.rest_url}/cosmos/auth/v1beta1/module_accounts/${encodeURIComponent('eth')}`
          )
            .then(res => res.json())
            .then(async (modRes: { account?: Record<string, unknown> }) => {
              const baseAccount = (modRes.account?.base_account ??
                modRes.account?.baseAccount) as
                | Record<string, unknown>
                | undefined
              const address = (modRes.account?.address ??
                baseAccount?.address) as string | undefined
              if (!address) return { amount: '0' }
              const balRes = await fetch(
                `${chain.rest_url}/cosmos/bank/v1beta1/balances/${address}`
              ).then(res => res.json())
              const coin = (balRes.balances || []).find(
                (c: { denom: string }) => c.denom === chain.adenom
              )
              return { amount: coin?.amount || '0' }
            })
            .catch(() => ({ amount: '0' })),
        ])

      const communityPoolCoin = communityPoolRes.pool?.find(
        (c: { denom: string }) => c.denom === chain.adenom
      )

      const formatValue = (value: string | undefined) => {
        if (!value) return '0'
        try {
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

      const totalSupplyAmount = BigInt(
        formatValue(supplyRes.amount?.amount) || '0'
      )
      const ethModuleAmount = BigInt(formatValue(ethModuleRes.amount) || '0')
      const bondedAmount = BigInt(
        formatValue(poolRes.pool?.bonded_tokens) || '0'
      )
      const notBondedAmount = BigInt(
        formatValue(poolRes.pool?.not_bonded_tokens) || '0'
      )
      const communityPoolAmount = BigInt(
        formatValue(communityPoolCoin?.amount) || '0'
      )

      const migratedSupply = totalSupplyAmount - ethModuleAmount
      const userDelegation = bondedAmount
      const userUnbonding = notBondedAmount
      const userBalance =
        migratedSupply - userDelegation - userUnbonding - communityPoolAmount

      return {
        totalSupply: {
          amount: totalSupplyAmount.toString(),
          denom: chain.denom,
        },
        bondedTokens: {
          amount: bondedAmount.toString(),
          denom: chain.denom,
        },
        notBondedTokens: {
          amount: notBondedAmount.toString(),
          denom: chain.denom,
        },
        communityPool: {
          amount: communityPoolAmount.toString(),
          denom: chain.denom,
        },
        migration: {
          migratedSupply: migratedSupply.toString(),
          ethModuleBalance: ethModuleAmount.toString(),
          userBalance: userBalance < 0n ? '0' : userBalance.toString(),
          userDelegation: userDelegation.toString(),
          userUnbonding: userUnbonding.toString(),
          denom: chain.denom,
        },
      }
    } catch (error) {
      console.error('Failed to fetch chain stats from REST API:', error)
      return {
        totalSupply: { amount: '0', denom: chain.denom },
        bondedTokens: { amount: '0', denom: chain.denom },
        notBondedTokens: { amount: '0', denom: chain.denom },
        communityPool: { amount: '0', denom: chain.denom },
        migration: emptyMigration,
      }
    }
  }

  return {
    totalSupply: { amount: '0', denom: chain.denom },
    bondedTokens: { amount: '0', denom: chain.denom },
    notBondedTokens: { amount: '0', denom: chain.denom },
    communityPool: { amount: '0', denom: chain.denom },
    migration: emptyMigration,
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
