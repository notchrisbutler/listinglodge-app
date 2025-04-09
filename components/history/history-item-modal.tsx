import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HistoryItem, ListingHistoryItem, SocialMediaHistoryItem, AudienceHistoryItem } from "@/app/(dash)/history/types";
import { ClipboardIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface HistoryItemModalProps {
  item: HistoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryItemModal({ item, open, onOpenChange }: HistoryItemModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderListingDescription = (item: ListingHistoryItem) => (
    <div className="space-y-4">
      {item.content.title && (
        <div className="space-y-2">
          <h3 className="font-medium">Title</h3>
          <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-md">
            <p className="text-sm">{item.content.title}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => item.content.title && copyToClipboard(item.content.title, "title")}
            >
              <ClipboardIcon className={`h-4 w-4 ${copiedField === "title" ? "text-green-500" : ""}`} />
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <h3 className="font-medium">Description</h3>
        <div className="flex items-start justify-between gap-2 p-3 bg-muted rounded-md">
          <p className="text-sm whitespace-pre-wrap">{item.content.description}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(item.content.description, "description")}
          >
            <ClipboardIcon className={`h-4 w-4 ${copiedField === "description" ? "text-green-500" : ""}`} />
          </Button>
        </div>
      </div>
      {item.content.amenities && item.content.amenities.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {item.content.amenities.map((amenity, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSocialMediaPost = (item: SocialMediaHistoryItem) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Platform</h3>
          <span className="px-2 py-1 text-xs bg-primary/10 rounded-full">
            {item.content.platform}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 p-3 bg-muted rounded-md">
          <p className="text-sm whitespace-pre-wrap">{item.content.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(item.content.content, "social")}
          >
            <ClipboardIcon className={`h-4 w-4 ${copiedField === "social" ? "text-green-500" : ""}`} />
          </Button>
        </div>
      </div>
      {item.content.hashtags && item.content.hashtags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {item.content.hashtags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAudienceTarget = (item: AudienceHistoryItem) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium">Target Audience</h3>
        <div className="flex items-start justify-between gap-2 p-3 bg-muted rounded-md">
          <p className="text-sm whitespace-pre-wrap">{item.content.targetAudience}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(item.content.targetAudience, "audience")}
          >
            <ClipboardIcon className={`h-4 w-4 ${copiedField === "audience" ? "text-green-500" : ""}`} />
          </Button>
        </div>
      </div>
      {item.content.demographics && item.content.demographics.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Demographics</h3>
          <div className="flex flex-wrap gap-2">
            {item.content.demographics.map((demo, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 rounded-full">
                {demo}
              </span>
            ))}
          </div>
        </div>
      )}
      {item.content.marketingStrategy && (
        <div className="space-y-2">
          <h3 className="font-medium">Marketing Strategy</h3>
          <div className="flex items-start justify-between gap-2 p-3 bg-muted rounded-md">
            <p className="text-sm whitespace-pre-wrap">{item.content.marketingStrategy}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => item.content.marketingStrategy && copyToClipboard(item.content.marketingStrategy, "strategy")}
            >
              <ClipboardIcon className={`h-4 w-4 ${copiedField === "strategy" ? "text-green-500" : ""}`} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (!item) return null;

    switch (item.type) {
      case "Property Description":
        return renderListingDescription(item as ListingHistoryItem);
      case "Social Media Post":
        return renderSocialMediaPost(item as SocialMediaHistoryItem);
      case "Audience Target":
        return renderAudienceTarget(item as AudienceHistoryItem);
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <DialogTitle>{item?.type}</DialogTitle>
          </div>
          <DialogDescription>
            {item && `Generated on ${format(new Date(item.date), "MMMM d, yyyy")}`}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
} 