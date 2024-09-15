'use client'

import React, { useContext } from 'react'
import '@dialectlabs/blinks/index.css'
import { useAction, Blink } from "@dialectlabs/blinks"
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { ThemeContext } from '@/lib/contexts/ThemeProvider'

interface BlinkPreviewProps {
  serverId: string
  code?: string
  hideError?: boolean
}

export const BlinkDisplay: React.FC<BlinkPreviewProps> = ({ serverId, code, hideError }) => {
  const { isDark } = useContext(ThemeContext);

  const actionApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}${code ? `?code=${code}` : hideError ? `?hideError=${hideError}` : ''}`;

  const { adapter } = useActionSolanaWalletAdapter(process.env.NEXT_PUBLIC_HELIUS_URL!)
  const { action } = useAction({ url: actionApiUrl, adapter })

  if (!action) return null;

  const stylePreset = isDark ? 'x-dark' : 'default';

  return (
    <div className="p-4 rounded-lg ">
      <div className="w-full h-full overflow-hidden rounded-lg">
        <Blink action={action} websiteText='blinkord.com' stylePreset={stylePreset} />
      </div>
    </div>
  )
}
