'use client'

import React, { useContext } from 'react'
import '@dialectlabs/blinks/index.css'
import { useAction, Blink } from "@dialectlabs/blinks"
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana"
import { ThemeContext } from '@/lib/contexts/ThemeProvider'
import { BlinkCardSkeleton } from '../skeletons/blink-skeleton'

interface BlinkPreviewProps {
  serverId: string
  code?: string
}

export const BlinkDisplay: React.FC<BlinkPreviewProps> = ({ serverId, code }) => {
  const { isDark } = useContext(ThemeContext);

  const actionApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}?showRoles=true${code ? `&code=${code}` : ''}`;

  const { adapter } = useActionSolanaWalletAdapter(process.env.NEXT_PUBLIC_HELIUS_URL!)
  const { action, isLoading } = useAction({ url: actionApiUrl, adapter });

  const stylePreset = isDark ? 'x-dark' : 'default';

  return (
    <div className="p-4 rounded-lg ">
      <div className="w-full h-full overflow-hidden rounded-lg">
        {(isLoading || !action)
          ? <BlinkCardSkeleton />
          : <Blink action={action!} websiteText='blinkord.com' stylePreset={stylePreset} />
        }
      </div>
    </div>
  )
}
