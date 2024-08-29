'use client'

import React from 'react'
import '@dialectlabs/blinks/index.css'
import { useAction, Blink } from "@dialectlabs/blinks"
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"

interface BlinkPreviewProps {
  serverId: string
  code: string
}

export const BlinkPreview: React.FC<BlinkPreviewProps> = ({ serverId, code }) => {
  const actionApiUrl = `https://blinkord.onrender.com/${serverId}?code=${code}`
  const { adapter } = useActionSolanaWalletAdapter(process.env.NEXT_PUBLIC_HELIUS_URL!)
  const { action } = useAction({ url: actionApiUrl, adapter })

  if (!action) return null

  return (
    <div className="p-4 rounded-lg ">
      <div className="w-full h-full overflow-hidden rounded-lg">
        <Blink action={action} websiteText={new URL(actionApiUrl).hostname} />
      </div>
    </div>
  )
}

export { BlinkPreview as BlinkDisplay }
