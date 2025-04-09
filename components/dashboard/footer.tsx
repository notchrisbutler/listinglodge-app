"use client"

import { HeartIcon } from "@heroicons/react/24/outline";

export function DashboardFooter() {
  return (
    <footer className="sticky bottom-0 border-t border-border/50 bg-background/75 backdrop-blur-md">
      <div className="mx-auto">
        <div className="flex h-14 items-center justify-between">
          <div className="w-72 pl-4 flex items-center border-r border-border/50">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ListingLodge. All rights reserved.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-end px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-3">
              <a 
                href="/support" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
              <a 
                href="/privacy" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a 
                href="/terms" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Made with</span>
                <HeartIcon className="h-3 w-3 text-primary" />
                <span>by ListingLodge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}