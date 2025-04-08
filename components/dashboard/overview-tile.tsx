"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface DashboardOverviewTileProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  linkHref?: string;
  onClick?: () => void;
}

export function DashboardOverviewTile({
  title,
  value,
  description,
  icon,
  linkHref,
  onClick
}: DashboardOverviewTileProps) {
  const cardContent = (
    <Card className="border border-border/50 shadow-md bg-background hover:border-primary/50 hover:shadow-lg transition-all h-[120px] w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-accent-secondary">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="block w-[200px] flex-shrink-0 text-left"
      >
        {cardContent}
      </button>
    );
  }

  if (linkHref) {
    return (
      <Link href={linkHref} className="block w-[200px] flex-shrink-0">
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="w-[200px] flex-shrink-0">
      {cardContent}
    </div>
  );
} 