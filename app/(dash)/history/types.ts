export interface HistoricalDocument<T> {
  id: string;
  type: string;
  content: T;
  date: string;
  metadata?: Record<string, unknown>;
}

export interface ListingDescription {
  title?: string;
  description: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
}

export interface SocialMediaPost {
  platform: string;
  content: string;
  hashtags?: string[];
  imageUrls?: string[];
}

export interface AudienceTarget {
  targetAudience: string;
  demographics?: string[];
  interests?: string[];
  marketingStrategy?: string;
}

export type ListingHistoryItem = HistoricalDocument<ListingDescription>;
export type SocialMediaHistoryItem = HistoricalDocument<SocialMediaPost>;
export type AudienceHistoryItem = HistoricalDocument<AudienceTarget>;

export type HistoryItem = ListingHistoryItem | SocialMediaHistoryItem | AudienceHistoryItem; 