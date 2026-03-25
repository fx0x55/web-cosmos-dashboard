import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Chain, CoinBalance, DenomInfo } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAmount(
  value: string | number | undefined | null
): string {
  if (value === undefined || value === null) return '0.00'
  const str = value.toString()
  const [integerPart, decimalPart] = str.split('.')

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formattedDecimal = (decimalPart || '').substring(0, 2).padEnd(2, '0')

  return `${formattedInteger}.${formattedDecimal}`
}

export function normalizeAmountByExponent(
  amount: string | undefined | null,
  exponent: number
): string {
  if (!amount) return '0'

  try {
    const value = BigInt(amount)
    const divisor = 10n ** BigInt(exponent)
    const integer = value / divisor
    const fraction = value % divisor

    if (fraction === 0n) {
      return integer.toString()
    }

    const fractionString = fraction
      .toString()
      .padStart(exponent, '0')
      .replace(/0+$/, '')

    return `${integer.toString()}.${fractionString}`
  } catch {
    return amount
  }
}

export function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values))
}

export function normalizeModuleName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function dedupeModuleAccountsByAddress<T extends { address: string }>(
  accounts: T[]
): T[] {
  const uniqueAccounts = new Map<string, T>()

  for (const account of accounts) {
    if (!account.address || uniqueAccounts.has(account.address)) {
      continue
    }

    uniqueAccounts.set(account.address, account)
  }

  return Array.from(uniqueAccounts.values())
}

export function resolveDisplayBalance(
  balance: CoinBalance,
  chain: Chain,
  denomMetadataMap: Map<string, DenomInfo>
): { amount: string; displayDenom: string } {
  if (balance.denom === chain.adenom) {
    return {
      amount: normalizeAmountByExponent(balance.amount, chain.decimals),
      displayDenom: chain.denom,
    }
  }

  const denomInfo = denomMetadataMap.get(balance.denom)
  return {
    amount: normalizeAmountByExponent(balance.amount, denomInfo?.exponent ?? 6),
    displayDenom: denomInfo?.symbol ?? balance.denom,
  }
}

export function extractBridgeContractAddress(
  denom: string,
  moduleName: string
): string | undefined {
  const match = denom.match(/^(.*?)(0x[a-fA-F0-9]{40})$/)

  if (!match) {
    return undefined
  }

  const [, prefix, contractAddress] = match

  if (normalizeModuleName(prefix) !== normalizeModuleName(moduleName)) {
    return undefined
  }

  return contractAddress.toLowerCase()
}

export function isErc20ModuleAccount(name: string): boolean {
  return normalizeModuleName(name) === 'erc20'
}

export function truncateAddress(address: string, start = 8, end = 6): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function formatDateTime(timestamp: number | string): string {
  if (!timestamp) return '-'
  return new Date(timestamp)
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
    .replace(',', '')
}

export function formatCountdown(
  targetTimestamp: number | string,
  now = Date.now()
): string {
  if (!targetTimestamp) return '-'

  const target =
    typeof targetTimestamp === 'string'
      ? Number(targetTimestamp)
      : targetTimestamp

  if (Number.isNaN(target)) return '-'

  const diffMs = target - now
  if (diffMs <= 0) return 'Completed'

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = [
    days > 0 ? `${days}d` : null,
    days > 0 || hours > 0 ? `${hours}h` : null,
    days > 0 || hours > 0 || minutes > 0 ? `${minutes}m` : null,
    `${seconds}s`,
  ].filter(Boolean)

  return parts.join(' ')
}
