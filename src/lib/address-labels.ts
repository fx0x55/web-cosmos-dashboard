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
