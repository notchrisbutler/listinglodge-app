"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ListingDescriptionTool() {
  return (
    <Card className="border border-border/50 shadow-md bg-background">
      <CardHeader>
        <CardTitle>AI-Powered Listing Descriptions</CardTitle>
        <CardDescription>
          Generate SEO-optimized property descriptions using AI. Input property details and receive engaging descriptions tailored to your target audience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Input placeholder="e.g., Single-family home, Condo" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Neighborhood</label>
              <Input placeholder="e.g., Downtown, Suburbia" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Key Features</label>
            <Textarea placeholder="List key features of the property (bedrooms, bathrooms, special amenities, etc.)" rows={3} />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Target Audience</label>
            <Input placeholder="e.g., First-time buyers, Investors, Luxury buyers" />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Tone</label>
            <Input placeholder="e.g., Professional, Casual, Luxurious" />
          </div>
          
          <Button className="w-full">Generate Listing Description</Button>
          
          <div className="mt-6">
            <label className="text-sm font-medium mb-2 block">Generated Description</label>
            <Textarea placeholder="Your AI-generated listing description will appear here..." rows={6} className="bg-muted/50" />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Copy</Button>
            <Button variant="outline">Regenerate</Button>
            <Button>Save</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 