"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface TokensContextType {
  isTokenModalOpen: boolean;
  openTokenModal: () => void;
  closeTokenModal: () => void;
}

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export function useTokens() {
  const context = useContext(TokensContext);
  if (context === undefined) {
    throw new Error("useTokens must be used within a TokensProvider");
  }
  return context;
}

interface TokensProviderProps {
  children: ReactNode;
}

export function TokensProvider({ children }: TokensProviderProps) {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const openTokenModal = () => setIsTokenModalOpen(true);
  const closeTokenModal = () => setIsTokenModalOpen(false);

  return (
    <TokensContext.Provider
      value={{
        isTokenModalOpen,
        openTokenModal,
        closeTokenModal,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
} 