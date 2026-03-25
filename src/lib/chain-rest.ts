import type {
  AllBalancesResponse,
  BridgeChainListResponse,
  BridgeTokensByChainResponse,
  CoinBalance,
  CrosschainModuleBalance,
  DenomInfo,
  DenomsMetadataResponse,
  DisplayCoinBalance,
  Erc20ModuleBalance,
  ModuleAccountBalance,
  ModuleAccountResponse,
  ModuleAccountsResponse,
  SupplyBalance,
  SupplyResponse,
} from './types'
import {
  dedupeModuleAccountsByAddress,
  dedupeStrings,
  isErc20ModuleAccount,
  resolveDisplayBalance,
  normalizeAmountByExponent,
  normalizeModuleName,
} from './utils'
import { getChainConfig } from './config'

// --- Cache TTL ---

const BALANCE_CACHE_TTL_MS = 1 * 60 * 1000 // 1 minute
const DEFAULT_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// --- Generic cached fetcher with in-flight deduplication ---

function createCachedFetcher<T>(ttlMs: number) {
  const cache = new Map<string, { value: T; expiresAt: number }>()
  const inFlight = new Map<string, Promise<T>>()

  return async (key: string, fetcher: () => Promise<T>): Promise<T> => {
    const now = Date.now()
    const cached = cache.get(key)

    if (cached && cached.expiresAt > now) {
      return cached.value
    }

    const pending = inFlight.get(key)

    if (pending) {
      return pending
    }

    const request = fetcher().then(
      value => {
        cache.set(key, { value, expiresAt: Date.now() + ttlMs })
        return value
      },
      error => {
        cache.delete(key)
        throw error
      }
    )

    inFlight.set(key, request)
    request.finally(() => {
      if (inFlight.get(key) === request) {
        inFlight.delete(key)
      }
    })

    return request
  }
}

// --- Cached fetchers ---

const cachedBalanceFetch =
  createCachedFetcher<CoinBalance[]>(BALANCE_CACHE_TTL_MS)
const cachedModuleAccountsFetch =
  createCachedFetcher<ExtractedModuleAccount[]>(DEFAULT_CACHE_TTL_MS)
const cachedModuleAccountByNameFetch =
  createCachedFetcher<ExtractedModuleAccount | null>(DEFAULT_CACHE_TTL_MS)
const cachedCrosschainModuleAccountsFetch =
  createCachedFetcher<
    Array<{ chainName: string; account: ExtractedModuleAccount }>
  >(DEFAULT_CACHE_TTL_MS)
const cachedDenomMetadataFetch =
  createCachedFetcher<Map<string, DenomInfo>>(DEFAULT_CACHE_TTL_MS)
const cachedBridgeTokensFetch =
  createCachedFetcher<BridgeTokensByChainResponse>(DEFAULT_CACHE_TTL_MS)
const cachedModuleAccountBalancesFetch =
  createCachedFetcher<ModuleAccountBalance[]>(BALANCE_CACHE_TTL_MS)
const cachedCrosschainModuleBalancesFetch =
  createCachedFetcher<CrosschainModuleBalance[]>(BALANCE_CACHE_TTL_MS)
const cachedErc20ModuleBalancesFetch =
  createCachedFetcher<Erc20ModuleBalance[]>(BALANCE_CACHE_TTL_MS)
const cachedSupplyFetch =
  createCachedFetcher<SupplyBalance[]>(BALANCE_CACHE_TTL_MS)

// --- REST fetch ---

export async function fetchChainRest<T>(
  chainId: string,
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const chain = getChainConfig(chainId)

  if (!chain.rest_url) {
    throw new Error(`No REST URL configured for chain ${chainId}`)
  }

  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined)
    .map(
      key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`
    )
    .join('&')

  const baseUrl = `${chain.rest_url.replace(/\/$/, '')}${endpoint}`
  const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl
  const res = await fetch(fullUrl)

  if (!res.ok) {
    throw new Error(`REST API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// --- Module account extraction ---

type ExtractedModuleAccount = {
  address: string
  name: string
  permissions: string[]
}

function extractModuleAccount(
  raw: Record<string, unknown>
): ExtractedModuleAccount {
  const nestedBaseAccount =
    (raw.base_account as Record<string, unknown> | undefined) ||
    (raw.baseAccount as Record<string, unknown> | undefined)

  const address =
    (raw.address as string | undefined) ||
    (nestedBaseAccount?.address as string | undefined) ||
    ''

  const name = (raw.name as string | undefined) || address
  const permissions = Array.isArray(raw.permissions)
    ? raw.permissions.filter(
        (permission): permission is string => typeof permission === 'string'
      )
    : []

  return { address, name, permissions }
}

// --- Data fetching functions ---

function getModuleAccountByName(
  chainId: string,
  name: string
): Promise<ExtractedModuleAccount | null> {
  const cacheKey = `${chainId}:${normalizeModuleName(name)}`

  return cachedModuleAccountByNameFetch(cacheKey, async () => {
    const response = await fetchChainRest<ModuleAccountResponse>(
      chainId,
      `/cosmos/auth/v1beta1/module_accounts/${encodeURIComponent(name)}`
    )

    if (!response.account) {
      return null
    }

    const account = extractModuleAccount(response.account)
    return account.address ? account : null
  })
}

function getBalancesByAddress(
  chainId: string,
  address: string
): Promise<CoinBalance[]> {
  const cacheKey = `${chainId}:${address}`

  return cachedBalanceFetch(cacheKey, async () => {
    const response = await fetchChainRest<AllBalancesResponse>(
      chainId,
      `/cosmos/bank/v1beta1/balances/${address}`
    )
    return response.balances || []
  })
}

function getModuleAccounts(chainId: string): Promise<ExtractedModuleAccount[]> {
  return cachedModuleAccountsFetch(chainId, async () => {
    const response = await fetchChainRest<ModuleAccountsResponse>(
      chainId,
      '/cosmos/auth/v1beta1/module_accounts'
    )

    return dedupeModuleAccountsByAddress(
      (response.accounts || [])
        .map(extractModuleAccount)
        .filter(account => account.address)
    )
  })
}

function getCrosschainModuleAccounts(
  chainId: string
): Promise<Array<{ chainName: string; account: ExtractedModuleAccount }>> {
  return cachedCrosschainModuleAccountsFetch(chainId, async () => {
    const bridgeChainsResponse = await fetchChainRest<BridgeChainListResponse>(
      chainId,
      '/fx/crosschain/v1/bridge_chain_list'
    )

    const bridgeChains = dedupeStrings(
      (bridgeChainsResponse.chain_names || []).filter(Boolean)
    )

    const accounts = await Promise.all(
      bridgeChains.map(async chainName => {
        const account = await getModuleAccountByName(chainId, chainName)
        return account ? { chainName, account } : null
      })
    )

    return accounts.filter(
      (item): item is { chainName: string; account: ExtractedModuleAccount } =>
        item !== null
    )
  })
}

function getDenomMetadataMap(chainId: string): Promise<Map<string, DenomInfo>> {
  return cachedDenomMetadataFetch(chainId, async () => {
    const response = await fetchChainRest<DenomsMetadataResponse>(
      chainId,
      '/cosmos/bank/v1beta1/denoms_metadata'
    )

    const denomMap = new Map<string, DenomInfo>()
    const DEFAULT_EXPONENT = 6

    for (const metadata of response.metadatas || []) {
      if (!metadata.base) continue

      const symbol = metadata.symbol || metadata.display || metadata.base
      const denomUnits = metadata.denom_units || metadata.denomUnits || []
      const displayUnit = denomUnits.find(
        unit => unit.denom === (metadata.display || metadata.symbol)
      )
      const exponent =
        typeof displayUnit?.exponent === 'number'
          ? displayUnit.exponent
          : DEFAULT_EXPONENT

      denomMap.set(metadata.base, { symbol, exponent })
    }

    return denomMap
  })
}

function getBridgeTokensByChain(
  chainId: string,
  chainName: string
): Promise<BridgeTokensByChainResponse> {
  const cacheKey = `${chainId}:${chainName}`

  return cachedBridgeTokensFetch(cacheKey, () =>
    fetchChainRest<BridgeTokensByChainResponse>(
      chainId,
      '/fx/crosschain/v1/bridge_tokens_by_chain',
      { chain_name: chainName }
    )
  )
}

// --- Public API ---

export function getModuleAccountBalances(
  chainId: string
): Promise<ModuleAccountBalance[]> {
  return cachedModuleAccountBalancesFetch(chainId, async () => {
    const chain = getChainConfig(chainId)
    const moduleAccounts = await getModuleAccounts(chainId)

    const items = await Promise.all(
      moduleAccounts.map(async account => {
        try {
          const balances = await getBalancesByAddress(chainId, account.address)
          const primaryCoin = balances.find(b => b.denom === chain.adenom)

          return {
            ...account,
            balances: primaryCoin ? [primaryCoin] : [],
            primaryAmount: normalizeAmountByExponent(
              primaryCoin?.amount,
              chain.decimals
            ),
          }
        } catch (error) {
          console.error(
            `Failed to fetch balances for module account ${account.address}`,
            error
          )

          return {
            ...account,
            balances: [],
            primaryAmount: '0',
          }
        }
      })
    )

    return items.sort((a, b) => {
      const amountA = Number(a.primaryAmount)
      const amountB = Number(b.primaryAmount)
      return amountB - amountA
    })
  })
}

export function getErc20ModuleBalances(
  chainId: string
): Promise<Erc20ModuleBalance[]> {
  return cachedErc20ModuleBalancesFetch(chainId, async () => {
    const chain = getChainConfig(chainId)
    const [denomMetadataMap, account] = await Promise.all([
      getDenomMetadataMap(chainId),
      getModuleAccountByName(chainId, 'erc20'),
    ])

    if (!account || !isErc20ModuleAccount(account.name)) {
      return []
    }

    try {
      const balances: DisplayCoinBalance[] = (
        await getBalancesByAddress(chainId, account.address)
      ).map(balance => ({
        ...balance,
        ...resolveDisplayBalance(balance, chain, denomMetadataMap),
      }))

      return [
        {
          moduleName: account.name,
          address: account.address,
          permissions: account.permissions,
          balances,
        },
      ]
    } catch (error) {
      console.error(
        `Failed to fetch balances for erc20 module ${account.address}`,
        error
      )

      return [
        {
          moduleName: account.name,
          address: account.address,
          permissions: account.permissions,
          balances: [],
        },
      ]
    }
  })
}

export function getCrosschainModuleBalances(
  chainId: string
): Promise<CrosschainModuleBalance[]> {
  return cachedCrosschainModuleBalancesFetch(chainId, async () => {
    const [crosschainModuleAccounts, denomMetadataMap] = await Promise.all([
      getCrosschainModuleAccounts(chainId),
      getDenomMetadataMap(chainId),
    ])

    const items = await Promise.all(
      crosschainModuleAccounts.map(
        async ({ chainName, account: moduleAccount }) => {
          try {
            const [balancesRes, bridgeTokensRes] = await Promise.all([
              getBalancesByAddress(chainId, moduleAccount.address),
              getBridgeTokensByChain(chainId, chainName),
            ])

            const bridgeDenomMap = new Map<string, string>()
            for (const token of bridgeTokensRes.bridge_tokens || []) {
              if (token.chain_name && token.contract && token.denom) {
                bridgeDenomMap.set(token.chain_name + token.contract, token.denom)
              }
            }

            const chain = getChainConfig(chainId)
            const balances: DisplayCoinBalance[] = balancesRes.map(balance => {
              const bridgeDenom = bridgeDenomMap.get(balance.denom)
              const resolveBalance = bridgeDenom
                ? { ...balance, denom: bridgeDenom }
                : balance
              return {
                ...balance,
                ...resolveDisplayBalance(resolveBalance, chain, denomMetadataMap),
              }
            })

            return {
              chainName,
              moduleName: moduleAccount.name,
              address: moduleAccount.address,
              permissions: moduleAccount.permissions,
              balances,
            }
          } catch (error) {
            console.error(
              `Failed to fetch balances for crosschain module ${chainName}`,
              error
            )

            return {
              chainName,
              moduleName: moduleAccount.name,
              address: moduleAccount.address,
              permissions: moduleAccount.permissions,
              balances: [],
            }
          }
        }
      )
    )

    return items.sort((a, b) => a.chainName.localeCompare(b.chainName))
  })
}

export function getTotalSupply(chainId: string): Promise<SupplyBalance[]> {
  return cachedSupplyFetch(chainId, async () => {
    const chain = getChainConfig(chainId)

    // Fetch all supply items with pagination
    const allSupply: CoinBalance[] = []
    let nextKey: string | null | undefined = undefined

    do {
      const params: Record<string, string | number | boolean | undefined> = {
        'pagination.limit': 100,
      }
      if (nextKey) {
        params['pagination.key'] = nextKey
      }

      const response = await fetchChainRest<SupplyResponse>(
        chainId,
        '/cosmos/bank/v1beta1/supply',
        params
      )

      allSupply.push(...(response.supply || []))
      nextKey = response.pagination?.next_key
    } while (nextKey)

    // Build bridge denom map: raw denom (chainName + contract) → metadata denom
    const [denomMetadataMap, crosschainModuleAccounts] = await Promise.all([
      getDenomMetadataMap(chainId),
      getCrosschainModuleAccounts(chainId),
    ])

    const bridgeDenomMap = new Map<string, string>()
    await Promise.all(
      crosschainModuleAccounts.map(async ({ chainName }) => {
        try {
          const bridgeTokensRes = await getBridgeTokensByChain(
            chainId,
            chainName
          )
          for (const token of bridgeTokensRes.bridge_tokens || []) {
            if (token.chain_name && token.contract && token.denom) {
              bridgeDenomMap.set(
                token.chain_name + token.contract,
                token.denom
              )
            }
          }
        } catch {
          // skip failed bridge token fetches
        }
      })
    )

    const PRIORITY_DENOMS = ['btc', 'eth', 'usdt', 'pundiai', 'pundix', 'usdc']

    function getDenomPriority(displayDenom: string): number {
      const normalized = displayDenom.toLowerCase()
      const index = PRIORITY_DENOMS.indexOf(normalized)
      return index >= 0 ? index : PRIORITY_DENOMS.length
    }

    return allSupply
      .map(coin => {
        const bridgeDenom = bridgeDenomMap.get(coin.denom)
        const resolveTarget = bridgeDenom
          ? { ...coin, denom: bridgeDenom }
          : coin
        const resolved = resolveDisplayBalance(resolveTarget, chain, denomMetadataMap)

        return {
          ...coin,
          rawDenom: coin.denom,
          amount: resolved.amount,
          displayDenom: resolved.displayDenom,
        }
      })
      .sort((a, b) => {
        const pa = getDenomPriority(a.displayDenom || a.rawDenom)
        const pb = getDenomPriority(b.displayDenom || b.rawDenom)
        if (pa !== pb) return pa - pb
        return (a.displayDenom || a.rawDenom).localeCompare(
          b.displayDenom || b.rawDenom
        )
      })
  })
}
