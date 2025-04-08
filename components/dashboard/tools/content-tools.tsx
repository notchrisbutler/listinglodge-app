"use client"

import { useSearchParams } from "next/navigation"
import { ListingDescriptionTool } from "./listing-description-tool"
import { SocialMediaTool } from "./social-media-tool"
import { AudienceTargetingTool } from "./audience-targeting-tool"
import { ToolSwitcher } from "./tool-switcher"

export function ContentTools() {
  const searchParams = useSearchParams()
  const currentTool = searchParams.get("tool") || "listing"
  
  const renderTool = () => {
    switch(currentTool) {
      case "listing":
        return <ListingDescriptionTool />
      case "social":
        return <SocialMediaTool />
      case "customization":
        return <AudienceTargetingTool />
      default:
        return <ListingDescriptionTool />
    }
  }
  
  return (
    <div className="space-y-8">
      <ToolSwitcher />
      {renderTool()}
    </div>
  )
}