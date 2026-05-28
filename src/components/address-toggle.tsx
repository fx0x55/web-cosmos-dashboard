'use client'

import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/copy-button'

interface AddressToggleProps {
  address: string
  ethAddress?: string
  explorerBaseUrl?: string
}

export function AddressToggle({
  address,
  ethAddress,
  explorerBaseUrl,
}: AddressToggleProps) {
  const [showEth, setShowEth] = useState(false)
  const hasEth = !!ethAddress
  const currentAddress = hasEth && showEth ? ethAddress : address

  return (
    <div className="flex w-fit items-center gap-3 rounded-md border border-white/10 bg-muted/50 p-2 pl-4">
      <a
        href={explorerBaseUrl ? `${explorerBaseUrl}${currentAddress}` : '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-mono text-base text-muted-foreground transition-colors hover:text-primary hover:underline">
        {currentAddress}
      </a>
      <CopyButton value={currentAddress} />
      {hasEth && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
          onClick={() => setShowEth(v => !v)}
          title={showEth ? 'Show Cosmos address' : 'Show ETH address'}>
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
