export interface AddressLabel {
  label: string
  className: string
}

const ADDRESS_LABELS: Record<string, AddressLabel> = {
  fx1y67qg6l6s8le7wxscuqag44lmu6t0a5ue4prfs: {
    label: 'attacker',
    className:
      'shrink-0 border-red-500/50 bg-red-500/15 font-mono text-red-500 font-bold animate-pulse',
  },
}

export function getAddressLabel(address: string): AddressLabel | undefined {
  return ADDRESS_LABELS[address]
}

export function getAccountTypeLabels(account: {
  address_type?: number
  pub_key_type?: number
}): AddressLabel[] {
  const labels: AddressLabel[] = []

  if (account.address_type === 1) {
    labels.push({
      label: 'contract',
      className:
        'shrink-0 border-purple-500/30 bg-purple-500/10 font-mono text-purple-600 dark:text-purple-400',
    })
  } else if (account.pub_key_type === 1) {
    labels.push({
      label: 'old_addr',
      className:
        'shrink-0 border-orange-500/30 bg-orange-500/10 font-mono text-orange-600 dark:text-orange-400',
    })
  } else if (account.pub_key_type === 2) {
    labels.push({
      label: 'new_addr',
      className:
        'shrink-0 border-emerald-500/30 bg-emerald-500/10 font-mono text-emerald-600 dark:text-emerald-400',
    })
  }

  return labels
}
