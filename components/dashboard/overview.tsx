"use client"

import { useDashboard } from "@/hooks/use-dashboard";
import { WalletIcon, PlusIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { DashboardOverviewTile } from "./overview-tile";
import { useTokens } from "@/contexts/tokens-context";

export function DashboardOverview() {
  const { stats } = useDashboard();
  const { openTokenModal } = useTokens();

  return (
    <div className="flex space-x-4">
      <DashboardOverviewTile
        title="Current Balance"
        value={stats.tokenBalance}
        description="Available tokens in wallet"
        icon={<WalletIcon className="h-5 w-5 text-primary" />}
      />
      
      <DashboardOverviewTile
        title="Monthly Usage"
        value={45}
        description="Tokens used this month"
        icon={<ArrowTrendingUpIcon className="h-5 w-5 text-primary" />}
      />
      
      <DashboardOverviewTile
        title="Add Tokens"
        value="Re-Up"
        description="Purchase more tokens"
        icon={<PlusIcon className="h-5 w-5 text-primary" />}
        onClick={openTokenModal}
      />
    </div>
  );
}