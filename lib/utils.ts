import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to construct absolute URLs
export function absoluteUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    // Log an error or throw, but ensure it doesn't crash server-side generation
    console.error("NEXT_PUBLIC_SITE_URL environment variable is not set.");
    // Return a relative path or a default base as a fallback
    return path; // Or potentially throw new Error(...)
  }
  // Ensure path starts with a slash if it doesn't already
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${formattedPath}`;
}
