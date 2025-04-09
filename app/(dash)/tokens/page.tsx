"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, PlusIcon } from "@heroicons/react/24/outline";
import { DashboardOverview } from "@/components/dashboard/overview";
import { useTokens } from "@/contexts/tokens-context";
import { useAuth } from "@/components/providers/auth-provider";

export default function TokensPage() {
  const { openTokenModal } = useTokens();
  const { user, isLoading, tokenWallet } = useAuth();
  
  // Get token balance with fallback to 0
  const tokenBalance = tokenWallet?.balance || 0;

  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Token Wallet</h1>
              <p className="text-muted-foreground text-lg">
                Manage your generation tokens and credits.
              </p>
            </div>
            <DashboardOverview />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border/50 shadow-md bg-background hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Available Credits</CardTitle>
                <WalletIcon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-4">
                  <div className="text-3xl font-bold">{tokenBalance}</div>
                  <p className="text-sm text-muted-foreground">
                    Credits refresh on the 1st of each month
                  </p>
                  <Button className="w-full" onClick={openTokenModal}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add More Credits
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-md bg-background hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Usage History</CardTitle>
                <WalletIcon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Property Descriptions</span>
                      <span className="font-medium text-accent-secondary">45 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Social Media Posts</span>
                      <span className="font-medium text-accent-secondary">30 credits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Photo Enhancements</span>
                      <span className="font-medium text-accent-secondary">25 credits</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}