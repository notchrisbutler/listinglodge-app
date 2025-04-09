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
    tokens: 10,
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
  const { user } = useAuth() // Get user from context

  // Reset state when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false)
      setSelectedPackage(tokenPackages[0].id)
    }
  }, [isOpen])

  const handlePurchaseClick = async () => {
    if (!selectedPackage || !user) {
      // Should ideally not happen if button isn't disabled, but good practice
      toast.error('Please select a package and ensure you are logged in.')
      return
    }

    setIsLoading(true)

    try {
      // Call the Server Action
      const result = await createStripeCheckoutSession({
        packageId: selectedPackage,
      })

      // Server Action handles redirect on success.
      // If an error object is returned, handle it here.
      if (result?.error) {
          toast.error(result.error)
          setIsLoading(false)
      }
      // If the server action redirects, this part might not be reached,
      // or might be reached briefly before navigation.
      // No need to manually redirect here if the action uses `redirect()`.

    } catch (error: any) {
      // Catch unexpected errors during action call (less common with server actions)
      console.error('Error calling createStripeCheckoutSession:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }

    // We don't set isLoading false here if redirecting,
    // as the component might unmount or navigation takes over.
    // If the action returns an error, we set it above.
  }

  const handleModalChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Tokens</DialogTitle>
          <DialogDescription>
            Select a package below to add tokens to your wallet. You will be
            redirected to Stripe to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchaseClick}
            disabled={!selectedPackage || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 