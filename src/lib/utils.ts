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
