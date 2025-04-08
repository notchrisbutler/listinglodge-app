"use client"

import { useState } from "react";
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

// Token purchase options - replace with actual Stripe product data
export const tokenOptions = [
  { id: "prod_1", tokens: 10, price: "$10", stripeProductId: "price_placeholder_1" },
  { id: "prod_2", tokens: 30, price: "$27 (10% off)", stripeProductId: "price_placeholder_2" },
  { id: "prod_3", tokens: 75, price: "$60 (20% off)", stripeProductId: "price_placeholder_3" },
  { id: "prod_4", tokens: 150, price: "$105 (30% off)", stripeProductId: "price_placeholder_4" },
];

// Define payment steps
type PaymentStep = "select" | "confirm" | "processing" | "complete";

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenPurchaseModal({ isOpen, onOpenChange }: TokenPurchaseModalProps) {
  const [selectedOption, setSelectedOption] = useState<typeof tokenOptions[0] | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("select");

  // Function to proceed to confirmation step
  const handleProceedToConfirm = () => {
    if (!selectedOption) return;
    setPaymentStep("confirm");
  };

  // Placeholder function for handling actual payment confirmation
  const handleConfirmPayment = () => {
    if (!selectedOption) return;
    console.log("Simulating Stripe payment for:", selectedOption);
    setPaymentStep("processing");

    // Simulate API call/payment processing delay
    setTimeout(() => {
      console.log("Payment simulation complete for:", selectedOption);
      setPaymentStep("complete");
      // In a real app, you might trigger a refetch of user credits here
    }, 2500); // Simulate a 2.5-second delay
  };

  // Reset state when modal closes or changes state
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Delay reset slightly to allow closing animation
      setTimeout(() => {
        setSelectedOption(null);
        setPaymentStep("select");
      }, 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Add Credits Modal - Content changes based on paymentStep */}
      <DialogContent className="sm:max-w-md min-h-[350px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {paymentStep === "select" && "Add More Credits"}
            {paymentStep === "confirm" && "Confirm Purchase"}
            {paymentStep === "processing" && "Processing Payment"}
            {paymentStep === "complete" && "Purchase Successful"}
          </DialogTitle>
          <DialogDescription>
            {paymentStep === "select" &&
              "Select a token package to top up your account."}
            {paymentStep === "confirm" &&
              "Review your selection and proceed to payment."}
            {paymentStep === "processing" &&
              "Please wait while we securely process your payment."}
            {paymentStep === "complete" &&
              `Successfully added ${selectedOption?.tokens} tokens to your account!`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow py-4 overflow-y-auto">
          {paymentStep === "select" && (
            <div className="grid gap-4">
              {tokenOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer border p-4 rounded-md transition-all ${
                    selectedOption?.id === option.id
                      ? "border-primary ring-2 ring-primary/50"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{option.tokens} Tokens</p>
                      <p className="text-sm text-muted-foreground">{option.price}</p>
                    </div>
                    {selectedOption?.id === option.id && (
                      <CheckCircleIcon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {paymentStep === "confirm" && selectedOption && (
            <div className="space-y-4">
              <Card className="border border-border/50 shadow-md bg-background p-4">
                <p className="font-semibold">You are purchasing:</p>
                <p className="text-lg font-bold">{selectedOption.tokens} Tokens</p>
                <p className="text-muted-foreground">{selectedOption.price}</p>
              </Card>
              {/* Placeholder for Stripe Elements */}
              <div className="border border-dashed border-border rounded-md p-6 text-center text-muted-foreground">
                <CreditCardIcon className="h-8 w-8 mx-auto mb-2" />
                <p>Stripe Payment Element Placeholder</p>
                <p className="text-xs">(Secure payment form would appear here)</p>
              </div>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <ArrowPathIcon className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Processing your secure payment...</p>
            </div>
          )}

          {paymentStep === "complete" && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
              <p className="text-lg font-semibold">Payment Successful!</p>
              <p className="text-muted-foreground">
                {selectedOption?.tokens} tokens have been added to your wallet.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-auto pt-4 border-t border-border">
          {paymentStep === "select" && (
            <Button
              onClick={handleProceedToConfirm}
              disabled={!selectedOption}
            >
              Continue
            </Button>
          )}
          {paymentStep === "confirm" && (
            <>
              <Button variant="outline" onClick={() => setPaymentStep("select")}>Back</Button>
              <Button onClick={handleConfirmPayment}>
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Confirm & Pay {selectedOption?.price}
              </Button>
            </>
          )}
          {paymentStep === "complete" && (
             <DialogClose asChild>
                 <Button>Done</Button>
             </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 