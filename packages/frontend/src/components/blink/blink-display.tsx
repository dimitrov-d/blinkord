'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection, VersionedTransaction } from '@solana/web3.js'
import { Loader2, Shield, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import { BlinkCardSkeleton } from '../skeletons/blink-skeleton'

interface ActionLink {
  type: string
  label: string
  href: string
}

interface ActionData {
  type: string
  title: string
  description: string
  icon: string
  disabled?: boolean
  label?: string
  links?: {
    actions: ActionLink[]
  }
  error?: { message: string }
}

interface BlinkCardProps {
  serverId: string
  code?: string
  onRequireDiscord?: () => void
}

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

export const BlinkDisplay: React.FC<BlinkCardProps> = ({ serverId, code, onRequireDiscord }) => {
  const [actionData, setActionData] = useState<ActionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [buttonStatuses, setButtonStatuses] = useState<Record<number, ButtonStatus>>({})
  const [statusMessage, setStatusMessage] = useState<string>('')

  const { publicKey, signTransaction, connected } = useWallet()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    const fetchAction = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blinks/${serverId}?showRoles=true${code ? `&code=${code}` : ''}`
        const response = await fetch(url)
        const data = await response.json()
        setActionData(data)
      } catch (error) {
        console.error('Failed to fetch blink data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAction()
  }, [serverId, code])

  const handleAction = useCallback(async (action: ActionLink, index: number) => {
    if (actionData?.disabled) {
      onRequireDiscord?.()
      return
    }

    if (!connected || !publicKey) {
      setVisible(true)
      return
    }

    if (!signTransaction) {
      setStatusMessage('Wallet does not support transaction signing')
      return
    }

    setButtonStatuses(prev => ({ ...prev, [index]: 'loading' }))
    setStatusMessage('')

    try {
      const buyResponse = await fetch(action.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: publicKey.toString() }),
      })

      if (!buyResponse.ok) {
        const error = await buyResponse.json()
        throw new Error(error.message || error.error || 'Transaction failed')
      }

      const buyData = await buyResponse.json()

      const txBytes = Buffer.from(buyData.transaction, 'base64')
      const transaction = VersionedTransaction.deserialize(txBytes)

      const signedTx = await signTransaction(transaction)

      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!)
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
        maxRetries: 3,
      })

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, 'confirmed')

      if (buyData.links?.next?.href) {
        const confirmResponse = await fetch(buyData.links.next.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: publicKey.toString(), signature }),
        })

        const confirmData = await confirmResponse.json()
        if (confirmData.error) {
          throw new Error(confirmData.error.message)
        }
      }

      setButtonStatuses(prev => ({ ...prev, [index]: 'success' }))
      setStatusMessage('Transaction confirmed! Role assigned successfully.')
    } catch (error: any) {
      console.error('Transaction error:', error)
      setButtonStatuses(prev => ({ ...prev, [index]: 'error' }))
      setStatusMessage(error.message || 'Transaction failed')

      setTimeout(() => {
        setButtonStatuses(prev => ({ ...prev, [index]: 'idle' }))
        setStatusMessage('')
      }, 5000)
    }
  }, [actionData?.disabled, connected, publicKey, signTransaction, setVisible, onRequireDiscord])

  if (isLoading) {
    return <BlinkCardSkeleton />
  }

  if (!actionData) {
    return null
  }

  const descriptionLines = actionData.description?.split('\n') || []
  const websiteLine = descriptionLines.find(l => l.trim().toLowerCase().startsWith('website:'))
  const descriptionText = descriptionLines
    .filter(l => !l.trim().toLowerCase().startsWith('website:'))
    .join('\n')
    .trim()
  const websiteUrl = websiteLine?.replace(/website:/i, '').trim()

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-[#1a1b23] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
        {actionData.icon && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={actionData.icon}
              alt={actionData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">blinkord.com</span>
            <Shield className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
            {actionData.title}
          </h2>

          <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {descriptionText}
          </div>

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Website: {websiteUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <div className="space-y-2.5 pt-2">
            {actionData.links?.actions?.map((action, index) => {
              const status = buttonStatuses[index] || 'idle'
              const isDisabled = status === 'loading' || status === 'success'

              return (
                <button
                  key={index}
                  onClick={() => handleAction(action, index)}
                  disabled={isDisabled}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200
                    ${status === 'success'
                      ? 'bg-green-600 text-white cursor-default'
                      : status === 'error'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : isDisabled
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-[#4a4a5a] hover:bg-[#5a5a6a] text-white active:scale-[0.98]'
                    }`}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : status === 'success' ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </span>
                  ) : status === 'error' ? (
                    <span className="flex items-center justify-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Failed - Try Again
                    </span>
                  ) : (
                    action.label
                  )}
                </button>
              )
            })}
          </div>

          {statusMessage && (
            <p className={`text-xs text-center pt-1 ${
              statusMessage.includes('successfully') || statusMessage.includes('confirmed')
                ? 'text-green-500'
                : 'text-red-500'
            }`}>
              {statusMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
