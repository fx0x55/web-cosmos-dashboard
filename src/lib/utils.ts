import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
