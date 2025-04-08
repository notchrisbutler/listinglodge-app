import { useState } from 'react';

interface DashboardStats {
  tokenBalance: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    tokenBalance: 100,
  });

  return {
    stats,
    setStats,
  };
}