"use client"

import { ReactNode } from "react";
import { TokenPurchaseModal } from "@/components/tokens/token-purchase-modal";
import { TokensProvider, useTokens } from "@/contexts/tokens-context";

export function TokensWrapper({ children }: { children: ReactNode }) {
  return (
    <TokensProvider>
      <TokensContent>{children}</TokensContent>
    </TokensProvider>
  );
}

function TokensContent({ children }: { children: ReactNode }) {
  const { isTokenModalOpen, openTokenModal, closeTokenModal } = useTokens();

  return (
    <>
      {children}
      <TokenPurchaseModal 
        isOpen={isTokenModalOpen} 
        onClose={closeTokenModal} 
      />
    </>
  );
} 