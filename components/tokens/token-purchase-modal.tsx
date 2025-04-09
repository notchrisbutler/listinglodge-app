"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletIcon, CheckCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider' // Import useAuth
import { createStripeCheckoutSession } from '@/app/actions/stripe' // Import Server Action
import { toast } from 'sonner' // Or your preferred toast library
import { useSearchParams } from 'next/navigation' // Import to detect checkout return

// Define package structure
interface TokenPackage {
  id: '30' | '100' | '250'
  tokens: number
  price: number // Price in USD (or your currency)
  description: string
}

const tokenPackages: TokenPackage[] = [
  {
    id: '30',
    tokens: 30,
    price: 6.99,
    description: '$6.99',
  },
  {
    id: '100',
    tokens: 100,
    price: 14.99,
    description: '$14.99',
  },
  {
    id: '250',
    tokens: 250,
    price: 32.99,
    description: '$32.99',
  },
]

interface TokenPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TokenPurchaseModal({
  isOpen,
  onClose,
}: TokenPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage['id']>(
    tokenPackages[0].id // Default to the first package
  )
  const [isLoading, setIsLoading] = useState(false)
  const { user, refreshTokenBalance } = useAuth() // Get refreshTokenBalance
  const searchParams = useSearchParams() // To detect checkout returns

  // Check for successful payment and refresh balance if needed
  useEffect(() => {
    const checkoutSuccess = searchParams.get('checkout_success')
    const sessionId = searchParams.get('session_id')
    
    if (checkoutSuccess === 'true' && sessionId) {
      console.log('Detected successful Stripe checkout, refreshing token balance')
      // Refresh token balance to reflect the purchase
      refreshTokenBalance()
      // Show success toast with soft purple styling
      toast.success('Payment successful! Your tokens have been added to your account.', {
        duration: 10000, // Auto-dismiss after 10 seconds
        closeButton: false,
        className: 'checkout-success-toast',
        position: 'top-center', // Position at the top center of the screen
        style: {
          padding: '16px',
        },
        action: {
          label: 'Dismiss',
          onClick: () => {
            // Any additional actions on dismissal if needed
          }
        },
        dismissible: true,
      })
    }
  }, [searchParams, refreshTokenBalance])

  // Reset state when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false)
      setSelectedPackage(tokenPackages[0].id)
    }
  }, [isOpen])

  const handlePurchaseClick = async () => {
    if (!selectedPackage || !user) {
      toast.error('Please select a package and ensure you are logged in.', {
        position: 'top-center',
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the Server Action with current URL for redirection back to tokens page
      const result = await createStripeCheckoutSession({
        packageId: selectedPackage,
        returnUrl: window.location.href.split('?')[0], // Use current URL without query params
      })

      // Check for errors first
      if (result?.error) {
        toast.error(result.error, {
          position: 'top-center',
        })
        setIsLoading(false)
        return
      }

      // Check for URL in the response
      if (result?.url) {
        // Client-side redirect to Stripe checkout
        window.location.href = result.url
        return // Important: stop execution here as we're redirecting
      }

      // If we got here, something unexpected happened
      toast.error('Something went wrong. Please try again.', {
        position: 'top-center',
      })
      setIsLoading(false)

    } catch (error: any) {
      console.error('Error calling createStripeCheckoutSession:', error)
      toast.error('An unexpected error occurred. Please try again.', {
        position: 'top-center',
      })
      setIsLoading(false)
    }
  }

  const handleModalChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Purchase Tokens</DialogTitle>
          <DialogDescription>
            Select a package below to add tokens to your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* One-time purchase options */}
          <div>
            <h3 className="text-sm font-medium mb-3">One-time Purchase</h3>
            <RadioGroup
              value={selectedPackage}
              onValueChange={(value: TokenPackage['id']) =>
                setSelectedPackage(value)
              }
              className="grid grid-cols-1 gap-4"
            >
              {tokenPackages.map((pkg) => (
                <Label
                  key={pkg.id}
                  htmlFor={`package-${pkg.id}`}
                  className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                    selectedPackage === pkg.id ? 'border-primary' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={pkg.id} id={`package-${pkg.id}`} />
                    <span className="font-medium">
                      {pkg.tokens} Tokens
                    </span>
                  </div>
                  <span>{pkg.description}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchaseClick}
            disabled={!selectedPackage || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Purchase Tokens
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 