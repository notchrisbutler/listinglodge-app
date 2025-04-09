"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon } from "@heroicons/react/24/outline";
import { DashboardOverview } from "@/components/dashboard/overview";
import { HistoryItemModal } from "@/components/history/history-item-modal";
import { useState } from "react";
import { HistoryItem, ListingDescription, SocialMediaPost, AudienceTarget } from "./types";

// Example data - replace with real data from your backend
const historyItems: HistoryItem[] = [
  {
    id: "1",
    type: "Property Description",
    content: {
      title: "Oceanfront Villa",
      description: "Luxurious 4-bedroom villa with panoramic ocean views...",
      propertyType: "Villa",
      bedrooms: 4,
      amenities: ["Ocean View", "Private Pool", "Gourmet Kitchen"]
    },
    date: "2024-03-20",
  },
  {
    id: "2",
    type: "Social Media Post",
    content: {
      platform: "Instagram",
      content: "Just listed! Stunning modern apartment in downtown...",
      hashtags: ["#LuxuryLiving", "#RealEstate", "#NewListing"]
    },
    date: "2024-03-19",
  },
  {
    id: "3",
    type: "Audience Target",
    content: {
      targetAudience: "Luxury home buyers in coastal areas",
      demographics: ["High net worth", "35-65 age range"],
      interests: ["Luxury Real Estate", "Beach Living"],
      marketingStrategy: "Focus on exclusive waterfront properties and luxury amenities..."
    },
    date: "2024-03-18",
  },
];

export default function HistoryPage() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">Generation History</h1>
              <p className="text-muted-foreground text-lg">
                View and manage your content generation history.
              </p>
            </div>
            <DashboardOverview />
          </div>

          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card 
                key={item.id} 
                className="border border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-medium">{item.type}</CardTitle>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.type === "Property Description" && (item.content as ListingDescription).description}
                    {item.type === "Social Media Post" && (item.content as SocialMediaPost).content}
                    {item.type === "Audience Target" && (item.content as AudienceTarget).targetAudience}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <HistoryItemModal
        item={selectedItem}
        open={selectedItem !== null}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </main>
  );
}